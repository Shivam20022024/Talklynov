from dotenv import load_dotenv
import os
import sys

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv('.env.local')

import process_audio

def test_openrouter():
    print("--- Testing OpenRouter Integration ---")
    print(f"Model: {process_audio.OPENROUTER_MODEL}")
    
    transcript = """
    Agent: Thank you for calling Customer Support. How can I help you today?
    Customer: Hi, I'm extremely frustrated. I bought a villa last week but the floor plan you sent doesn't match the actual site.
    Agent: I am very sorry to hear that. Let me look into your booking for the property immediately.
    Customer: Please do. I need this resolved by tomorrow or I'll cancel the purchase.
    """
    
    print("\n1. Testing Transcript Refinement...")
    refined = process_audio.openrouter_refine_transcript(transcript)
    if refined:
        print("SUCCESS: Refined Transcript captured.")
        print(f"Preview: {refined[:100]}...")
    else:
        print("FAILED: No refined transcript returned.")

    print("\n2. Testing Analysis (Summary, Sentiment, Intents)...")
    fallback_intents = process_audio.detect_intents(transcript)
    analysis = process_audio.openrouter_analysis(transcript, fallback_intents)
    
    if analysis:
        print("SUCCESS: Analysis captured.")
        print(f"Summary: {analysis.get('summary')}")
        print(f"Sentiment: {analysis.get('sentiment')} (Confidence: {analysis.get('sentiment_confidence')})")
        print(f"Emotion: {analysis.get('emotion')}")
        print(f"Intents: {analysis.get('intents')}")
    else:
        print("FAILED: No analysis results returned.")

if __name__ == "__main__":
    test_openrouter()
