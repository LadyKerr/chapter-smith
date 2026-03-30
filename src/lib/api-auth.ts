import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { APIErrorCode, APIResponse } from '@/app/types/api';

export async function getUnauthenticatedResponse(): Promise<NextResponse | null> {
  const session = await auth();

  if (session?.user) {
    return null;
  }

  const response: APIResponse<never> = {
    success: false,
    error: {
      code: APIErrorCode.AUTHENTICATION_REQUIRED,
      message: 'Sign in with GitHub to continue.'
    },
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  };

  return NextResponse.json(response, { status: 401 });
}
