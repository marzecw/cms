import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CemeteriesController } from './cemeteries.controller';
import { CemeteriesService } from './cemeteries.service';
import { Cemetery } from './entities/cemetery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cemetery])],
  controllers: [CemeteriesController],
  providers: [CemeteriesService],
  exports: [CemeteriesService],
})
export class CemeteriesModule {}
