import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Lot } from '../../lots/entities/lot.entity';
import { SpaceLevel } from '../../space-levels/entities/space-level.entity';

@Entity('spaces')
export class Space {
  @ApiProperty({ description: 'The unique identifier of the space' })
  @PrimaryGeneratedColumn()
  space_id: number;

  @ApiProperty({ description: 'The lot this space belongs to' })
  @ManyToOne(() => Lot, lot => lot.spaces)
  @JoinColumn({ name: 'lot_id' })
  lot: Lot;

  @Column()
  lot_id: number;

  @ApiProperty({ description: 'The space number' })
  @Column({ length: 50 })
  space_number: string;

  @ApiProperty({ description: 'The status of the space' })
  @Column({ length: 50, default: 'available' })
  status: string;

  @ApiProperty({ description: 'The date when the space was created' })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @ApiProperty({ description: 'The date when the space was last updated' })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @OneToMany(() => SpaceLevel, level => level.space)
  levels: SpaceLevel[];
} 