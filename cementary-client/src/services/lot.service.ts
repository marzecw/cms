import api from './api';

export interface LotResponse {
  lot_id: number;
  lot_number: string;
  garden_id: number;
  garden: {
    garden_id: number;
    garden_name: string;
    cemetery: {
      cemetery_id: number;
      cemetery_name: string;
    };
  };
  status: string;
  created_at: string;
  updated_at: string;
  spaces: any[];
}

export interface Lot {
  lot_id?: number;
  lot_number: string;
  garden_id: number;
  status?: string;
}

class LotService {
  private baseUrl = '/lots';

  async getLots(): Promise<LotResponse[]> {
    try {
      console.log('LotService: Fetching lots from API');
      const response = await api.get(this.baseUrl);
      console.log('LotService: Received lots data:', response.data);
      return response.data;
    } catch (error) {
      console.error('LotService: Error fetching lots:', error);
      throw error;
    }
  }

  async getLot(id: number): Promise<LotResponse> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`LotService: Error fetching lot with ID ${id}:`, error);
      throw error;
    }
  }

  async createLot(lot: Lot): Promise<LotResponse> {
    try {
      const response = await api.post(this.baseUrl, lot);
      return response.data;
    } catch (error) {
      console.error('LotService: Error creating lot:', error);
      throw error;
    }
  }

  async updateLot(id: number, lot: Partial<Lot>): Promise<LotResponse> {
    try {
      // Make sure lot_id is not included in the request body
      const updateData = { ...lot };
      delete updateData.lot_id;

      const response = await api.patch(`${this.baseUrl}/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`LotService: Error updating lot with ID ${id}:`, error);
      throw error;
    }
  }

  async deleteLot(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`LotService: Error deleting lot with ID ${id}:`, error);
      throw error;
    }
  }
}

export default new LotService(); 