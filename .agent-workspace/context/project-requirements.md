# Project Requirements - YouTube Chapters Generator

## Project Overview
A web application that automatically generates timestamped chapters for YouTube videos by analyzing their transcripts. The app provides a simple interface for users to input YouTube URLs, retrieve transcripts, and generate organized chapters that can be copied or exported.

## Core Features (LOCKED SCOPE)

### 1. URL Input Interface
- Single input field for YouTube video URLs
- Real-time URL validation (YouTube format checking)
- Clear error messaging for invalid URLs
- Support for various YouTube URL formats (youtube.com/watch, youtu.be/, etc.)

### 2. Transcript Retrieval
- Automatic transcript fetching via YouTube Data API v3
- Support for auto-generated and manual captions
- Language detection and handling
- Clear status indicators during fetch process

### 3. Fallback Upload System
- .srt file upload when YouTube transcript unavailable
- Drag-and-drop interface for file uploads
- File validation (format, size limits)
- Parse .srt timestamps and text content

### 4. Chapter Generation
- AI-powered analysis of transcript content
- Intelligent topic detection and segmentation
- Automatic timestamp assignment
- Generated chapter titles (concise, descriptive)
- Minimum chapter length: 30 seconds
- Maximum chapters: 20 per video

### 5. Chapter Display
- Clean, organized list view
- Timestamp format: MM:SS or HH:MM:SS
- Chapter titles with brief descriptions
- Easy-to-read typography and spacing
- Mobile-responsive layout

### 6. Copy Functionality
- One-click copy all chapters to clipboard
- Individual chapter copy options
- Visual feedback for successful copy actions
- Proper formatting for YouTube description paste

### 7. Export Feature
- Download chapters as formatted .txt file
- Include video title and URL in export
- Timestamp formatting options
- Clean, readable export format

### 8. Error Handling
- Network connectivity issues
- Invalid YouTube URLs
- API rate limiting
- Transcript unavailable scenarios
- File upload errors
- Processing failures

## Technical Requirements

### Frontend Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Build Tool**: Next.js built-in
- **Package Manager**: npm

### Backend Stack
- **API Routes**: Next.js API routes
- **External API**: YouTube Data API v3
- **File Processing**: Native Node.js for .srt parsing
- **AI Integration**: claude-sonnet-4-20250514 for chapter generation

### Performance Requirements
- Initial page load: < 3 seconds
- Transcript fetch: < 10 seconds
- Chapter generation: < 15 seconds
- Mobile performance: 90+ Lighthouse score
- Accessibility: WCAG 2.1 AA compliance

## User Experience Requirements

### Design Principles
- **Simplicity**: Single-purpose, focused interface
- **Clarity**: Clear status indicators and feedback
- **Speed**: Minimal clicks to complete tasks
- **Accessibility**: Screen reader compatible, keyboard navigation
- **Mobile-first**: Responsive design for all devices

### User Flow
1. User enters YouTube URL
2. App validates and fetches transcript
3. If transcript unavailable, user uploads .srt file
4. App generates chapters automatically
5. User reviews generated chapters
6. User copies chapters or exports to file

### Interaction Requirements
- Immediate visual feedback for all actions
- Loading states for all async operations
- Error recovery options
- Progress indicators for long operations
- Micro-animations for engagement

## Content Requirements

### Chapter Format
```
0:00 Introduction
2:30 Main Topic Overview
5:45 Key Point 1
8:20 Key Point 2
12:15 Conclusion
```

### Export Format
```
Video: [Video Title]
URL: [YouTube URL]
Generated: [Date/Time]

Chapters:
0:00 Introduction
2:30 Main Topic Overview
5:45 Key Point 1
8:20 Key Point 2
12:15 Conclusion
```

## API Requirements

### YouTube Data API v3
- Endpoint: `https://www.googleapis.com/youtube/v3/captions`
- Required scopes: Read-only access
- Rate limiting: Respect YouTube API quotas
- Error handling: Graceful degradation

### Chapter Generation AI
- Input: Raw transcript text with timestamps
- Output: Structured chapter list with titles
- Processing time: < 15 seconds for 1-hour video
- Quality: Meaningful, descriptive chapter titles

## Security & Privacy

### Data Handling
- No user data storage
- No video content storage
- Process transcripts in memory only
- Clear temporary data after processing

### API Security
- Environment variable for API keys
- Rate limiting protection
- Input validation and sanitization
- CORS protection

## Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment Requirements
- **Platform**: Vercel (recommended)
- **Environment**: Node.js 18+
- **Environment Variables**: YouTube API key, AI API key
- **Domain**: Custom domain support
- **SSL**: HTTPS required

## Success Metrics
- Successful chapter generation rate: >95%
- Average processing time: <20 seconds
- User completion rate: >80%
- Mobile usability score: >90
- Accessibility compliance: WCAG 2.1 AA

## Constraints & Limitations

### Feature Constraints
- NO user authentication
- NO data persistence/storage
- NO premium features
- NO social sharing
- NO video playback
- NO comments or ratings
- NO user accounts
- NO payment processing

### Technical Constraints
- Single-page application
- Client-side state management only
- No database required
- No server-side sessions
- No real-time features
- No offline functionality

### Content Constraints
- YouTube videos only (no other platforms)
- English language transcripts primarily
- Maximum video length: 4 hours
- SRT files only for upload (no other subtitle formats)

## Risk Mitigation

### API Dependencies
- YouTube API quota monitoring
- Fallback error messaging
- Graceful degradation when APIs unavailable

### Performance Risks
- Lazy loading for better initial load
- Optimize bundle size
- Efficient transcript processing
- Memory management for large files

### User Experience Risks
- Clear loading indicators
- Helpful error messages
- Alternative flows when primary fails
- Mobile optimization priority

## Development Phases
1. **Phase 1**: UX Research & Planning
2. **Phase 2**: UI Design & Micro-interactions
3. **Phase 3**: Frontend Component Development
4. **Phase 4**: Backend API & AI Integration

Each phase must reference these requirements and stay within the defined scope.