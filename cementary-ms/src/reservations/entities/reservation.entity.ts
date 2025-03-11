import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SpaceLevel } from '../../space-levels/entities/space-level.entity';
import { Customer } from '../../customers/entities/customer.entity';

@Entity('reservations')
export class Reservation {
  @ApiProperty({ description: 'The unique identifier of the reservation' })
  @PrimaryGeneratedColumn()
  reservation_id: number;

  @ApiProperty({ description: 'The space level this reservation is for' })
  @ManyToOne(() => SpaceLevel, level => level.reservations)
  @JoinColumn({ name: 'level_id' })
  level: SpaceLevel;

  @Column()
  level_id: number;

  @ApiProperty({ description: 'The customer who made the reservation' })
  @ManyToOne(() => Customer, customer => customer.reservations)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column()
  customer_id: number;

  @ApiProperty({ description: 'The date of the reservation' })
  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  reservation_date: Date;

  @ApiProperty({ description: 'The status of the reservation' })
  @Column({ length: 50, default: 'pending' })
  status: string;

  @ApiProperty({ description: 'The date when the reservation was created' })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @ApiProperty({ description: 'The date when the reservation was last updated' })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
} 