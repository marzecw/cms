import api from './api';

export interface User {
  user_id?: number;
  tenant_id: number;
  username: string;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  role?: string;
  is_active?: boolean;
  auth_provider?: string;
  picture?: string;
  google_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserResponse {
  user_id: number;
  tenant_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  auth_provider: string;
  picture?: string;
  created_at: string;
  updated_at: string;
}

const UserService = {
  getUsers: async (): Promise<UserResponse[]> => {
    const response = await api.get<UserResponse[]>('/users');
    return response.data;
  },

  getUsersByTenant: async (tenantId: number): Promise<UserResponse[]> => {
    const response = await api.get<UserResponse[]>(`/users?tenantId=${tenantId}`);
    return response.data;
  },

  getUser: async (id: number): Promise<UserResponse> => {
    const response = await api.get<UserResponse>(`/users/${id}`);
    return response.data;
  },

  createUser: async (user: User): Promise<UserResponse> => {
    const response = await api.post<UserResponse>('/users', user);
    return response.data;
  },

  updateUser: async (id: number, user: Partial<User>): Promise<UserResponse> => {
    // Filter out properties that shouldn't be sent to the backend
    const { 
      user_id, 
      tenant_id, 
      google_id, 
      picture, 
      auth_provider, 
      created_at, 
      updated_at,
      ...updateData 
    } = user;
    
    // If password is empty, remove it from the update payload
    if (updateData.password === '') {
      delete updateData.password;
    }
    
    const response = await api.patch<UserResponse>(`/users/${id}`, updateData);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

export default UserService; 