import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SpaceLevelsService } from './space-levels.service';
import { CreateSpaceLevelDto } from './dto/create-space-level.dto';
import { UpdateSpaceLevelDto } from './dto/update-space-level.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SpaceLevel } from './entities/space-level.entity';

@ApiTags('space-levels')
@Controller('space-levels')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SpaceLevelsController {
  constructor(private readonly spaceLevelsService: SpaceLevelsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new space level' })
  @ApiResponse({ status: 201, description: 'The space level has been successfully created.', type: SpaceLevel })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createSpaceLevelDto: CreateSpaceLevelDto) {
    return this.spaceLevelsService.create(createSpaceLevelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all space levels' })
  @ApiResponse({ status: 200, description: 'Return all space levels.', type: [SpaceLevel] })
  findAll() {
    return this.spaceLevelsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a space level by id' })
  @ApiResponse({ status: 200, description: 'Return the space level.', type: SpaceLevel })
  @ApiResponse({ status: 404, description: 'Space level not found.' })
  findOne(@Param('id') id: string) {
    return this.spaceLevelsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a space level' })
  @ApiResponse({ status: 200, description: 'The space level has been successfully updated.', type: SpaceLevel })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Space level not found.' })
  update(@Param('id') id: string, @Body() updateSpaceLevelDto: UpdateSpaceLevelDto) {
    return this.spaceLevelsService.update(+id, updateSpaceLevelDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a space level' })
  @ApiResponse({ status: 200, description: 'The space level has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Space level not found.' })
  remove(@Param('id') id: string) {
    return this.spaceLevelsService.remove(+id);
  }
} 