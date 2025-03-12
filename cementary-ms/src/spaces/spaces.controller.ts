import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SpacesService, SpaceResponse } from './spaces.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Space } from './entities/space.entity';

// Create a DTO for Swagger documentation to avoid circular dependencies
class SpaceResponseDto {
  space_id: number;
  space_number: string;
  lot_id: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}

@ApiTags('spaces')
@Controller('spaces')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new space' })
  @ApiResponse({ status: 201, description: 'The space has been successfully created.', type: SpaceResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createSpaceDto: CreateSpaceDto): Promise<SpaceResponse> {
    return this.spacesService.create(createSpaceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all spaces' })
  @ApiResponse({ status: 200, description: 'Return all spaces.', type: [SpaceResponseDto] })
  findAll(): Promise<SpaceResponse[]> {
    return this.spacesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a space by id' })
  @ApiResponse({ status: 200, description: 'Return the space.', type: SpaceResponseDto })
  @ApiResponse({ status: 404, description: 'Space not found.' })
  findOne(@Param('id') id: string): Promise<SpaceResponse> {
    return this.spacesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a space' })
  @ApiResponse({ status: 200, description: 'The space has been successfully updated.', type: SpaceResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Space not found.' })
  update(@Param('id') id: string, @Body() updateSpaceDto: UpdateSpaceDto): Promise<SpaceResponse> {
    return this.spacesService.update(+id, updateSpaceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a space' })
  @ApiResponse({ status: 200, description: 'The space has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Space not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.spacesService.remove(+id);
  }
} 