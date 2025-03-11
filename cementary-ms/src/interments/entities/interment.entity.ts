import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SpaceLevel } from '../../space-levels/entities/space-level.entity';
import { Deceased } from '../../deceased/entities/deceased.entity';
import { Customer } from '../../customers/entities/customer.entity';

@Entity('interments')
export class Interment {
  @ApiProperty({ description: 'The unique identifier of the interment' })
  @PrimaryGeneratedColumn()
  interment_id: number;

  @ApiProperty({ description: 'The space level where the interment occurs' })
  @ManyToOne(() => SpaceLevel, level => level.interments)
  @JoinColumn({ name: 'level_id' })
  level: SpaceLevel;

  @Column()
  level_id: number;

  @ApiProperty({ description: 'The deceased person being interred' })
  @ManyToOne(() => Deceased, deceased => deceased.interments)
  @JoinColumn({ name: 'deceased_id' })
  deceased: Deceased;

  @Column()
  deceased_id: number;

  @ApiProperty({ description: 'The customer who arranged the interment' })
  @ManyToOne(() => Customer, customer => customer.interments, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ nullable: true })
  customer_id: number;

  @ApiProperty({ description: 'The date of the interment' })
  @Column({ type: 'date' })
  interment_date: Date;

  @ApiProperty({ description: 'The officiant of the interment ceremony' })
  @Column({ length: 100, nullable: true })
  officiant: string;

  @ApiProperty({ description: 'Additional remarks about the interment' })
  @Column({ type: 'text', nullable: true })
  remarks: string;

  @ApiProperty({ description: 'The date when the interment record was created' })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @ApiProperty({ description: 'The date when the interment record was last updated' })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
} 