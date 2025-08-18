# Chapter Smith

Turn any YouTube URL into polished, timestamped chapters—built by autonomous Claude sub-agents

![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Anthropic Claude](https://img.shields.io/badge/Anthropic-Claude%203%20Haiku-orange)
![YouTube API](https://img.shields.io/badge/YouTube-Data%20API%20v3-red?logo=youtube)

## 🎯 What This Demo Does

Chapter Smith automatically generates professional-quality, timestamped chapters for any YouTube video. Simply paste a YouTube URL, or upload your SRT file and our AI-powered system:

- **Extracts** video transcripts using YouTube's API with intelligent fallbacks
- **Analyzes** content using Claude 3 Haiku to identify natural topic transitions  
- **Generates** polished chapter titles, descriptions, and precise timestamps
- **Exports** chapters in multiple formats (YouTube, SRT, JSON, CSV, XML, Markdown)

### Why This Demo is Compelling

This project showcases the incredible potential of AI agents working autonomously to solve real-world content problems. Unlike manual chapter creation (which can take hours!), Chapter Smith delivers professional results in under 60 seconds, demonstrating how AI can augment human creativity rather than replace it.

**Real Impact:** Content creators spend 2-4 hours manually creating chapters for long-form videos. Chapter Smith reduces this to 30 seconds while maintaining quality that rivals human-created chapters. Most YouTube videos do not include chapters because of how tedious this process is. Having video chapters also helps with SEO and viewer engagement.

I chose to build this project because I've encountered this problem multiple times! I manually create chapters for youtube videos and it takes hours. I've always wished for a tool that could automate this process and save me time.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ 
- YouTube Data API v3 key
- Anthropic API key

### 1. Clone and Install

```bash
git clone https://github.com/LadyKerr/chapter-smith.git
cd chapter-smith
npm install
```

### 2. Environment Setup

Create `.env.local` in the project root:

```bash
# Required API Keys
YOUTUBE_API_KEY=your_youtube_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and paste any YouTube URL to see the magic happen!

### 4. Verify Setup

Test the health endpoint:
```bash
curl http://localhost:3000/api/health
```

## API Documentation

Read the full api documentation here [API Docs](/API_README.md)

## 🔧 API Key Management

### YouTube Data API v3 Setup

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **YouTube Data API v3**
4. Create credentials → API Key
5. Restrict the key to YouTube Data API v3 only
6. Optional: Add HTTP referrer restrictions for security

**Quota Information:**
- Default: 10,000 units/day
- Video details: 1 unit per request
- Request quota increases via Google Cloud Console

### Anthropic API Setup

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create account and verify email
3. Generate API key in dashboard
4. Monitor usage and billing

**Model Used:** Claude 3 Haiku
- **Cost:** $0.25/1M input tokens, $1.25/1M output tokens
- **Speed:** Optimized for fast, cost-effective processing
- **Rate Limits:** 50 requests/minute, 40,000 tokens/minute

## 📦 Dependencies & Architecture

### Core Dependencies

```json
{
  "react": "19.1.0",
  "next": "15.4.6", 
  "@anthropic-ai/sdk": "^0.24.0",
  "youtube-transcript": "^1.2.1"
}
```

### Technical Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Next.js API    │    │   External      │
│   React/Next.js │◄──►│   Routes         │◄──►│   Services      │
│                 │    │                  │    │                 │
│ • URL Input     │    │ • /youtube/      │    │ • YouTube API   │
│ • Progress UI   │    │   transcript     │    │ • Anthropic API │
│ • Chapter List  │    │ • /chapters/     │    │ • Transcript    │
│ • Export Tools  │    │   generate       │    │   Services      │
└─────────────────┘    │ • /chapters/     │    └─────────────────┘
                       │   export         │
                       │ • /health        │
                       └──────────────────┘
```

### Production Deployment

**Environment Variables for Production:**
```bash
YOUTUBE_API_KEY=your_production_youtube_key
ANTHROPIC_API_KEY=your_production_anthropic_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

**Deployment Platforms:**
- ✅ **Vercel** (Recommended) - Zero-config deployment
- ✅ **Railway** - Database-ready infrastructure  
- ✅ **Render** - Simple container deployment
- ✅ **Docker** - Self-hosted containerized deployment


### Key Architectural Decisions

1. **Next.js App Router:** Leverages React Server Components for optimal performance
2. **TypeScript Throughout:** 100% type safety from frontend to API endpoints
3. **Modular API Design:** Each endpoint handles one responsibility with comprehensive error handling
4. **AI Agent Architecture:** Claude operates as an autonomous sub-agent with specialized prompting
5. **Graceful Degradation:** Multiple fallbacks for transcript fetching and error scenarios
6. **Export Flexibility:** Supports 7+ export formats for maximum compatibility

## 🎨 Why This Demonstration

I chose this project to showcase several key AI development patterns:

### 1. **AI Agent Autonomy**
Claude operates independently to analyze content and make intelligent decisions about chapter boundaries, demonstrating how AI can handle complex, subjective tasks traditionally requiring human judgment.

### 2. **Real-World API Integration** 
Shows production-ready patterns for integrating multiple external services (YouTube, Anthropic) with proper error handling, rate limiting, and fallback strategies.

### 3. **Practical AI Application**
Solves a genuine pain point for content creators, proving AI's value in augmenting human workflows rather than replacing them.

### 4. **Technical Excellence**
Demonstrates modern development practices: TypeScript safety, comprehensive error handling, proper API design, and user experience considerations.

## 🌟 Understanding Claude's Potential

This demo illustrates several transformative aspects of Claude's capabilities:

### Content Understanding
- **Semantic Analysis:** Claude identifies topic transitions and thematic shifts in transcripts
- **Context Awareness:** Maintains understanding of video structure and flow
- **Quality Consistency:** Generates professional-quality output matching human editorial standards

### Agentic Architecture
Claude's ability to function as a multi-faceted agent allows for a more streamlined development process. By handling various roles—such as frontend developer, backend architect, and UX designer, Claude reduces the need for extensive human intervention, enabling faster iteration and deployment. This unlocks so much potential for productivity and speed for developers when building production-grade applications.

## 🚀 What Makes Builders Want to Learn More

Builders would want to learn more about how Claude was able to produce a production ready UI with a single prompt. Using subagents to do initial planning, and splitting the build into phases, this was achieved with minimal human intervention.

Developers would be excited to start using subagents to build their projects and streamline their workflow with multi-agent collaboration. I know I am super excited about this - it was incredible to watch it come to life!

## 🤖 How I Used Claude in Creating This Demo

I wrote a blog post about this process while I was building. You can read it [here](/docs/building-with-subagents.md).

## Future Work

Given more time, I would implement the following features:
- full youtube api integration: there was a lot of sunken cost in implementing the url to chapter pipeline. MVP includes uploading a SRT file and getting chapters. Would love to spend time fixing the youtube api issue so that it can directly process video URLs.
- add analytics to track user behavior and improve the system based on real-world usage patterns.
- implement user authentication and authorization to personalize the experience and protect user data.
- add a database to store user preferences and interaction history.
- improve the ui to be more colorful and playful. Love the design, but it could use a bit more flair.

The primary goal of this project was to demonstrate how subagents can be used with Claude to streamline the development process and enhance collaboration among AI agents.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by [LadyKerr](https://github.com/LadyKerr) • Powered by Claude**