import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CemeteriesService } from './cemeteries.service';
import { CreateCemeteryDto } from './dto/create-cemetery.dto';
import { UpdateCemeteryDto } from './dto/update-cemetery.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('cemeteries')
@Controller('cemeteries')
@UseGuards(JwtAuthGuard)
export class CemeteriesController {
  constructor(private readonly cemeteriesService: CemeteriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cemetery' })
  @ApiResponse({ status: 201, description: 'The cemetery has been successfully created.' })
  create(@Body() createCemeteryDto: CreateCemeteryDto) {
    return this.cemeteriesService.create(createCemeteryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cemeteries' })
  @ApiResponse({ status: 200, description: 'Return all cemeteries.' })
  findAll() {
    return this.cemeteriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cemetery by id' })
  @ApiResponse({ status: 200, description: 'Return the cemetery.' })
  @ApiResponse({ status: 404, description: 'Cemetery not found.' })
  findOne(@Param('id') id: string) {
    return this.cemeteriesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a cemetery' })
  @ApiResponse({ status: 200, description: 'The cemetery has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateCemeteryDto: UpdateCemeteryDto) {
    return this.cemeteriesService.update(+id, updateCemeteryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cemetery' })
  @ApiResponse({ status: 200, description: 'The cemetery has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.cemeteriesService.remove(+id);
  }
} 