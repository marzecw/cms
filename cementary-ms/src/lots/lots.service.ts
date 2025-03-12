import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLotDto } from './dto/create-lot.dto';
import { UpdateLotDto } from './dto/update-lot.dto';
import { Lot } from './entities/lot.entity';

// Export the interface so it can be used in the controller
export interface LotResponse extends Omit<Lot, 'garden' | 'spaces'> {
  garden: any;
  spaces: any[];
}

@Injectable()
export class LotsService {
  constructor(
    @InjectRepository(Lot)
    private lotsRepository: Repository<Lot>,
  ) {}

  async create(createLotDto: CreateLotDto): Promise<LotResponse> {
    const lot = this.lotsRepository.create(createLotDto);
    const savedLot = await this.lotsRepository.save(lot);
    
    // Return the lot with garden data
    return this.findOne(savedLot.lot_id);
  }

  async findAll(): Promise<LotResponse[]> {
    const lots = await this.lotsRepository.find();
    
    // Manually load related data for the response
    const lotsWithRelations = await Promise.all(
      lots.map(async (lot) => {
        try {
          // Load garden and spaces
          const garden = await lot.garden;
          const spaces = await lot.spaces;
          
          // Create a plain object with the loaded relations
          return {
            ...lot,
            garden: garden ? {
              ...garden,
              cemetery: garden.cemetery ? await garden.cemetery : null
            } : null,
            spaces: spaces || []
          };
        } catch (error) {
          console.error(`Error loading relations for lot ${lot.lot_id}:`, error);
          return {
            ...lot,
            garden: null,
            spaces: []
          };
        }
      })
    );
    
    return lotsWithRelations;
  }

  async findOne(id: number): Promise<LotResponse> {
    const lot = await this.lotsRepository.findOne({
      where: { lot_id: id }
    });
    
    if (!lot) {
      throw new NotFoundException(`Lot with ID ${id} not found`);
    }
    
    try {
      // Load garden and spaces
      const garden = await lot.garden;
      const spaces = await lot.spaces;
      
      // Create a plain object with the loaded relations
      return {
        ...lot,
        garden: garden ? {
          ...garden,
          cemetery: garden.cemetery ? await garden.cemetery : null
        } : null,
        spaces: spaces || []
      };
    } catch (error) {
      console.error(`Error loading relations for lot ${id}:`, error);
      return {
        ...lot,
        garden: null,
        spaces: []
      };
    }
  }

  async update(id: number, updateLotDto: UpdateLotDto): Promise<LotResponse> {
    const existingLot = await this.lotsRepository.findOne({
      where: { lot_id: id }
    });
    
    if (!existingLot) {
      throw new NotFoundException(`Lot with ID ${id} not found`);
    }
    
    // Remove lot_id if it exists in the DTO (using type assertion)
    const updateData = updateLotDto as any;
    if (updateData.lot_id) {
      delete updateData.lot_id;
    }
    
    // Update the lot with the new data
    Object.assign(existingLot, updateLotDto);
    
    // Save the updated lot
    const savedLot = await this.lotsRepository.save(existingLot);
    
    // Return the lot with garden data
    return this.findOne(savedLot.lot_id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.lotsRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Lot with ID ${id} not found`);
    }
  }
} 