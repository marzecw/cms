import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Interment } from '../../interments/entities/interment.entity';

@Entity('deceased')
export class Deceased {
  @ApiProperty({ description: 'The unique identifier of the deceased' })
  @PrimaryGeneratedColumn()
  deceased_id: number;

  @ApiProperty({ description: 'The first name of the deceased' })
  @Column({ length: 100 })
  first_name: string;

  @ApiProperty({ description: 'The last name of the deceased' })
  @Column({ length: 100 })
  last_name: string;

  @ApiProperty({ description: 'The birth date of the deceased' })
  @Column({ type: 'date', nullable: true })
  birth_date: Date;

  @ApiProperty({ description: 'The death date of the deceased' })
  @Column({ type: 'date', nullable: true })
  death_date: Date;

  @ApiProperty({ description: 'The biography of the deceased' })
  @Column({ type: 'text', nullable: true })
  biography: string;

  @ApiProperty({ description: 'The date when the deceased record was created' })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @ApiProperty({ description: 'The date when the deceased record was last updated' })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @OneToMany(() => Interment, interment => interment.deceased)
  interments: Interment[];
} 