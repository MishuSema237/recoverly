import { User } from '@firebase/auth';
import { UserService } from '../services/UserService';
import { User as MongoUser } from '../models/User';

export class MongoAuthSync {
  private userService = new UserService();

  async syncUserFromFirebase(firebaseUser: User): Promise<MongoUser | null> {
    try {
      // Check if user exists in MongoDB
      let mongoUser = await this.userService.getUserByFirebaseId(firebaseUser.uid);
      
      if (!mongoUser) {
        // Create new user in MongoDB if doesn't exist
        const userCode = await this.generateUniqueUserCode();
        
        mongoUser = await this.userService.createUser({
          firebaseId: firebaseUser.uid,
          email: firebaseUser.email || '',
          firstName: '',
          lastName: '',
          displayName: firebaseUser.displayName || '',
          emailVerified: firebaseUser.emailVerified,
          userCode,
          createdBy: 'system'
        });
      } else {
        // Update last login time
        await this.userService.updateUserByFirebaseId(
          firebaseUser.uid,
          {
            lastLoginAt: new Date(),
            emailVerified: firebaseUser.emailVerified,
            updatedBy: 'system'
          }
        );
      }
      
      return mongoUser;
    } catch (error) {
      console.error('Error syncing user from Firebase:', error);
      return null;
    }
  }

  async updateMongoUserProfile(
    firebaseId: string, 
    updates: {
      firstName?: string;
      lastName?: string;
      displayName?: string;
      walletAddress?: string;
      investmentPlan?: string;
      totalInvested?: number;
      adminAction?: string;
    }
  ): Promise<boolean> {
    try {
      const updateData = {
        ...updates,
        updatedBy: updates.adminAction || 'user',
        lastUpdated: new Date()
      };

      return await this.userService.updateUserByFirebaseId(firebaseId, updateData);
    } catch (error) {
      console.error('Error updating MongoDB user profile:', error);
      return false;
    }
  }

  async deleteUserFromMongoDB(firebaseId: string): Promise<boolean> {
    try {
      const db = await this.userService.getUserByFirebaseId(firebaseId);
      if (db?._id) {
        // Instead of deleting, mark as inactive
        await this.userService.updateUserByFirebaseId(firebaseId, {
          isActive: false,
          updatedBy: 'system'
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting user from MongoDB:', error);
      return false;
    }
  }

  private async generateUniqueUserCode(): Promise<string> {
    const generateCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    let code = generateCode();
    let isUnique = false;

    while (!isUnique) {
      isUnique = await this.userService.isUserCodeUnique(code);
      if (!isUnique) {
        code = generateCode();
      }
    }

    return code;
  }

  async getMongoUserProfile(firebaseId: string): Promise<MongoUser | null> {
    try {
      return await this.userService.getUserByFirebaseId(firebaseId);
    } catch (error) {
      console.error('Error fetching MongoDB user profile:', error);
      return null;
    }
  }

  // Sync investment data between Firebase and MongoDB
  async syncInvestmentData(
    firebaseId: string, 
    investmentData: {
      totalInvested?: number;
      investmentPlan?: string;
      currentInvestment?: number;
      lastInvestmentDate?: Date;
    }
  ): Promise<boolean> {
    try {
      return await this.updateMongoUserProfile(firebaseId, investmentData);
    } catch (error) {
      console.error('Error syncing investment data:', error);
      return false;
    }
  }
}





