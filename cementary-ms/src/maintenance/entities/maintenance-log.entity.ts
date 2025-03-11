import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Cemetery } from '../../cemeteries/entities/cemetery.entity';
import { Garden } from '../../gardens/entities/garden.entity';
import { Lot } from '../../lots/entities/lot.entity';
import { Space } from '../../spaces/entities/space.entity';
import { SpaceLevel } from '../../space-levels/entities/space-level.entity';

@Entity('maintenance_logs')
export class MaintenanceLog {
  @ApiProperty({ description: 'The unique identifier of the maintenance log' })
  @PrimaryGeneratedColumn()
  maintenance_log_id: number;

  @ApiProperty({ description: 'The cemetery where maintenance was performed' })
  @ManyToOne(() => Cemetery, { nullable: true })
  @JoinColumn({ name: 'cemetery_id' })
  cemetery: Cemetery;

  @Column({ nullable: true })
  cemetery_id: number;

  @ApiProperty({ description: 'The garden where maintenance was performed' })
  @ManyToOne(() => Garden, { nullable: true })
  @JoinColumn({ name: 'garden_id' })
  garden: Garden;

  @Column({ nullable: true })
  garden_id: number;

  @ApiProperty({ description: 'The lot where maintenance was performed' })
  @ManyToOne(() => Lot, { nullable: true })
  @JoinColumn({ name: 'lot_id' })
  lot: Lot;

  @Column({ nullable: true })
  lot_id: number;

  @ApiProperty({ description: 'The space where maintenance was performed' })
  @ManyToOne(() => Space, { nullable: true })
  @JoinColumn({ name: 'space_id' })
  space: Space;

  @Column({ nullable: true })
  space_id: number;

  @ApiProperty({ description: 'The space level where maintenance was performed' })
  @ManyToOne(() => SpaceLevel, { nullable: true })
  @JoinColumn({ name: 'level_id' })
  level: SpaceLevel;

  @Column({ nullable: true })
  level_id: number;

  @ApiProperty({ description: 'The date of the maintenance' })
  @Column({ type: 'date' })
  maintenance_date: Date;

  @ApiProperty({ description: 'The description of the maintenance' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'The person who performed the maintenance' })
  @Column({ length: 255, nullable: true })
  performed_by: string;

  @ApiProperty({ description: 'The cost of the maintenance' })
  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  cost: number;

  @ApiProperty({ description: 'The date when the maintenance log was created' })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @ApiProperty({ description: 'The date when the maintenance log was last updated' })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
} 