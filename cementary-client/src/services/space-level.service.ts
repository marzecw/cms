import api from './api';

export interface SpaceLevel {
  level_id?: number;
  name: string;
  description?: string;
  price: number;
  status?: string;
  space_id: number;
  space?: any;
  created_at?: Date;
  updated_at?: Date;
}

export class SpaceLevelService {
  private baseUrl = '/space-levels';

  async getSpaceLevels(): Promise<SpaceLevel[]> {
    try {
      const response = await api.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching space levels:', error);
      throw error;
    }
  }

  async getSpaceLevel(id: number): Promise<SpaceLevel> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching space level with ID ${id}:`, error);
      throw error;
    }
  }

  async createSpaceLevel(spaceLevel: SpaceLevel): Promise<SpaceLevel> {
    try {
      const payload = {
        name: spaceLevel.name,
        description: spaceLevel.description,
        price: spaceLevel.price,
        status: spaceLevel.status,
        space_id: spaceLevel.space_id
      };
      const response = await api.post(this.baseUrl, payload);
      return response.data;
    } catch (error) {
      console.error('Error creating space level:', error);
      throw error;
    }
  }

  async updateSpaceLevel(id: number, spaceLevel: Partial<SpaceLevel>): Promise<SpaceLevel> {
    try {
      const payload = {
        name: spaceLevel.name,
        description: spaceLevel.description,
        price: spaceLevel.price,
        status: spaceLevel.status,
        space_id: spaceLevel.space_id
      };
      const response = await api.patch(`${this.baseUrl}/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating space level with ID ${id}:`, error);
      throw error;
    }
  }

  async deleteSpaceLevel(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Error deleting space level with ID ${id}:`, error);
      throw error;
    }
  }
} 