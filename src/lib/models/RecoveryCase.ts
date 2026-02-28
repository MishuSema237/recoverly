import mongoose, { Schema, Document } from 'mongoose';

export interface IRecoveryUpdate {
  status: string;
  message: string;
  timestamp: Date;
}

export interface IRecoveryCase extends Document {
  userId: mongoose.Types.ObjectId;
  scamType: string;
  amountLost: number;
  currency: string;
  dateOfIncident: string;
  platformName: string;
  details: string;
  status: 'pending' | 'investigating' | 'forensic_phase' | 'legal_action' | 'funds_frozen' | 'completed' | 'rejected';
  adminNotes?: string;
  updates: IRecoveryUpdate[];
  createdAt: Date;
  updatedAt: Date;
}

const RecoveryUpdateSchema = new Schema<IRecoveryUpdate>({
  status: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const RecoveryCaseSchema = new Schema<IRecoveryCase>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  scamType: { type: String, required: true },
  amountLost: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  dateOfIncident: { type: String, required: true },
  platformName: { type: String, required: true },
  details: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'investigating', 'forensic_phase', 'legal_action', 'funds_frozen', 'completed', 'rejected'],
    default: 'pending' 
  },
  adminNotes: { type: String },
  updates: [RecoveryUpdateSchema],
}, {
  timestamps: true
});

export default mongoose.models.RecoveryCase || mongoose.model<IRecoveryCase>('RecoveryCase', RecoveryCaseSchema);
