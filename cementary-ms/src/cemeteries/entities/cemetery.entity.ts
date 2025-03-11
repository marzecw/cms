import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Garden } from '../../gardens/entities/garden.entity';

@Entity('cemeteries')
export class Cemetery {
  @ApiProperty({ description: 'The unique identifier of the cemetery' })
  @PrimaryGeneratedColumn()
  cemetery_id: number;

  @ApiProperty({ description: 'The name of the cemetery' })
  @Column({ length: 255 })
  cemetery_name: string;

  @ApiProperty({ description: 'The address of the cemetery' })
  @Column({ type: 'text', nullable: true })
  address: string;

  @ApiProperty({ description: 'The city where the cemetery is located' })
  @Column({ length: 100, nullable: true })
  city: string;

  @ApiProperty({ description: 'The state where the cemetery is located' })
  @Column({ length: 100, nullable: true })
  state: string;

  @ApiProperty({ description: 'The country where the cemetery is located' })
  @Column({ length: 100, nullable: true })
  country: string;

  @ApiProperty({ description: 'The date when the cemetery was established' })
  @Column({ type: 'date', nullable: true })
  established_date: Date;

  @ApiProperty({ description: 'The date when the cemetery was created' })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @ApiProperty({ description: 'The date when the cemetery was last updated' })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @OneToMany(() => Garden, garden => garden.cemetery)
  gardens: Garden[];
} 