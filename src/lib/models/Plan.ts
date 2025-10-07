export interface Plan {
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
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

export interface PlanCreateData {
  name: string;
  minAmount: number;
  maxAmount: number;
  duration: string;
  roi: number;
  capitalBack: boolean;
  color: string;
  gradient?: string;
  icon?: string;
  isActive?: boolean;
  createdBy: string;
}





