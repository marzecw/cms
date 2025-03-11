import api from './api';

export interface Customer {
  customer_id?: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerResponse {
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  created_at: string;
  updated_at: string;
}

const CustomerService = {
  getCustomers: async (): Promise<CustomerResponse[]> => {
    const response = await api.get<CustomerResponse[]>('/customers');
    return response.data;
  },

  getCustomer: async (id: number): Promise<CustomerResponse> => {
    const response = await api.get<CustomerResponse>(`/customers/${id}`);
    return response.data;
  },

  createCustomer: async (customer: Customer): Promise<CustomerResponse> => {
    const response = await api.post<CustomerResponse>('/customers', customer);
    return response.data;
  },

  updateCustomer: async (id: number, customer: Partial<Customer>): Promise<CustomerResponse> => {
    const response = await api.patch<CustomerResponse>(`/customers/${id}`, customer);
    return response.data;
  },

  deleteCustomer: async (id: number): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },
};

export default CustomerService; 