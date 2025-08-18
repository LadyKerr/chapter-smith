# Chapter Smith API Implementation

## Quick Start

### 1. Environment Setup

Create a `.env.local` file in the project root:

```bash
# Required
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Set up Python environment for reliable transcript fetching
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install youtube-transcript-api
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Test the API

```bash
# Health check
curl http://localhost:3000/api/health

# Test chapter generation (includes transcript fetching)
curl -X POST http://localhost:3000/api/chapters/generate \
  -H "Content-Type: application/json" \
  -d '{"videoId": "dQw4w9WgXcQ", "options": {"maxChapters": 5}}'

# Test with YouTube URL
curl -X POST http://localhost:3000/api/chapters/generate \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/watch?v=dQw4w9WgXcQ"}'
```

## API Endpoints

### Health Check
- **GET** `/api/health` - System health and service status

### Chapter Generation  
- **POST** `/api/chapters/generate` - Generate chapters from YouTube videos
- **Integrated transcript fetching** using Python script with `youtube-transcript-api`
- Supports YouTube URLs and video IDs
- AI-powered content analysis using Claude 3 Haiku and Anthropic SDK
- Customizable chapter length and count
- Confidence scoring and keyword extraction
- Language preference and fallback options

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
│   │   │   └── route.ts      # Chapter generation with integrated transcript fetching
│   │   └── export/
│   │       └── route.ts      # Chapter export endpoint
│   └── health/
│       └── route.ts          # Health check endpoint
├── types/
│   └── api.ts               # TypeScript interfaces
├── utils/
│   └── index.ts             # Updated with API integration
└── api_caps.py              # Python script for YouTube transcript fetching
```

## Key Features

### Production Ready
- Comprehensive error handling with specific error codes
- Input validation and sanitization
- Rate limiting support (ready for Redis integration)
- Structured logging and metrics collection
- TypeScript type safety throughout

### External Service Integration
- **Anthropic Claude API**: AI-powered chapter generation using TypeScript SDK
- **Python Script Integration**: Reliable YouTube transcript fetching with `youtube-transcript-api`
- **Child Process Management**: Secure execution of Python scripts from Node.js

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

### Python Environment Setup
The application requires Python 3.9+ for transcript fetching:

```bash
# Ensure Python virtual environment exists
python3 -m venv venv
source venv/bin/activate
pip install youtube-transcript-api>=1.2.2
```

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
- `ANTHROPIC_API_KEY` (required) - Your Anthropic Claude API key
- `NEXT_PUBLIC_APP_URL` (for internal API calls)

### Python Dependencies
Ensure the virtual environment is set up with required packages:
- `youtube-transcript-api>=1.2.2`

### Platform Specific

#### Vercel
```bash
vercel env add ANTHROPIC_API_KEY
vercel deploy
```

**Note:** Ensure your deployment platform supports Python 3.9+ runtime and install the required Python packages during build.

#### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app

# Install Python and pip
RUN apk add --no-cache python3 py3-pip python3-dev

# Install Python dependencies
COPY api_caps.py requirements.txt* ./
RUN python3 -m venv venv && \
    source venv/bin/activate && \
    pip install youtube-transcript-api>=1.2.2

# Install Node.js dependencies
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

Create a `requirements.txt` file:
```
youtube-transcript-api>=1.2.2
```

#### Railway/Render
Set environment variables in platform dashboard and deploy from Git.

## Troubleshooting

### Common Issues

1. **Python Environment Issues**
   - Ensure Python 3.9+ is installed
   - Verify virtual environment is activated
   - Check that `youtube-transcript-api` is installed in venv

2. **Anthropic API Rate Limits**
   - Monitor usage in Anthropic Console
   - Implement exponential backoff
   - Consider upgrading to higher tier

3. **Transcript Not Available**
   - Video may have captions disabled
   - Try different language preferences  
   - Check if video is private or region-locked
   - Use SRT upload fallback

4. **Python Script Execution Errors**
   - Check that `api_caps.py` exists in project root
   - Verify virtual environment path is correct
   - Check Python script output for specific errors

5. **CORS Issues**
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