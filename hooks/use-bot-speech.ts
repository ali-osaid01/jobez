import { useEffect, useState, useRef, useCallback } from 'react';

interface UseBotSpeechProps {
  enabled?: boolean;
}

export function useBotSpeech({ enabled = true }: UseBotSpeechProps = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize Speech Synthesis and Recognition
  useEffect(() => {
    if (!enabled) return;

    synthRef.current = window.speechSynthesis;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript(transcript);
          } else {
            interimTranscript += transcript;
          }
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };
    } else {
      setError('Speech Recognition not supported in this browser');
    }
  }, [enabled]);

  // Speak function
  const speak = useCallback(
    (text: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!synthRef.current || !enabled) {
          reject(new Error('Speech Synthesis not available'));
          return;
        }

        // Cancel any ongoing speech
        if (synthRef.current.speaking) {
          synthRef.current.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          resolve();
        };
        utterance.onerror = (event) => {
          setIsSpeaking(false);
          reject(new Error(`Speech synthesis error: ${event.error}`));
        };

        synthRef.current.speak(utterance);
      });
    },
    [enabled]
  );

  // Start listening function
  const startListening = useCallback(() => {
    if (!recognitionRef.current || !enabled) {
      setError('Speech Recognition not available');
      return;
    }

    setTranscript('');
    setError(null);
    recognitionRef.current.start();
  }, [enabled]);

  // Stop listening function
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  // Cancel speaking
  const cancelSpeech = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Clear transcript
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
    cancelSpeech,
    clearTranscript,
  };
}
