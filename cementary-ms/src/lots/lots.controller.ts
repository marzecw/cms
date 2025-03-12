import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LotsService, LotResponse } from './lots.service';
import { CreateLotDto } from './dto/create-lot.dto';
import { UpdateLotDto } from './dto/update-lot.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Lot } from './entities/lot.entity';

@ApiTags('lots')
@Controller('lots')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lot' })
  @ApiResponse({ status: 201, description: 'The lot has been successfully created.', type: Lot })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createLotDto: CreateLotDto): Promise<LotResponse> {
    return this.lotsService.create(createLotDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lots' })
  @ApiResponse({ status: 200, description: 'Return all lots.', type: [Lot] })
  findAll(): Promise<LotResponse[]> {
    return this.lotsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a lot by id' })
  @ApiResponse({ status: 200, description: 'Return the lot.', type: Lot })
  @ApiResponse({ status: 404, description: 'Lot not found.' })
  findOne(@Param('id') id: string): Promise<LotResponse> {
    return this.lotsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a lot' })
  @ApiResponse({ status: 200, description: 'The lot has been successfully updated.', type: Lot })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Lot not found.' })
  update(@Param('id') id: string, @Body() updateLotDto: UpdateLotDto): Promise<LotResponse> {
    return this.lotsService.update(+id, updateLotDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lot' })
  @ApiResponse({ status: 200, description: 'The lot has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Lot not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.lotsService.remove(+id);
  }
} 