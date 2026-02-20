import { NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/auth';
import { UserService } from '@/lib/auth/user';

export const GET = requireAdmin(async () => {
  try {
    const users = await UserService.getAllUsers();
    
    return NextResponse.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get users' 
      },
      { status: 500 }
    );
  }
});
