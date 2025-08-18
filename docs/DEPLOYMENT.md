# Deployment Guide - Chapter Smith

Chapter Smith is a hybrid Next.js + Python application that generates YouTube video chapters using AI. This guide covers deployment options for platforms that support both Node.js and Python environments.

## Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.8+
- Anthropic API key for chapter generation

## Environment Variables

Create a `.env.local` file in your project root:

```bash
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

## Platform Deployment Options

### 1. Railway (Recommended for Hybrid Apps)

Railway supports both Node.js and Python in the same deployment with excellent developer experience.

#### Steps:

1. **Connect to Railway:**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and create project
   railway login
   railway init
   ```

2. **Configure deployment:**
   - Railway will auto-detect Next.js
   - Create `railway.toml`:
   ```toml
   [build]
   builder = "nixpacks"
   
   [deploy]
   startCommand = "npm start"
   
   [[services]]
   name = "chapter-smith"
   ```

3. **Set environment variables:**
   - railway CLI doesn't support setting env vars directly
   - Use Railway dashboard to set ANTHROPIC_API_KEY

4. **Deploy:**
   ```bash
   railway up
   ```

**Railway handles:**
- Python virtual environment setup
- Node.js and Python coexistence
- Automatic HTTPS
- Environment variable management

### Development Workflow

1. **Frontend development:** Standard Next.js development at `http://localhost:3000`
2. **API testing:** Use the `/api/health` endpoint to verify setup
3. **Python debugging:** Test the `api_caps.py` script independently
4. **End-to-end testing:** Use a YouTube URL to test the full pipeline

## Production Considerations

### Security
- Store API keys as environment variables
- Enable CORS restrictions in production
- Implement rate limiting for API endpoints

### Performance
- Consider implementing caching for transcript fetching
- Add request timeout handling
- Monitor AI API usage and costs

### Monitoring
- Set up health check endpoints
- Monitor API response times
- Track error rates and failed requests

### Scaling
- Python script execution can be CPU intensive
- Consider queuing for large transcript processing
- Monitor memory usage during AI chapter generation

## Troubleshooting

### Common Issues

1. **Python script not found:**
   - Ensure `api_caps.py` is in project root
   - Check file permissions
   - Verify virtual environment setup

2. **Import errors:**
   - Confirm `youtube-transcript-api` is installed
   - Check Python path configuration

3. **API timeout errors:**
   - Increase timeout limits in deployment config
   - Consider transcript size limitations

4. **Build failures:**
   - Verify Node.js and Python versions
   - Check all dependencies are properly installed
   - Ensure environment variables are set

## Cost Optimization

- Use Railway's hobby plan for small deployments
- Monitor Anthropic API usage
- Implement request caching to reduce API calls
- Consider transcript preprocessing to reduce AI token usage
