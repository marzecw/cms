import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GardensService } from './gardens.service';
import { CreateGardenDto } from './dto/create-garden.dto';
import { UpdateGardenDto } from './dto/update-garden.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('gardens')
@Controller('gardens')
@UseGuards(JwtAuthGuard)
export class GardensController {
  constructor(private readonly gardensService: GardensService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new garden' })
  @ApiResponse({ status: 201, description: 'The garden has been successfully created.' })
  create(@Body() createGardenDto: CreateGardenDto) {
    return this.gardensService.create(createGardenDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all gardens' })
  @ApiResponse({ status: 200, description: 'Return all gardens.' })
  findAll() {
    return this.gardensService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a garden by id' })
  @ApiResponse({ status: 200, description: 'Return the garden.' })
  @ApiResponse({ status: 404, description: 'Garden not found.' })
  findOne(@Param('id') id: string) {
    return this.gardensService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a garden' })
  @ApiResponse({ status: 200, description: 'The garden has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateGardenDto: UpdateGardenDto) {
    return this.gardensService.update(+id, updateGardenDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a garden' })
  @ApiResponse({ status: 200, description: 'The garden has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.gardensService.remove(+id);
  }
} 