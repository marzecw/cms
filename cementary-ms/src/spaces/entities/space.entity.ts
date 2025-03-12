import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Lot } from '../../lots/entities/lot.entity';
import { SpaceLevel } from '../../space-levels/entities/space-level.entity';

@Entity('spaces')
export class Space {
  @ApiProperty({ description: 'The unique identifier of the space' })
  @PrimaryGeneratedColumn()
  space_id: number;

  @ApiHideProperty() // Hide from Swagger to prevent circular dependency
  @ManyToOne(() => Lot, lot => lot.spaces, { lazy: true })
  @JoinColumn({ name: 'lot_id' })
  lot: Promise<Lot>;

  @ApiProperty({ description: 'The lot ID this space belongs to' })
  @Column()
  lot_id: number;

  @ApiProperty({ description: 'The space number' })
  @Column({ length: 50 })
  space_number: string;

  @ApiProperty({ description: 'The type of space (standard, premium, mausoleum, etc.)' })
  @Column({ length: 50, default: 'standard' })
  type: string;

  @ApiProperty({ description: 'The price of the space' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @ApiProperty({ description: 'The status of the space' })
  @Column({ length: 50, default: 'available' })
  status: string;

  @ApiProperty({ description: 'The date when the space was created' })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @ApiProperty({ description: 'The date when the space was last updated' })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @ApiHideProperty() // Hide from Swagger to prevent circular dependency
  @OneToMany(() => SpaceLevel, level => level.space, { lazy: true })
  levels: Promise<SpaceLevel[]>;
} 