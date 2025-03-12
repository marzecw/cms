import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cemetery } from './entities/cemetery.entity';
import { CreateCemeteryDto } from './dto/create-cemetery.dto';
import { UpdateCemeteryDto } from './dto/update-cemetery.dto';

@Injectable()
export class CemeteriesService {
  constructor(
    @InjectRepository(Cemetery)
    private cemeteriesRepository: Repository<Cemetery>,
  ) {}

  async create(createCemeteryDto: CreateCemeteryDto): Promise<Cemetery> {
    const cemetery = this.cemeteriesRepository.create(createCemeteryDto);
    return this.cemeteriesRepository.save(cemetery);
  }

  async findAll(): Promise<Cemetery[]> {
    return this.cemeteriesRepository.find({
      relations: ['gardens'],
    });
  }

  async findOne(id: number): Promise<Cemetery> {
    const cemetery = await this.cemeteriesRepository.findOne({
      where: { cemetery_id: id },
      relations: ['gardens'],
    });
    
    if (!cemetery) {
      throw new NotFoundException(`Cemetery with ID ${id} not found`);
    }
    
    return cemetery;
  }

  async update(id: number, updateCemeteryDto: UpdateCemeteryDto): Promise<Cemetery> {
    const cemetery = await this.findOne(id);
    
    this.cemeteriesRepository.merge(cemetery, updateCemeteryDto);
    return this.cemeteriesRepository.save(cemetery);
  }

  async remove(id: number): Promise<void> {
    const cemetery = await this.findOne(id);
    await this.cemeteriesRepository.remove(cemetery);
  }
} 