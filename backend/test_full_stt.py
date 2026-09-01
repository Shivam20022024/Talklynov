from dotenv import load_dotenv
import os
import sys
import base64
import requests

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv('.env.local')

import process_audio

def test_full_process():
    print("--- Testing 100% OpenRouter Audio Processing ---")
    print(f"Model: {process_audio.OPENROUTER_MODEL}")
    
    # We need a small audio file to test. 
    # I'll check if there's any file in 'transcripts' or 'results' or just look for a .wav/.mp3
    sample_file = None
    for root, dirs, files in os.walk("."):
        for f in files:
            if f.endswith((".wav", ".mp3", ".m4a")):
                sample_file = os.path.join(root, f)
                break
        if sample_file: break
        
    if not sample_file:
        print("No sample audio file found in the directory to test.")
        return

    print(f"Testing with file: {sample_file}")
    
    result = process_audio.openrouter_audio_analysis(sample_file)
    
    if result:
        print("\nSUCCESS: Complete Analysis Received!")
        print(f"Transcript Preview: {result.get('transcript')[:100]}...")
        print(f"Summary: {result.get('summary')}")
        print(f"Sentiment: {result.get('sentiment')} ({result.get('sentiment_confidence')})")
        print(f"Intents: {result.get('intents')}")
    else:
        print("\nFAILED: No result received from OpenRouter.")

if __name__ == "__main__":
    test_full_process()
