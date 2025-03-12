import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpaceLevel } from './entities/space-level.entity';
import { CreateSpaceLevelDto } from './dto/create-space-level.dto';
import { UpdateSpaceLevelDto } from './dto/update-space-level.dto';

@Injectable()
export class SpaceLevelsService {
  constructor(
    @InjectRepository(SpaceLevel)
    private spaceLevelsRepository: Repository<SpaceLevel>,
  ) {}

  async create(createSpaceLevelDto: CreateSpaceLevelDto): Promise<SpaceLevel> {
    const spaceLevel = this.spaceLevelsRepository.create(createSpaceLevelDto);
    return this.spaceLevelsRepository.save(spaceLevel);
  }

  async findAll(): Promise<SpaceLevel[]> {
    return this.spaceLevelsRepository.find({
      relations: ['space', 'space.lot', 'space.lot.garden', 'space.lot.garden.cemetery'],
    });
  }

  async findOne(id: number): Promise<SpaceLevel> {
    const spaceLevel = await this.spaceLevelsRepository.findOne({
      where: { level_id: id },
      relations: ['space', 'space.lot', 'space.lot.garden', 'space.lot.garden.cemetery'],
    });
    
    if (!spaceLevel) {
      throw new NotFoundException(`Space level with ID ${id} not found`);
    }
    
    return spaceLevel;
  }

  async update(id: number, updateSpaceLevelDto: UpdateSpaceLevelDto): Promise<SpaceLevel> {
    const spaceLevel = await this.findOne(id);
    this.spaceLevelsRepository.merge(spaceLevel, updateSpaceLevelDto);
    return this.spaceLevelsRepository.save(spaceLevel);
  }

  async remove(id: number): Promise<void> {
    const spaceLevel = await this.findOne(id);
    await this.spaceLevelsRepository.remove(spaceLevel);
  }
} 