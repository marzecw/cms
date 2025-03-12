import api from './api';

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

class DashboardService {
  private baseUrl = '/dashboard';

  async getStats(): Promise<DashboardStats> {
    try {
      console.log('Fetching dashboard statistics from API');
      const response = await api.get(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      throw error;
    }
  }
}

export default new DashboardService(); 