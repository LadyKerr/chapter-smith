import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

type ServiceStatus = 'up' | 'degraded' | 'down' | 'configured' | 'not_configured' | 'not_applicable';

interface ReadinessResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  timestamp: string;
  services: {
    youtube: ServiceStatus;
    anthropic: ServiceStatus;
    database: ServiceStatus;
    redis: ServiceStatus;
  };
  metrics: {
    checkDurationMs: number;
    uptime: number;
  };
  cache: {
    cachedAt: string;
    expiresAt: string;
    ttlMs: number;
    cacheHit: boolean;
  };
  statusCode: number;
}

const READINESS_TTL_MS = 5 * 60 * 1000; // 5 minutes
const INTERNAL_HEALTH_TOKEN = process.env.INTERNAL_HEALTH_TOKEN;
const VERSION = '1.0.0';

let cachedReadiness: { expiresAt: number; payload: ReadinessResponse } | null = null;
let readinessPromise: Promise<ReadinessResponse> | null = null;

const minimalLiveness = () => NextResponse.json(
  { status: 'ok', timestamp: new Date().toISOString() },
  { status: 200 }
);

const isAuthorized = (request: NextRequest): boolean => {
  if (!INTERNAL_HEALTH_TOKEN) {
    return false;
  }

  const authorization = request.headers.get('authorization');
  if (!authorization) {
    return false;
  }

  const [scheme, value] = authorization.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !value) {
    return false;
  }

  const tokenBuffer = Buffer.from(INTERNAL_HEALTH_TOKEN);
  const valueBuffer = Buffer.from(value.trim());

  if (tokenBuffer.length !== valueBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(tokenBuffer, valueBuffer);
};

async function computeReadiness(): Promise<ReadinessResponse> {
  const startTime = Date.now();
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

  const services: ReadinessResponse['services'] = {
    youtube: youtubeApiKey ? 'configured' : 'not_configured',
    anthropic: anthropicApiKey ? 'configured' : 'not_configured',
    database: 'not_applicable',
    redis: 'not_applicable'
  };

  if (youtubeApiKey) {
    try {
      const testResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=dQw4w9WgXcQ&part=snippet&key=${youtubeApiKey}`,
        {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000)
        }
      );
      services.youtube = testResponse.ok ? 'up' : 'degraded';
    } catch {
      services.youtube = 'down';
    }
  }

  if (anthropicApiKey) {
    try {
      const testResponse = await fetch('https://api.anthropic.com/v1/models', {
        method: 'HEAD',
        headers: {
          'x-api-key': anthropicApiKey,
          'anthropic-version': '2023-06-01'
        },
        signal: AbortSignal.timeout(5000)
      });
      services.anthropic = testResponse.ok ? 'up' : 'degraded';
    } catch {
      services.anthropic = 'down';
    }
  }

  const isHealthy = Object.values(services).every(
    status => status === 'up' || status === 'configured' || status === 'not_applicable'
  );
  const isDegraded = Object.values(services).some(status => status === 'degraded');
  const overallStatus: ReadinessResponse['status'] = isHealthy ? 'healthy' : isDegraded ? 'degraded' : 'unhealthy';
  const statusCode = overallStatus === 'unhealthy' ? 503 : 200;
  const completedAt = Date.now();

  return {
    status: overallStatus,
    version: VERSION,
    timestamp: new Date(completedAt).toISOString(),
    services,
    metrics: {
      checkDurationMs: completedAt - startTime,
      uptime: process.uptime()
    },
    cache: {
      cachedAt: new Date(completedAt).toISOString(),
      expiresAt: new Date(completedAt + READINESS_TTL_MS).toISOString(),
      ttlMs: READINESS_TTL_MS,
      cacheHit: false
    },
    statusCode
  };
}

async function getCachedReadiness(): Promise<ReadinessResponse> {
  const now = Date.now();

  if (cachedReadiness && cachedReadiness.expiresAt > now) {
    return {
      ...cachedReadiness.payload,
      cache: { ...cachedReadiness.payload.cache, cacheHit: true }
    };
  }

  if (readinessPromise) {
    const payload = await readinessPromise;
    return { ...payload, cache: { ...payload.cache, cacheHit: true } };
  }

  readinessPromise = computeReadiness()
    .then(payload => {
      cachedReadiness = {
        expiresAt: Date.now() + READINESS_TTL_MS,
        payload
      };
      readinessPromise = null;
      return payload;
    })
    .catch(error => {
      readinessPromise = null;
      throw error;
    });

  return readinessPromise;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!isAuthorized(request)) {
    return minimalLiveness();
  }

  try {
    const readiness = await getCachedReadiness();
    return NextResponse.json(readiness, { status: readiness.statusCode });
  } catch (error) {
    console.error('Health readiness check error:', error);

    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        message: 'Readiness check failed'
      },
      { status: 503 }
    );
  }
}
