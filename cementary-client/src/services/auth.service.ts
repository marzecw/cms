import api from './api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: number;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

const AuthService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    console.log('Login attempt with:', credentials.username);
    
    try {
      // For testing purposes, if the username is 'admin' and password is 'admin123',
      // we'll bypass the API call and return a mock user
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        console.log('Using mock login for admin');
        const mockUser: User = {
          id: 1,
          username: 'admin',
          email: 'admin@cemetery.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          tenantId: 1
        };
        
        const mockToken = 'mock-jwt-token-for-testing';
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return mockUser;
      } else {
        console.log('Invalid credentials, expected admin/admin123');
        throw new Error('Invalid credentials');
      }
      
      // Commented out for now since we're using mock login only
      /*
      // Regular API login
      console.log('Calling API for login');
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      console.log('Login response:', response.data);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
      */
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};

export default AuthService; 