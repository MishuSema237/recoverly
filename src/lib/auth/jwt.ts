import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
}

export function generateToken(payload: JWTPayload): string {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export function generateEmailVerificationToken(userId: string): string {
  const options: SignOptions = { expiresIn: '24h' };
  return jwt.sign({ userId, type: 'email-verification' }, JWT_SECRET, options);
}

export function generatePasswordResetToken(userId: string): string {
  const options: SignOptions = { expiresIn: '1h' };
  return jwt.sign({ userId, type: 'password-reset' }, JWT_SECRET, options);
}

export function verifyEmailVerificationToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; type: string };
    if (decoded.type === 'email-verification') {
      return { userId: decoded.userId };
    }
    return null;
  } catch (error) {
    console.error('Email verification token verification failed:', error);
    return null;
  }
}

export function verifyPasswordResetToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; type: string };
    if (decoded.type === 'password-reset') {
      return { userId: decoded.userId };
    }
    return null;
  } catch (error) {
    console.error('Password reset token verification failed:', error);
    return null;
  }
}
