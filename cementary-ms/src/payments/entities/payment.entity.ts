import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Customer } from '../../customers/entities/customer.entity';
import { BillingInvoice } from '../../billing/entities/billing-invoice.entity';

@Entity('payments')
export class Payment {
  @ApiProperty({ description: 'The unique identifier of the payment' })
  @PrimaryGeneratedColumn()
  payment_id: number;

  @ApiProperty({ description: 'The customer who made the payment' })
  @ManyToOne(() => Customer, customer => customer.payments)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column()
  customer_id: number;

  @ApiProperty({ description: 'The invoice this payment is for' })
  @ManyToOne(() => BillingInvoice, invoice => invoice.payments, { nullable: true })
  @JoinColumn({ name: 'invoice_id' })
  invoice: BillingInvoice;

  @Column({ nullable: true })
  invoice_id: number;

  @ApiProperty({ description: 'The date of the payment' })
  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  payment_date: Date;

  @ApiProperty({ description: 'The amount of the payment' })
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ description: 'The payment method' })
  @Column({ length: 50, nullable: true })
  payment_method: string;

  @ApiProperty({ description: 'The status of the payment' })
  @Column({ length: 50, default: 'completed' })
  status: string;

  @ApiProperty({ description: 'Additional remarks about the payment' })
  @Column({ type: 'text', nullable: true })
  remarks: string;

  @ApiProperty({ description: 'The date when the payment was created' })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @ApiProperty({ description: 'The date when the payment was last updated' })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
} 