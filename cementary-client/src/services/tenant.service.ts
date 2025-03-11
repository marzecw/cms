import api from './api';

export interface Tenant {
  tenant_id?: number;
  tenant_name: string;
  db_name: string;
  contact_email?: string;
  contact_phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TenantResponse {
  tenant_id: number;
  tenant_name: string;
  db_name: string;
  contact_email: string;
  contact_phone: string;
  created_at: string;
  updated_at: string;
}

const TenantService = {
  getTenants: async (): Promise<TenantResponse[]> => {
    const response = await api.get<TenantResponse[]>('/tenants');
    return response.data;
  },

  getTenant: async (id: number): Promise<TenantResponse> => {
    const response = await api.get<TenantResponse>(`/tenants/${id}`);
    return response.data;
  },

  createTenant: async (tenant: Tenant): Promise<TenantResponse> => {
    const response = await api.post<TenantResponse>('/tenants', tenant);
    return response.data;
  },

  updateTenant: async (id: number, tenant: Partial<Tenant>): Promise<TenantResponse> => {
    const response = await api.patch<TenantResponse>(`/tenants/${id}`, tenant);
    return response.data;
  },

  deleteTenant: async (id: number): Promise<void> => {
    await api.delete(`/tenants/${id}`);
  },
};

export default TenantService; 