'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export type TTSRate = 0.75 | 1 | 1.25 | 1.5;

export function useTTS(text: string) {
  const [isReading, setIsReading] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [rate, setRate] = useState<TTSRate>(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const wordsRef = useRef<string[]>([]);

  const isSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Update words when text changes
  useEffect(() => {
    wordsRef.current = text.split(/\s+/).filter(Boolean);
  }, [text]);

  const speak = useCallback(() => {
    if (!isSupported) {
      console.warn('Speech synthesis is not supported in this browser.');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;

    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      if (event.name === 'word') {
        // Calculate word index from character index
        const charIndex = event.charIndex;
        const textUpToChar = text.slice(0, charIndex);
        const wordIndex = textUpToChar.split(/\s+/).filter(Boolean).length;
        setCurrentWordIndex(wordIndex);
      }
    };

    utterance.onstart = () => {
      setIsReading(true);
      setCurrentWordIndex(0);
    };

    utterance.onend = () => {
      setIsReading(false);
      setCurrentWordIndex(-1);
    };

    utterance.onerror = (event) => {
      if (event.error !== 'canceled') {
        console.error('Speech synthesis error:', event.error);
      }
      setIsReading(false);
      setCurrentWordIndex(-1);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported, text, rate]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsReading(false);
    setCurrentWordIndex(-1);
  }, [isSupported]);

  const pause = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.pause();
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.resume();
  }, [isSupported]);

  const setSpeed = useCallback(
    (newRate: TTSRate) => {
      setRate(newRate);
      // If currently reading, restart with new rate
      if (isReading) {
        window.speechSynthesis.cancel();
        // Small delay to allow cancel to complete
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = newRate;

          utterance.onboundary = (event: SpeechSynthesisEvent) => {
            if (event.name === 'word') {
              const charIndex = event.charIndex;
              const textUpToChar = text.slice(0, charIndex);
              const wordIndex = textUpToChar.split(/\s+/).filter(Boolean).length;
              setCurrentWordIndex(wordIndex);
            }
          };

          utterance.onend = () => {
            setIsReading(false);
            setCurrentWordIndex(-1);
          };

          utterance.onerror = (event) => {
            if (event.error !== 'canceled') {
              console.error('Speech synthesis error:', event.error);
            }
            setIsReading(false);
            setCurrentWordIndex(-1);
          };

          utteranceRef.current = utterance;
          window.speechSynthesis.speak(utterance);
        }, 50);
      }
    },
    [isReading, text]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return {
    speak,
    stop,
    pause,
    resume,
    isReading,
    currentWordIndex,
    rate,
    setSpeed,
    isSupported,
  };
}
