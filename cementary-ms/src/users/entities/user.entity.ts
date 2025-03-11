import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @ApiProperty({ description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn()
  user_id: number;

  @ApiProperty({ description: 'The tenant this user belongs to' })
  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column()
  tenant_id: number;

  @ApiProperty({ description: 'The username for login' })
  @Column({ length: 100, unique: true })
  username: string;

  @ApiProperty({ description: 'The email address of the user' })
  @Column({ length: 255, unique: true })
  email: string;

  @ApiHideProperty()
  @Exclude()
  @Column()
  password: string;

  @ApiProperty({ description: 'The first name of the user' })
  @Column({ length: 100 })
  first_name: string;

  @ApiProperty({ description: 'The last name of the user' })
  @Column({ length: 100 })
  last_name: string;

  @ApiProperty({ description: 'The role of the user' })
  @Column({ default: 'user' })
  role: string;

  @ApiProperty({ description: 'Whether the user is active' })
  @Column({ default: true })
  is_active: boolean;

  @ApiProperty({ description: 'The date when the user was created' })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @ApiProperty({ description: 'The date when the user was last updated' })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
} 