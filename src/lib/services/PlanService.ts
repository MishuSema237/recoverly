// PlanService - Client-side service using API routes
export interface InvestmentPlan {
  _id?: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  duration: string;
  roi: number;
  capitalBack: boolean;
  color: string;
  gradient?: string;
  icon?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

export class PlanService {
  private baseUrl = '/api/plans';

  async getAllPlans(): Promise<InvestmentPlan[]> {
    try {
      const response = await fetch(this.baseUrl);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch plans');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error fetching plans:', error);
      // Return empty array instead of fallback plans when database is unavailable
      // This ensures no plans are shown when database is empty or connection fails
      return [];
    }
  }

  // Fallback plans for when MongoDB is unavailable
  private getFallbackPlans(): InvestmentPlan[] {
    return [
      {
        _id: 'fallback-1',
        name: 'Platinum',
        minAmount: 300000,
        maxAmount: 999999,
        duration: '30 Days',
        roi: 6.66,
        capitalBack: true,
        color: 'purple',
        gradient: 'from-purple-500 to-purple-600',
        icon: 'trending-up',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        updatedBy: 'system'
      },
      {
        _id: 'fallback-2',
        name: 'Probation',
        minAmount: 200,
        maxAmount: 999,
        duration: '10 Days',
        roi: 1.5,
        capitalBack: false,
        color: 'blue',
        gradient: 'from-blue-500 to-blue-600',
        icon: 'medal',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        updatedBy: 'system'
      },
      {
        _id: 'fallback-3',
        name: 'Gold',
        minAmount: 5000,
        maxAmount: 9999,
        duration: '30 Days',
        roi: 4.5,
        capitalBack: true,
        color: 'gold',
        gradient: 'from-yellow-500 to-yellow-600',
        icon: 'crown',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        updatedBy: 'system'
      },
      {
        _id: 'fallback-4',
        name: 'Silver',
        minAmount: 1000,
        maxAmount: 4999,
        duration: '20 Days',
        roi: 2.5,
        capitalBack: true,
        color: 'gray',
        gradient: 'from-gray-400 to-gray-500',
        icon: 'star',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        updatedBy: 'system'
      }
    ];
  }

  async getPlanById(id: string): Promise<InvestmentPlan | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      const result = await response.json();
      
      if (!result.success) {
        if (response.status === 404) return null;
        throw new Error(result.error || 'Failed to fetch plan');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error fetching plan:', error);
      throw error;
    }
  }

  async createPlan(planData: Omit<InvestmentPlan, '_id'>): Promise<InvestmentPlan | null> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create plan');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error creating plan:', error);
      throw error;
    }
  }

  async updatePlan(id: string, planData: Partial<InvestmentPlan>): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update plan');
      }
      
      return true;
    } catch (error) {
      console.error('Error updating plan:', error);
      throw error;
    }
  }

  async deletePlan(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete plan');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting plan:', error);
      throw error;
    }
  }
}