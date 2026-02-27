import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  content: string;
  rating: number;
  picture: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema: Schema = new Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
  rating: { type: Number, required: true, default: 5.0 },
  picture: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
