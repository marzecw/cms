import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Cemetery } from '../cemeteries/entities/cemetery.entity';
import { Garden } from '../gardens/entities/garden.entity';
import { Lot } from '../lots/entities/lot.entity';
import { Space } from '../spaces/entities/space.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cemetery,
      Garden,
      Lot,
      Space,
      User,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {} 