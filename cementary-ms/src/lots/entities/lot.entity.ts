import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Garden } from '../../gardens/entities/garden.entity';
import { Space } from '../../spaces/entities/space.entity';

@Entity('lots')
export class Lot {
  @ApiProperty({ description: 'The unique identifier of the lot' })
  @PrimaryGeneratedColumn()
  lot_id: number;

  @ApiProperty({ description: 'The garden this lot belongs to' })
  @ManyToOne(() => Garden, garden => garden.lots)
  @JoinColumn({ name: 'garden_id' })
  garden: Garden;

  @Column()
  garden_id: number;

  @ApiProperty({ description: 'The lot number' })
  @Column({ length: 50 })
  lot_number: string;

  @ApiProperty({ description: 'The status of the lot' })
  @Column({ length: 50, default: 'available' })
  status: string;

  @ApiProperty({ description: 'The date when the lot was created' })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @ApiProperty({ description: 'The date when the lot was last updated' })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @OneToMany(() => Space, space => space.lot)
  spaces: Space[];
} 