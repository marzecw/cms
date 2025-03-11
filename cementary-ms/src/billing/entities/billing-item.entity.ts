import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

@Entity('billing_items')
export class BillingItem {
  @ApiProperty({ description: 'The unique identifier of the billing item' })
  @PrimaryGeneratedColumn()
  billing_item_id: number;

  @ApiProperty({ description: 'The invoice this item belongs to' })
  @ManyToOne('BillingInvoice', 'items')
  @JoinColumn({ name: 'invoice_id' })
  @Type(() => Object)
  invoice: any;

  @Column()
  invoice_id: number;

  @ApiProperty({ description: 'The description of the item' })
  @Column({ type: 'text' })
  item_description: string;

  @ApiProperty({ description: 'The amount of the item' })
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ description: 'The quantity of the item' })
  @Column({ default: 1 })
  quantity: number;

  @ApiProperty({ description: 'The date when the billing item was created' })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @ApiProperty({ description: 'The date when the billing item was last updated' })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
} 