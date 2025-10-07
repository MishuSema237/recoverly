// UserService - Client-side service using API routes
export interface User {
  _id?: string;
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  emailVerified: boolean;
  userCode: string;
  isAdmin?: boolean;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
  profilePicture?: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: string;
  totalInvested: number;
  currentInvestment: number;
  investmentPlan?: string;
  totalDeposit: number;
  totalWithdraw: number;
  referralEarnings: number;
}

export class UserService {
  private baseUrl = '/api/users';

  async getAllUsers(): Promise<User[]> {
    try {
      const response = await fetch(this.baseUrl);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch users');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      const result = await response.json();
      
      if (!result.success) {
        if (response.status === 404) return null;
        throw new Error(result.error || 'Failed to fetch user');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}/email/${email}`);
      const result = await response.json();
      
      if (!result.success) {
        if (response.status === 404) return null;
        throw new Error(result.error || 'Failed to fetch user by email');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  }

  async createUser(userData: Omit<User, '_id'>): Promise<User | null> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create user');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: string, userData: Partial<User>): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update user');
      }
      
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete user');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

// Export standalone function for server-side use
export async function getUserByEmail(email: string): Promise<User | null> {
  const userService = new UserService();
  return userService.getUserByEmail(email);
}