import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceLevelsService } from './space-levels.service';
import { SpaceLevelsController } from './space-levels.controller';
import { SpaceLevel } from './entities/space-level.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpaceLevel])],
  controllers: [SpaceLevelsController],
  providers: [SpaceLevelsService],
  exports: [SpaceLevelsService],
})
export class SpaceLevelsModule {}
