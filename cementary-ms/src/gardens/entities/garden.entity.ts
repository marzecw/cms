import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Cemetery } from '../../cemeteries/entities/cemetery.entity';
import { Lot } from '../../lots/entities/lot.entity';

@Entity('gardens')
export class Garden {
  @ApiProperty({ description: 'The unique identifier of the garden' })
  @PrimaryGeneratedColumn()
  garden_id: number;

  @ApiProperty({ description: 'The cemetery this garden belongs to' })
  @ManyToOne(() => Cemetery, cemetery => cemetery.gardens)
  @JoinColumn({ name: 'cemetery_id' })
  cemetery: Cemetery;

  @Column()
  cemetery_id: number;

  @ApiProperty({ description: 'The name of the garden' })
  @Column({ length: 255 })
  garden_name: string;

  @ApiProperty({ description: 'The description of the garden' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'The date when the garden was created' })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @ApiProperty({ description: 'The date when the garden was last updated' })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @OneToMany(() => Lot, lot => lot.garden)
  lots: Lot[];
} 