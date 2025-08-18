import { NextRequest, NextResponse } from 'next/server';

/**
 * Health Check API Endpoint
 * 
 * GET /api/health
 * 
 * Returns system health status and service availability
 */
export async function GET(): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    // Check environment variables
    const youtubeApiKey = process.env.YOUTUBE_API_KEY;
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

    // Basic service checks
    const services = {
      youtube: youtubeApiKey ? 'configured' : 'not_configured',
      anthropic: anthropicApiKey ? 'configured' : 'not_configured',
      database: 'not_applicable', // No database in current setup
      redis: 'not_applicable'     // No Redis in current setup
    };

    // Test external service connectivity
    if (youtubeApiKey) {
      try {
        const testResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?id=dQw4w9WgXcQ&part=snippet&key=${youtubeApiKey}`,
          { 
            method: 'HEAD',
            signal: AbortSignal.timeout(5000) // 5 second timeout
          }
        );
        services.youtube = testResponse.ok ? 'up' : 'degraded';
      } catch (error) {
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
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        services.anthropic = testResponse.ok ? 'up' : 'degraded';
      } catch (error) {
        services.anthropic = 'down';
      }
    }

    // Determine overall status
    const isHealthy = Object.values(services).every(
      status => status === 'up' || status === 'configured' || status === 'not_applicable'
    );
    const isDegraded = Object.values(services).some(
      status => status === 'degraded'
    );

    const overallStatus = isHealthy ? 'healthy' : isDegraded ? 'degraded' : 'unhealthy';

    // Mock metrics (in production, these would come from monitoring system)
    const metrics = {
      uptime: process.uptime(),
      requestCount24h: 0, // Would be tracked in production
      errorRate24h: 0,    // Would be tracked in production
      averageResponseTime: Date.now() - startTime
    };

    const healthResponse = {
      status: overallStatus,
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      services,
      metrics
    };

    const statusCode = overallStatus === 'healthy' ? 200 : 
                      overallStatus === 'degraded' ? 200 : 503;

    return NextResponse.json(healthResponse, { status: statusCode });

  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      services: {
        youtube: 'unknown',
        anthropic: 'unknown',
        database: 'not_applicable',
        redis: 'not_applicable'
      },
      metrics: {
        uptime: process.uptime(),
        requestCount24h: 0,
        errorRate24h: 1,
        averageResponseTime: Date.now() - startTime
      }
    }, { status: 503 });
  }
}