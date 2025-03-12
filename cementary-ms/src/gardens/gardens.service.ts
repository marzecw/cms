import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Garden } from './entities/garden.entity';
import { CreateGardenDto } from './dto/create-garden.dto';
import { UpdateGardenDto } from './dto/update-garden.dto';

@Injectable()
export class GardensService {
  constructor(
    @InjectRepository(Garden)
    private gardensRepository: Repository<Garden>,
  ) {}

  async create(createGardenDto: CreateGardenDto): Promise<Garden> {
    const garden = this.gardensRepository.create(createGardenDto);
    return this.gardensRepository.save(garden);
  }

  async findAll(): Promise<Garden[]> {
    return this.gardensRepository.find({
      relations: ['cemetery', 'lots'],
    });
  }

  async findOne(id: number): Promise<Garden> {
    const garden = await this.gardensRepository.findOne({
      where: { garden_id: id },
      relations: ['cemetery', 'lots'],
    });
    
    if (!garden) {
      throw new NotFoundException(`Garden with ID ${id} not found`);
    }
    
    return garden;
  }

  async update(id: number, updateGardenDto: UpdateGardenDto): Promise<Garden> {
    const garden = await this.findOne(id);
    
    this.gardensRepository.merge(garden, updateGardenDto);
    return this.gardensRepository.save(garden);
  }

  async remove(id: number): Promise<void> {
    const garden = await this.findOne(id);
    await this.gardensRepository.remove(garden);
  }
} 