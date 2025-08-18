# Local Development Setup - Chapter Smith

Quick start guide for running Chapter Smith locally.

## Prerequisites

- **Node.js 18+** and npm
- **Python 3.8+** and pip
- **Anthropic API key** (get from [console.anthropic.com](https://console.anthropic.com/))

## Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd chapter-smith
   npm install
   ```

2. **Set up Python environment:**
   ```bash
   # macOS/Linux
   npm run setup:python
   
   # Windows
   npm run setup:python:win
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_actual_api_key_here
   ```

4. **Test the setup:**
   ```bash
   # Test Python script
   source venv/bin/activate  # macOS/Linux
   # venv\Scripts\activate   # Windows
   python3 api_caps.py dQw4w9WgXcQ
   deactivate
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the app running!

## Development Workflow

### Testing the Full Pipeline
1. Open the app at `http://localhost:3000`
2. Paste a YouTube URL (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
3. Click "Generate Chapters"
4. View the AI-generated chapters with timestamps

### API Testing
- Health check: `http://localhost:3000/api/health`
- Test transcript fetching directly:
  ```bash
  curl -X POST http://localhost:3000/api/chapters/generate \
    -H "Content-Type: application/json" \
    -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
  ```

### Common Development Tasks

**Restart Python environment:**
```bash
rm -rf venv
npm run setup:python
```

**Check logs:**
- Browser DevTools Console for frontend
- Terminal running `npm run dev` for API logs

**Lint and format:**
```bash
npm run lint
```

## Troubleshooting

### "Python script not found"
- Ensure `api_caps.py` is in project root
- Check virtual environment is activated
- Verify file permissions

### "youtube-transcript-api not found"
- Re-run: `npm run setup:python`
- Manually install: `pip install youtube-transcript-api>=1.2.2`

### "Invalid API key" 
- Check `.env.local` file exists and has correct API key
- Verify key format (starts with `sk-`)
- Test key at [console.anthropic.com](https://console.anthropic.com/)

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
npm run dev
```

## Project Structure

```
chapter-smith/
├── src/app/api/          # API routes
│   ├── chapters/generate/  # Main chapter generation
│   └── health/            # Health check
├── src/app/components/   # React components  
├── api_caps.py          # Python transcript fetcher
├── requirements.txt     # Python dependencies
└── .env.local          # Your environment config
```

Ready to deploy? Check out [DEPLOYMENT.md](./DEPLOYMENT.md) for platform-specific guides!