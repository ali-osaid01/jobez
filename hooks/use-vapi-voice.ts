import { useState, useCallback, useRef, useEffect } from 'react';

interface VapiVoiceConfig {
  apiKey: string;
  assistantId?: string;
}

export function useVapiVoice(config: VapiVoiceConfig) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  /**
   * Use Vapi Text-to-Speech API to convert text to audio
   */
  const speak = useCallback(
    async (text: string): Promise<void> => {
      try {
        setIsSpeaking(true);
        setError(null);

        const response = await fetch('https://api.vapi.ai/text-to-speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            voice: {
              provider: 'google', // or 'eleven-labs', 'azure', etc.
              voiceId: 'en-US-Neural2-C', // Professional female voice
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`Vapi TTS failed: ${response.statusText}`);
        }

        const { audioUrl } = await response.json();

        // Play the audio
        const audio = new Audio(audioUrl);
        audio.onended = () => {
          setIsSpeaking(false);
        };
        audio.onerror = () => {
          setError('Failed to play audio');
          setIsSpeaking(false);
        };

        await audio.play();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        setIsSpeaking(false);
      }
    },
    [config.apiKey]
  );

  /**
   * Start listening using browser's Web Speech API
   * (Vapi conversation mode would handle this, but for now we use native API)
   */
  const startListening = useCallback(() => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setError('Speech Recognition not supported');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript(transcript);
          } else {
            interim += transcript;
          }
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setError('Listening failed');
      };

      recognition.start();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    }
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isSpeaking,
    isListening,
    transcript,
    error,
    speak,
    startListening,
    stopListening,
    clearTranscript,
  };
}
