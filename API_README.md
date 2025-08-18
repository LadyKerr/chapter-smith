# Chapter Smith API Implementation

## Quick Start

### 1. Environment Setup

Create a `.env.local` file in the project root:

```bash
# Required
YOUTUBE_API_KEY=your_youtube_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 2. Install Dependencies

```bash
npm install
# The API endpoints will work with or without youtube-transcript
# If youtube-transcript fails to install, fallback methods will be used
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Test the API

```bash
# Health check
curl http://localhost:3000/api/health

# Test transcript fetching
curl -X POST http://localhost:3000/api/youtube/transcript \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/watch?v=dQw4w9WgXcQ"}'

# Test chapter generation
curl -X POST http://localhost:3000/api/chapters/generate \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/watch?v=dQw4w9WgXcQ"}'
```

## API Endpoints

### Health Check
- **GET** `/api/health` - System health and service status

### YouTube Transcript
- **POST** `/api/youtube/transcript` - Fetch video transcripts
- Supports YouTube URLs and video IDs
- Language preference and fallback options
- Auto-generated transcript detection

### Chapter Generation  
- **POST** `/api/chapters/generate` - Generate chapters from transcripts
- AI-powered content analysis using Claude 3 Haiku
- Customizable chapter length and count
- Confidence scoring and keyword extraction

### Chapter Export
- **POST** `/api/chapters/export` - Export chapters in multiple formats
- **GET** `/api/chapters/export` - List available export formats
- Supports: YouTube, Text, JSON, CSV, SRT, VTT, XML, Markdown
- Customizable templates and options

## File Structure

```
src/app/
├── api/
│   ├── chapters/
│   │   ├── generate/
│   │   │   └── route.ts      # Chapter generation endpoint
│   │   └── export/
│   │       └── route.ts      # Chapter export endpoint
│   ├── youtube/
│   │   └── transcript/
│   │       └── route.ts      # Transcript fetching endpoint
│   └── health/
│       └── route.ts          # Health check endpoint
├── types/
│   └── api.ts               # TypeScript interfaces
└── utils/
    └── index.ts             # Updated with API integration
```

## Key Features

### Production Ready
- Comprehensive error handling with specific error codes
- Input validation and sanitization
- Rate limiting support (ready for Redis integration)
- Structured logging and metrics collection
- TypeScript type safety throughout

### External Service Integration
- **YouTube Data API v3**: Video metadata and validation
- **Anthropic Claude API**: AI-powered chapter generation
- **YouTube Transcript API**: Multiple fallback methods for transcript fetching

### Export Formats
- **YouTube**: Optimized for video descriptions
- **Text**: Plain text with timestamps
- **JSON**: Structured data with metadata
- **CSV**: Spreadsheet compatible
- **SRT/VTT**: Subtitle formats
- **XML**: Structured markup
- **Markdown**: Documentation format

### Error Handling
- Standardized error response format
- Machine-readable error codes
- User-friendly error messages
- Development vs production error details

## Configuration

### YouTube API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project
3. Enable YouTube Data API v3
4. Create API key
5. Restrict to YouTube Data API v3

### Anthropic API Setup
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create account
3. Generate API key
4. Monitor usage in dashboard

### Rate Limiting (Optional)
For production deployments, configure Redis:

```bash
REDIS_URL=redis://localhost:6379
```

## Monitoring

### Health Endpoint
Check service status:
```bash
curl http://localhost:3000/api/health
```

Response includes:
- Overall system status
- Individual service health
- Performance metrics
- Configuration status

### Logging
All requests include:
- Request ID for tracing
- Processing time metrics
- Error details and stack traces (development)
- Success/failure rates

## Development vs Production

### Development Features
- Mock data fallbacks when APIs unavailable
- Detailed error stack traces
- Extended timeout for debugging
- Console logging for all operations

### Production Optimizations
- Error details sanitized
- Performance monitoring
- Rate limiting enforcement
- Quota management
- External service circuit breakers

## Testing

### Unit Tests
```bash
npm test
```

### Manual Testing
Use the provided curl examples or tools like Postman.

### Load Testing
```bash
# Install artillery
npm install -g artillery

# Run load test
artillery quick --count 10 --num 5 http://localhost:3000/api/health
```

## Deployment

### Environment Variables
Ensure all required environment variables are set:
- `YOUTUBE_API_KEY` (required)
- `ANTHROPIC_API_KEY` (required)
- `NEXT_PUBLIC_APP_URL` (for internal API calls)

### Platform Specific

#### Vercel
```bash
vercel env add YOUTUBE_API_KEY
vercel env add ANTHROPIC_API_KEY
vercel deploy
```

#### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Railway/Render
Set environment variables in platform dashboard and deploy from Git.

## Troubleshooting

### Common Issues

1. **YouTube API Quota Exceeded**
   - Check quota usage in Google Cloud Console
   - Implement request caching
   - Request quota increase if needed

2. **Anthropic API Rate Limits**
   - Monitor usage in Anthropic Console
   - Implement exponential backoff
   - Consider upgrading to higher tier

3. **Transcript Not Available**
   - Video may have captions disabled
   - Try different language preferences
   - Use SRT upload fallback

4. **CORS Issues**
   - Ensure correct NEXT_PUBLIC_APP_URL
   - Check domain configuration
   - Verify API endpoint URLs

### Debug Mode
Set environment variable for detailed logging:
```bash
DEBUG=true npm run dev
```

## Contributing

### Code Style
- TypeScript strict mode enabled
- ESLint configuration included
- Prettier for code formatting

### Adding New Export Formats
1. Add format to `ExportFormat` type in `api.ts`
2. Implement generator function in `export/route.ts`
3. Add format configuration to `EXPORT_FORMATS`
4. Update documentation

### Adding New Error Codes
1. Add to `APIErrorCode` enum in `api.ts`
2. Update error handling in relevant endpoints
3. Add to documentation

## Support

For issues and questions:
1. Check the health endpoint first
2. Review logs for error details
3. Verify environment configuration
4. Test with different video URLs
5. Check external service status

## License

This API implementation is part of the Chapter Smith project and follows the same license terms.