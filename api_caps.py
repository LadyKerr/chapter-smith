#!/usr/bin/env python3

import sys
import json
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, VideoUnavailable, NoTranscriptFound

def fetch_transcript(video_id):
    """
    Fetch YouTube transcript for a given video ID and return structured data
    """
    try:
        # Try to get transcript in preferred order: English, then any available language
        transcript_list = YouTubeTranscriptApi().list(video_id)
        
        # Try to find English transcript first
        transcript = None
        try:
            transcript = transcript_list.find_transcript(['en'])
        except NoTranscriptFound:
            # If no English transcript, get the first available one
            available_transcripts = list(transcript_list)
            if available_transcripts:
                transcript = available_transcripts[0]
            else:
                raise NoTranscriptFound(video_id, [], [])
        
        # Fetch the transcript data
        transcript_data = transcript.fetch()
        
        # Calculate total duration
        total_duration = 0
        if transcript_data:
            last_segment = transcript_data[-1]
            total_duration = last_segment.start + last_segment.duration
        
        # Convert transcript data to dictionary format
        transcript_segments = []
        for segment in transcript_data:
            transcript_segments.append({
                'text': segment.text,
                'start': segment.start,
                'duration': segment.duration
            })
        
        # Return structured response
        return {
            "success": True,
            "videoId": video_id,
            "title": f"Video {video_id}",  # YouTube API doesn't provide title in transcript
            "duration": total_duration,
            "language": transcript.language_code,
            "transcript": transcript_segments
        }
        
    except TranscriptsDisabled:
        return {
            "success": False,
            "error": "Transcripts are disabled for this video"
        }
    except VideoUnavailable:
        return {
            "success": False,
            "error": "Video is unavailable or private"
        }
    except NoTranscriptFound:
        return {
            "success": False,
            "error": "No transcript found for this video"
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to fetch transcript: {str(e)}"
        }

def main():
    if len(sys.argv) != 2:
        print(json.dumps({
            "success": False,
            "error": "Usage: python3 api_caps.py <video_id>"
        }))
        sys.exit(1)
    
    video_id = sys.argv[1]
    result = fetch_transcript(video_id)
    
    if result["success"]:
        print(json.dumps(result))
        sys.exit(0)
    else:
        print(json.dumps(result), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()