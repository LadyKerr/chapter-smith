#!/usr/bin/env python3
"""
YouTube Transcript Fetcher

Fetches transcript from a YouTube video using the video ID.
Outputs clean transcript text to stdout for consumption by Node.js.
"""

import sys
import json
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    TranscriptsDisabled,
    NoTranscriptFound,
    VideoUnavailable,
    CouldNotRetrieveTranscript
)

def extract_video_id(url_or_id):
    """Extract video ID from YouTube URL or return if already an ID"""
    if 'youtube.com' in url_or_id or 'youtu.be' in url_or_id:
        if 'watch?v=' in url_or_id:
            return url_or_id.split('watch?v=')[1].split('&')[0]
        elif 'youtu.be/' in url_or_id:
            return url_or_id.split('youtu.be/')[1].split('?')[0]
    return url_or_id

def fetch_transcript(video_id):
    """Fetch transcript for given video ID"""
    try:
        # Create API instance and fetch transcript
        api = YouTubeTranscriptApi()
        
        # Try to fetch with preferred languages
        try:
            transcript = api.fetch(video_id, languages=['en', 'en-US', 'en-GB'])
        except NoTranscriptFound:
            # Try with any available language
            transcript = api.fetch(video_id)
        
        # The fetch method returns a FetchedTranscript object with snippets
        # Extract and clean text
        full_text = ' '.join([snippet.text for snippet in transcript])
        
        # Clean up common transcript artifacts
        cleaned_text = full_text.replace('[Music]', '').replace('[Applause]', '').replace('[♪♪♪]', '')
        cleaned_text = cleaned_text.replace('♪', '')  # Remove music notes
        cleaned_text = ' '.join(cleaned_text.split())  # Remove extra whitespace
        
        return {
            'success': True,
            'transcript': cleaned_text,
            'language': 'en'
        }
        
    except TranscriptsDisabled:
        return {
            'success': False,
            'error': 'Transcripts are disabled for this video'
        }
    except CouldNotRetrieveTranscript:
        return {
            'success': False,
            'error': 'Could not retrieve transcript for this video'
        }
    except VideoUnavailable:
        return {
            'success': False,
            'error': 'Video is unavailable or private'
        }
    except Exception as e:
        return {
            'success': False,
            'error': f'Unexpected error: {str(e)}'
        }

def main():
    if len(sys.argv) != 2:
        print(json.dumps({
            'success': False,
            'error': 'Usage: python fetch_transcript.py <video_id_or_url>'
        }))
        sys.exit(1)
    
    video_input = sys.argv[1]
    video_id = extract_video_id(video_input)
    
    if not video_id:
        print(json.dumps({
            'success': False,
            'error': 'Invalid YouTube video ID or URL'
        }))
        sys.exit(1)
    
    result = fetch_transcript(video_id)
    print(json.dumps(result))

if __name__ == '__main__':
    main()