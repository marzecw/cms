import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { Interment } from '../../interments/entities/interment.entity';
import { BillingInvoice } from '../../billing/entities/billing-invoice.entity';
import { Payment } from '../../payments/entities/payment.entity';

@Entity('customers')
export class Customer {
  @ApiProperty({ description: 'The unique identifier of the customer' })
  @PrimaryGeneratedColumn()
  customer_id: number;

  @ApiProperty({ description: 'The first name of the customer' })
  @Column({ length: 100 })
  first_name: string;

  @ApiProperty({ description: 'The last name of the customer' })
  @Column({ length: 100 })
  last_name: string;

  @ApiProperty({ description: 'The email address of the customer' })
  @Column({ length: 255, unique: true, nullable: true })
  email: string;

  @ApiProperty({ description: 'The phone number of the customer' })
  @Column({ length: 50, nullable: true })
  phone: string;

  @ApiProperty({ description: 'The address of the customer' })
  @Column({ type: 'text', nullable: true })
  address: string;

  @ApiProperty({ description: 'The city of the customer' })
  @Column({ length: 100, nullable: true })
  city: string;

  @ApiProperty({ description: 'The state of the customer' })
  @Column({ length: 100, nullable: true })
  state: string;

  @ApiProperty({ description: 'The country of the customer' })
  @Column({ length: 100, nullable: true })
  country: string;

  @ApiProperty({ description: 'The date when the customer was created' })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @ApiProperty({ description: 'The date when the customer was last updated' })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @OneToMany(() => Reservation, reservation => reservation.customer)
  reservations: Reservation[];

  @OneToMany(() => Interment, interment => interment.customer)
  interments: Interment[];

  @OneToMany(() => BillingInvoice, invoice => invoice.customer)
  invoices: BillingInvoice[];

  @OneToMany(() => Payment, payment => payment.customer)
  payments: Payment[];
} 