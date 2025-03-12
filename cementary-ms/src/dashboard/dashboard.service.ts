import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cemetery } from '../cemeteries/entities/cemetery.entity';
import { Garden } from '../gardens/entities/garden.entity';
import { Lot } from '../lots/entities/lot.entity';
import { Space } from '../spaces/entities/space.entity';
import { User } from '../users/entities/user.entity';

export interface DashboardStats {
  cemeteries: number;
  gardens: number;
  lots: number;
  spaces: number;
  customers: number;
  reservations: number;
  deceased: number;
  interments: number;
  invoices: number;
  payments: number;
  financialSummary?: {
    totalInvoiced: number;
    totalReceived: number;
    outstanding: number;
  };
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Cemetery)
    private cemeteriesRepository: Repository<Cemetery>,
    @InjectRepository(Garden)
    private gardensRepository: Repository<Garden>,
    @InjectRepository(Lot)
    private lotsRepository: Repository<Lot>,
    @InjectRepository(Space)
    private spacesRepository: Repository<Space>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getStats(): Promise<DashboardStats> {
    try {
      // Get counts from database
      const [
        cemeteries,
        gardens,
        lots,
        spaces,
        customers,
      ] = await Promise.all([
        this.cemeteriesRepository.count(),
        this.gardensRepository.count(),
        this.lotsRepository.count(),
        this.spacesRepository.count(),
        this.usersRepository.count({ where: { role: 'customer' } }),
      ]);

      // For now, we'll use placeholder values for the other metrics
      // In a real application, you would fetch these from their respective repositories
      const reservations = Math.floor(spaces * 0.4); // 40% of spaces are reserved
      const deceased = Math.floor(spaces * 0.5); // 50% of spaces have deceased
      const interments = Math.floor(deceased * 0.9); // 90% of deceased have been interred
      const invoices = customers * 2; // Average 2 invoices per customer
      const payments = Math.floor(invoices * 0.8); // 80% of invoices have been paid

      // Calculate financial summary
      const totalInvoiced = invoices * 1500; // Average invoice amount of $1,500
      const totalReceived = payments * 1500; // Same average for payments
      const outstanding = totalInvoiced - totalReceived;

      return {
        cemeteries,
        gardens,
        lots,
        spaces,
        customers,
        reservations,
        deceased,
        interments,
        invoices,
        payments,
        financialSummary: {
          totalInvoiced,
          totalReceived,
          outstanding,
        },
      };
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      throw error;
    }
  }
} 