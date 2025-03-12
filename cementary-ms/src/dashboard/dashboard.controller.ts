import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService, DashboardStats } from './dashboard.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Return dashboard statistics.' })
  async getStats(): Promise<DashboardStats> {
    return this.dashboardService.getStats();
  }
} 