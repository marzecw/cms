import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Customer } from '../../customers/entities/customer.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Type } from 'class-transformer';
import { forwardRef } from '@nestjs/common';

@Entity('billing_invoices')
export class BillingInvoice {
  @ApiProperty({ description: 'The unique identifier of the invoice' })
  @PrimaryGeneratedColumn()
  invoice_id: number;

  @ApiProperty({ description: 'The customer this invoice is for' })
  @ManyToOne(() => Customer, customer => customer.invoices)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column()
  customer_id: number;

  @ApiProperty({ description: 'The date of the invoice' })
  @Column({ type: 'date' })
  billing_date: Date;

  @ApiProperty({ description: 'The due date of the invoice' })
  @Column({ type: 'date', nullable: true })
  due_date: Date;

  @ApiProperty({ description: 'The total amount of the invoice' })
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  total_amount: number;

  @ApiProperty({ description: 'The status of the invoice' })
  @Column({ length: 50, default: 'unpaid' })
  status: string;

  @ApiProperty({ description: 'The description of the invoice' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'The date when the invoice was created' })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @ApiProperty({ description: 'The date when the invoice was last updated' })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @OneToMany('BillingItem', 'invoice')
  @Type(() => Object)
  items: any[];

  @OneToMany(() => Payment, payment => payment.invoice)
  payments: Payment[];
} 