import { useState, useRef, useCallback } from 'react';

export const useAudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);
    const [duration, setDuration] = useState(0);
    const [isInitializing, setIsInitializing] = useState(false);
    
    const recognitionRef = useRef(null);
    const timerRef = useRef(null);
    const finalTranscriptRef = useRef('');
    const shouldContinueRef = useRef(false);

    const startRecording = useCallback(() => {
        if (isRecording || isInitializing) {
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError('Speech recognition not supported. Please use Chrome or Edge.');
            return;
        }

        setIsInitializing(true);
        setTranscript('');
        setDuration(0);
        setError(null);
        finalTranscriptRef.current = '';
        shouldContinueRef.current = true;

        const recognition = new SpeechRecognition();
        recognition.continuous = true; // Keep listening continuously
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            console.log('✅ Recording started');
            setIsRecording(true);
            setIsInitializing(false);
            
            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcriptPiece = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcriptPiece + ' ';
                } else {
                    interimTranscript += transcriptPiece;
                }
            }
            
            if (finalTranscript) {
                finalTranscriptRef.current += finalTranscript;
            }
            
            setTranscript(finalTranscriptRef.current + interimTranscript);
        };

        recognition.onerror = (event) => {
            console.error('❌ Speech error:', event.error);
            
            if (event.error === 'aborted') {
                return; // Ignore aborted errors
            }
            
            if (event.error === 'no-speech') {
                return; // Ignore no-speech, keep recording
            }
            
            setError(`Microphone error: ${event.error}`);
            shouldContinueRef.current = false;
            cleanup();
        };

        recognition.onend = () => {
            console.log('🛑 Recognition ended, shouldContinue:', shouldContinueRef.current);
            
            // Auto-restart if user hasn't manually stopped
            if (shouldContinueRef.current && recognitionRef.current) {
                console.log('🔄 Auto-restarting to continue recording...');
                setTimeout(() => {
                    try {
                        recognitionRef.current.start();
                    } catch (err) {
                        console.error('Failed to restart:', err);
                        // Try one more time after a longer delay
                        setTimeout(() => {
                            try {
                                if (shouldContinueRef.current) {
                                    recognitionRef.current.start();
                                }
                            } catch (e) {
                                console.error('Second restart failed:', e);
                                cleanup();
                            }
                        }, 500);
                    }
                }, 100);
            } else {
                cleanup();
            }
        };

        try {
            recognition.start();
            recognitionRef.current = recognition;
        } catch (err) {
            console.error('Failed to start recording:', err);
            setError('Failed to start recording');
            setIsInitializing(false);
            shouldContinueRef.current = false;
        }

        function cleanup() {
            setIsRecording(false);
            setIsInitializing(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    }, [isRecording, isInitializing]);

    const stopRecording = useCallback(() => {
        console.log('⏹️ User stopped recording');
        
        // Signal to stop auto-restart
        shouldContinueRef.current = false;
        
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (err) {
                console.error('Error stopping:', err);
            }
            recognitionRef.current = null;
        }
        
        setIsRecording(false);
        setIsInitializing(false);
        
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        
        setTranscript(finalTranscriptRef.current.trim());
    }, []);

    const resetRecording = useCallback(() => {
        setTranscript('');
        setDuration(0);
        setError(null);
        setIsInitializing(false);
        finalTranscriptRef.current = '';
        shouldContinueRef.current = false;
    }, []);

    return {
        isRecording,
        transcript,
        duration,
        error,
        isInitializing,
        startRecording,
        stopRecording,
        resetRecording
    };
};