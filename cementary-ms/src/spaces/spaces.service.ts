import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { Space } from './entities/space.entity';

// Export the interface so it can be used in the controller
export interface SpaceResponse {
  space_id: number;
  space_number: string;
  lot_id: number;
  type: string;
  price: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  lot?: any;
  levels?: any[];
}

@Injectable()
export class SpacesService {
  constructor(
    @InjectRepository(Space)
    private spacesRepository: Repository<Space>,
  ) {}

  async create(createSpaceDto: CreateSpaceDto): Promise<SpaceResponse> {
    const space = this.spacesRepository.create(createSpaceDto);
    const savedSpace = await this.spacesRepository.save(space);
    
    // Return the space with lot data
    return this.findOne(savedSpace.space_id);
  }

  async findAll(): Promise<SpaceResponse[]> {
    const spaces = await this.spacesRepository.find();
    
    // Manually load related data for the response
    const spacesWithRelations = await Promise.all(
      spaces.map(async (space) => {
        try {
          // Load lot and levels
          const lot = await space.lot;
          const levels = await space.levels;
          
          let lotData: any = null;
          let gardenData: any = null;
          let cemeteryData: any = null;
          
          if (lot) {
            lotData = { ...lot };
            const garden = await lot.garden;
            if (garden) {
              gardenData = { ...garden };
              const cemetery = await garden.cemetery;
              if (cemetery) {
                cemeteryData = { ...cemetery };
              }
            }
          }
          
          // Create a plain object with the loaded relations
          const response: SpaceResponse = {
            space_id: space.space_id,
            space_number: space.space_number,
            lot_id: space.lot_id,
            type: space.type,
            price: space.price,
            status: space.status,
            created_at: space.created_at,
            updated_at: space.updated_at,
            lot: lotData ? {
              ...lotData,
              garden: gardenData ? {
                ...gardenData,
                cemetery: cemeteryData
              } : null
            } : null,
            levels: levels ? levels.map(level => ({ ...level })) : []
          };
          
          return response;
        } catch (error) {
          console.error(`Error loading relations for space ${space.space_id}:`, error);
          return {
            space_id: space.space_id,
            space_number: space.space_number,
            lot_id: space.lot_id,
            type: space.type,
            price: space.price,
            status: space.status,
            created_at: space.created_at,
            updated_at: space.updated_at,
            lot: null,
            levels: []
          };
        }
      })
    );
    
    return spacesWithRelations;
  }

  async findOne(id: number): Promise<SpaceResponse> {
    const space = await this.spacesRepository.findOne({
      where: { space_id: id }
    });
    
    if (!space) {
      throw new NotFoundException(`Space with ID ${id} not found`);
    }
    
    try {
      // Load lot and levels
      const lot = await space.lot;
      const levels = await space.levels;
      
      let lotData: any = null;
      let gardenData: any = null;
      let cemeteryData: any = null;
      
      if (lot) {
        lotData = { ...lot };
        const garden = await lot.garden;
        if (garden) {
          gardenData = { ...garden };
          const cemetery = await garden.cemetery;
          if (cemetery) {
            cemeteryData = { ...cemetery };
          }
        }
      }
      
      // Create a plain object with the loaded relations
      const response: SpaceResponse = {
        space_id: space.space_id,
        space_number: space.space_number,
        lot_id: space.lot_id,
        type: space.type,
        price: space.price,
        status: space.status,
        created_at: space.created_at,
        updated_at: space.updated_at,
        lot: lotData ? {
          ...lotData,
          garden: gardenData ? {
            ...gardenData,
            cemetery: cemeteryData
          } : null
        } : null,
        levels: levels ? levels.map(level => ({ ...level })) : []
      };
      
      return response;
    } catch (error) {
      console.error(`Error loading relations for space ${id}:`, error);
      return {
        space_id: space.space_id,
        space_number: space.space_number,
        lot_id: space.lot_id,
        type: space.type,
        price: space.price,
        status: space.status,
        created_at: space.created_at,
        updated_at: space.updated_at,
        lot: null,
        levels: []
      };
    }
  }

  async update(id: number, updateSpaceDto: UpdateSpaceDto): Promise<SpaceResponse> {
    const existingSpace = await this.spacesRepository.findOne({
      where: { space_id: id }
    });
    
    if (!existingSpace) {
      throw new NotFoundException(`Space with ID ${id} not found`);
    }
    
    // Remove space_id if it exists in the DTO (using type assertion)
    const updateData = updateSpaceDto as any;
    if (updateData.space_id) {
      delete updateData.space_id;
    }
    
    // Update the space with the new data
    Object.assign(existingSpace, updateSpaceDto);
    
    // Save the updated space
    const savedSpace = await this.spacesRepository.save(existingSpace);
    
    // Return the space with lot data
    return this.findOne(savedSpace.space_id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.spacesRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Space with ID ${id} not found`);
    }
  }
} 