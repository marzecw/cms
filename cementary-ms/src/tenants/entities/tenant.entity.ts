import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tenants')
export class Tenant {
  @ApiProperty({ description: 'The unique identifier of the tenant' })
  @PrimaryGeneratedColumn()
  tenant_id: number;

  @ApiProperty({ description: 'The name of the tenant' })
  @Column({ length: 255 })
  tenant_name: string;

  @ApiProperty({ description: 'The database name for the tenant' })
  @Column({ length: 255, unique: true })
  db_name: string;

  @ApiProperty({ description: 'The contact email for the tenant' })
  @Column({ length: 255, nullable: true })
  contact_email: string;

  @ApiProperty({ description: 'The contact phone for the tenant' })
  @Column({ length: 50, nullable: true })
  contact_phone: string;

  @ApiProperty({ description: 'The date when the tenant was created' })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @ApiProperty({ description: 'The date when the tenant was last updated' })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
} 