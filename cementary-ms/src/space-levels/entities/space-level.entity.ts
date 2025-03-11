import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Space } from '../../spaces/entities/space.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { Interment } from '../../interments/entities/interment.entity';

@Entity('space_levels')
export class SpaceLevel {
  @ApiProperty({ description: 'The unique identifier of the space level' })
  @PrimaryGeneratedColumn()
  level_id: number;

  @ApiProperty({ description: 'The space this level belongs to' })
  @ManyToOne(() => Space, space => space.levels)
  @JoinColumn({ name: 'space_id' })
  space: Space;

  @Column()
  space_id: number;

  @ApiProperty({ description: 'The level number' })
  @Column()
  level_number: number;

  @ApiProperty({ description: 'The status of the level' })
  @Column({ length: 50, default: 'vacant' })
  status: string;

  @ApiProperty({ description: 'The date when the level was created' })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @ApiProperty({ description: 'The date when the level was last updated' })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @OneToMany(() => Reservation, reservation => reservation.level)
  reservations: Reservation[];

  @OneToMany(() => Interment, interment => interment.level)
  interments: Interment[];
} 