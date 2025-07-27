// Speech Service for CitySync Plus
// Handles Web Speech API integration with ElevenLabs API key stored for future use

interface SpeechToTextResult {
  text: string;
  confidence: number;
  duration: number;
}

interface SpeechRecordingState {
  isRecording: boolean;
  isProcessing: boolean;
  error: string | null;
}

class SpeechService {
  private apiKey: string | null = null;
  private recognition: any = null;
  private isRecognitionActive = false;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || null;
  }

  // Check if speech recognition is supported
  isSupported(): boolean {
    return !!(('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window));
  }

  // Simple speech recognition that returns a promise
  async recognizeSpeech(): Promise<SpeechToTextResult> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error('Speech recognition not supported in this browser'));
        return;
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      let hasResult = false;

      recognition.onresult = (event: any) => {
        hasResult = true;
        const result = event.results[0];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence || 0.8;

        resolve({
          text: transcript.trim(),
          confidence: confidence,
          duration: 0
        });
      };

      recognition.onerror = (event: any) => {
        if (!hasResult) {
          reject(new Error(`Speech recognition error: ${event.error}`));
        }
      };

      recognition.onend = () => {
        if (!hasResult) {
          reject(new Error('No speech was detected'));
        }
      };

      // Start recognition
      recognition.start();

      // Set a timeout to prevent hanging
      setTimeout(() => {
        if (!hasResult) {
          recognition.stop();
          reject(new Error('Speech recognition timeout - please try again'));
        }
      }, 10000); // 10 second timeout
    });
  }

  // Legacy methods for compatibility
  async startRecording(): Promise<void> {
    // This is now just a placeholder
    console.log('Use recognizeSpeech() instead');
  }

  async stopRecording(): Promise<Blob> {
    // Return empty blob for compatibility
    return new Blob([], { type: 'audio/webm' });
  }

  async transcribeAudio(audioBlob: Blob): Promise<SpeechToTextResult> {
    // Use the simple recognition method instead
    return this.recognizeSpeech();
  }

  // Alternative method using ElevenLabs (if they add speech-to-text in the future)
  private async useElevenLabsAPI(audioBlob: Blob): Promise<SpeechToTextResult> {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    try {
      // This is a placeholder for future ElevenLabs speech-to-text API
      // Currently, ElevenLabs focuses on text-to-speech
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch(`${this.baseUrl}/speech-to-text`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        text: data.text || '',
        confidence: data.confidence || 0.8,
        duration: data.duration || 0
      };
    } catch (error) {
      console.error('ElevenLabs API not available for speech-to-text:', error);
      throw error;
    }
  }

  // Complete speech-to-text workflow
  async recordAndTranscribe(): Promise<SpeechToTextResult> {
    try {
      await this.startRecording();
      
      // Return a promise that resolves when recording is stopped
      return new Promise((resolve, reject) => {
        // This will be controlled by the UI component
        // The component will call stopRecording() and then transcribeAudio()
        reject(new Error('Use startRecording() and stopRecording() separately'));
      });
    } catch (error) {
      throw error;
    }
  }

  // Check if currently recording
  isRecording(): boolean {
    return this.isRecognitionActive;
  }

  // Cancel current recording
  cancelRecording(): void {
    if (this.recognition && this.isRecognitionActive) {
      this.recognition.abort();
      this.isRecognitionActive = false;
    }
  }
}

// Export singleton instance
export const speechService = new SpeechService();

// Export types
export type { SpeechToTextResult, SpeechRecordingState };
