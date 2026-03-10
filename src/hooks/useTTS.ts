'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export type TTSRate = 0.75 | 1 | 1.25 | 1.5;

export function useTTS(text: string) {
  const [isReading, setIsReading] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [rate, setRate] = useState<TTSRate>(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const wordsRef = useRef<string[]>([]);

  const isSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Load available voices
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      // Filter to English voices for quiz bowl
      const englishVoices = available.filter((v) => v.lang.startsWith('en'));
      setVoices(englishVoices.length > 0 ? englishVoices : available);
      // Default to first English voice
      if (!selectedVoice && englishVoices.length > 0) {
        setSelectedVoice(englishVoices[0]);
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [isSupported, selectedVoice]);

  // Update words when text changes
  useEffect(() => {
    wordsRef.current = text.split(/\s+/).filter(Boolean);
  }, [text]);

  const createUtterance = useCallback((utterText: string, utterRate: TTSRate) => {
    const utterance = new SpeechSynthesisUtterance(utterText);
    utterance.rate = utterRate;
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      if (event.name === 'word') {
        const charIndex = event.charIndex;
        const textUpToChar = utterText.slice(0, charIndex);
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

    return utterance;
  }, [selectedVoice]);

  const speak = useCallback(() => {
    if (!isSupported) {
      console.warn('Speech synthesis is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = createUtterance(text, rate);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported, text, rate, createUtterance]);

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
      if (isReading) {
        window.speechSynthesis.cancel();
        setTimeout(() => {
          const utterance = createUtterance(text, newRate);
          utteranceRef.current = utterance;
          window.speechSynthesis.speak(utterance);
        }, 50);
      }
    },
    [isReading, text, createUtterance]
  );

  const setVoice = useCallback(
    (voice: SpeechSynthesisVoice) => {
      setSelectedVoice(voice);
      if (isReading) {
        window.speechSynthesis.cancel();
        setTimeout(() => {
          const utterance = createUtterance(text, rate);
          utterance.voice = voice;
          utteranceRef.current = utterance;
          window.speechSynthesis.speak(utterance);
        }, 50);
      }
    },
    [isReading, text, rate, createUtterance]
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
    voices,
    selectedVoice,
    setVoice,
    isSupported,
  };
}
