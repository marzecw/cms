import api from './api';

export interface SpaceResponse {
  space_id: number;
  space_number: string;
  lot_id: number;
  type: string;
  price: number;
  status: string;
  created_at: string;
  updated_at: string;
  lot?: {
    lot_id: number;
    lot_number: string;
    garden?: {
      garden_id: number;
      garden_name: string;
      cemetery?: {
        cemetery_id: number;
        cemetery_name: string;
      }
    }
  };
  levels?: any[];
}

export interface CreateSpaceDto {
  space_number: string;
  lot_id: number;
  type?: string;
  price?: number;
  status?: string;
}

export interface UpdateSpaceDto {
  space_number?: string;
  lot_id?: number;
  type?: string;
  price?: number;
  status?: string;
}

class SpaceService {
  private baseUrl = '/spaces';

  async getSpaces(): Promise<SpaceResponse[]> {
    try {
      const response = await api.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching spaces:', error);
      throw error;
    }
  }

  async getSpace(id: number): Promise<SpaceResponse> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching space with ID ${id}:`, error);
      throw error;
    }
  }

  async createSpace(spaceData: CreateSpaceDto): Promise<SpaceResponse> {
    try {
      const response = await api.post(this.baseUrl, spaceData);
      return response.data;
    } catch (error) {
      console.error('Error creating space:', error);
      throw error;
    }
  }

  async updateSpace(id: number, spaceData: UpdateSpaceDto): Promise<SpaceResponse> {
    try {
      // Ensure price is a number if it exists
      const processedData = {
        ...spaceData,
        price: spaceData.price !== undefined ? Number(spaceData.price) : undefined
      };
      
      console.log(`SpaceService: Updating space with ID ${id}:`, processedData);
      const response = await api.patch(`${this.baseUrl}/${id}`, processedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating space with ID ${id}:`, error);
      throw error;
    }
  }

  async deleteSpace(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Error deleting space with ID ${id}:`, error);
      throw error;
    }
  }
}

export default new SpaceService(); 