import { NextResponse } from 'next/server';
import { requireAuth } from '@/middleware/auth';
import { UserService } from '@/lib/auth/user';

export const PUT = requireAuth(async (request) => {
  try {
    const updates = await request.json();
    const userId = request.user!.id;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    const { password: _password, email: _email, isAdmin: _isAdmin, isActive: _isActive, userCode: _userCode, _id: __id, ...allowedUpdates } = updates;

    // Update user profile
    const success = await UserService.updateUserProfile(userId, allowedUpdates);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Profile update failed' 
      },
      { status: 500 }
    );
  }
});
