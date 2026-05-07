import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { APIErrorCode, APIResponse } from '@/app/types/api';

export async function getUnauthenticatedResponse(): Promise<NextResponse | null> {
  let session;

  try {
    session = await auth();
  } catch (error) {
    console.error('Authentication session check failed:', error);

    return createAuthErrorResponse(
      APIErrorCode.CONFIGURATION_ERROR,
      'Authentication is not configured correctly.',
      500,
      error
    );
  }

  if (session?.user) {
    return null;
  }

  return createAuthErrorResponse(
    APIErrorCode.AUTHENTICATION_REQUIRED,
    'Sign in with GitHub to continue.',
    401
  );
}

function createAuthErrorResponse(
  code: APIErrorCode,
  message: string,
  status: number,
  error?: unknown
): NextResponse {
  const response: APIResponse<never> = {
    success: false,
    error: {
      code,
      message,
      details: null,
      ...(process.env.NODE_ENV === 'development' && {
        stack: error instanceof Error ? error.stack : new Error().stack
      })
    },
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  };

  return NextResponse.json(response, { status });
}
