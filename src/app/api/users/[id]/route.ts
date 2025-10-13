import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/auth';
import { UserService } from '@/lib/auth/user';

export const PUT = requireAdmin(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const userId = params.id;
    const updates = await request.json();

    // Remove sensitive fields that shouldn't be updated via this endpoint
    const { 
      password: _password, 
      email: _email, 
      isAdmin: _isAdmin, 
      isActive: _isActive, 
      userCode: _userCode, 
      _id: __id, 
      ...allowedUpdates 
    } = updates;

    // Update user profile
    const success = await UserService.updateUserProfile(userId, allowedUpdates);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to update user' },
        { status: 500 }
      );
    }

    const updatedUser = await UserService.getUserById(userId);
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found after update' },
        { status: 404 }
      );
    }

    // Remove sensitive data from response
    const { password: _p, emailVerificationToken: _e, passwordResetToken: _r, ...userWithoutSensitiveData } = updatedUser;

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: userWithoutSensitiveData
      }
    });
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
});