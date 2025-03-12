import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Space } from '../../spaces/entities/space.entity';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Interment } from '../../interments/entities/interment.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { Type } from 'class-transformer';

@Entity('space_levels')
export class SpaceLevel {
  @ApiProperty({ description: 'The unique identifier of the space level' })
  @PrimaryGeneratedColumn()
  level_id: number;

  @ApiProperty({ description: 'The name of the space level' })
  @Column({ nullable: true })
  name: string;

  @ApiProperty({ description: 'The description of the space level' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'The price of the space level' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @ApiProperty({ description: 'The status of the space level' })
  @Column({ default: 'available' })
  status: string;

  @ApiHideProperty()
  @ManyToOne(() => Space, space => space.levels, { lazy: true })
  @JoinColumn({ name: 'space_id' })
  space: Promise<Space>;

  @ApiProperty({ description: 'The ID of the space this level belongs to' })
  @Column()
  space_id: number;

  @ApiProperty({ description: 'The date the space level was created' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({ description: 'The date the space level was last updated' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ApiHideProperty()
  @OneToMany(() => Interment, interment => interment.level)
  interments: Interment[];

  @ApiHideProperty()
  @OneToMany(() => Reservation, reservation => reservation.level)
  reservations: Reservation[];
} 