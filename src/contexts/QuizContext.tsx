'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { questions as originalQuestions, Question } from '@/data/questions';
import { saveExamSession, getCurrentUser } from '@/lib/storage';
import type { ExamSession } from '@/lib/storage';

interface QuizAnswer {
    questionId: string;
    selectedOptionId: string;
    timeSpent: number;
}

interface QuizState {
    currentQuestionIndex: number;
    answers: QuizAnswer[];
    timeRemaining: number;
    isFinished: boolean;
    startTime: number;
    questionStartTime: number;
    isStarted: boolean;
    shuffledQuestions: Question[];
    examSetId: string;
    examSetName: string;
    sessionId: string;
}

interface QuizContextType {
    state: QuizState;
    currentQuestion: Question;
    totalQuestions: number;
    selectAnswer: (optionId: string) => void;
    goToNext: () => void;
    goToPrevious: () => void;
    goToQuestion: (index: number) => void;
    skipQuestion: () => void;
    startQuiz: (examSetId?: string, examSetName?: string, questionSubset?: Question[]) => void;
    finishQuiz: () => void;
    resetQuiz: () => void;
    getAnswerForQuestion: (questionId: string) => string | undefined;
}

const TOTAL_TIME = 30 * 60; // 30 minutes

// Fisher-Yates shuffle
function shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

const initialState: QuizState = {
    currentQuestionIndex: 0,
    answers: [],
    timeRemaining: TOTAL_TIME,
    isFinished: false,
    startTime: 0,
    questionStartTime: 0,
    isStarted: false,
    shuffledQuestions: [],
    examSetId: 'standard',
    examSetName: 'Đề Chuẩn',
    sessionId: '',
};

const QuizContext = createContext<QuizContextType | null>(null);

export function QuizProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<QuizState>(initialState);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Timer countdown
    useEffect(() => {
        if (state.isStarted && !state.isFinished) {
            timerRef.current = setInterval(() => {
                setState((prev) => {
                    const newTime = prev.timeRemaining - 1;
                    if (newTime <= 0) {
                        return { ...prev, timeRemaining: 0, isFinished: true };
                    }
                    return { ...prev, timeRemaining: newTime };
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [state.isStarted, state.isFinished]);

    // Save results to localStorage when finished
    useEffect(() => {
        if (state.isFinished && state.shuffledQuestions.length > 0 && state.answers.length > 0) {
            const user = getCurrentUser();
            const session: ExamSession = {
                id: state.sessionId,
                userId: user?.id || 'guest',
                examSetId: state.examSetId,
                examSetName: state.examSetName,
                date: new Date().toISOString(),
                totalTime: TOTAL_TIME - state.timeRemaining,
                answers: state.answers,
                score: {
                    estimatedIQ: 0,
                    theta: 0,
                    category: '',
                    correct: 0,
                    total: state.shuffledQuestions.length,
                    accuracy: 0,
                    averageTime: 0,
                    domainScores: {},
                    radarData: [],
                },
                questionOrder: state.shuffledQuestions.map(q => q.id),
            };
            saveExamSession(session);
        }
    }, [state.isFinished]);

    const startQuiz = useCallback((examSetId = 'standard', examSetName = 'Đề Chuẩn', questionSubset?: Question[]) => {
        const now = Date.now();
        const pool = questionSubset || originalQuestions;
        const shuffled = shuffleArray(pool);
        setState({
            ...initialState,
            isStarted: true,
            startTime: now,
            questionStartTime: now,
            timeRemaining: TOTAL_TIME,
            shuffledQuestions: shuffled,
            examSetId,
            examSetName,
            sessionId: `session_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        });
    }, []);

    const selectAnswer = useCallback((optionId: string) => {
        setState((prev) => {
            const now = Date.now();
            const timeSpent = (now - prev.questionStartTime) / 1000;
            const questionId = prev.shuffledQuestions[prev.currentQuestionIndex].id;

            const existingIndex = prev.answers.findIndex((a) => a.questionId === questionId);
            const newAnswers = [...prev.answers];

            if (existingIndex >= 0) {
                newAnswers[existingIndex] = { questionId, selectedOptionId: optionId, timeSpent };
            } else {
                newAnswers.push({ questionId, selectedOptionId: optionId, timeSpent });
            }

            return { ...prev, answers: newAnswers };
        });

        // Auto-advance after 300ms
        setTimeout(() => {
            setState((prev) => {
                if (prev.currentQuestionIndex < prev.shuffledQuestions.length - 1) {
                    return {
                        ...prev,
                        currentQuestionIndex: prev.currentQuestionIndex + 1,
                        questionStartTime: Date.now(),
                    };
                } else {
                    return { ...prev, isFinished: true };
                }
            });
        }, 300);
    }, []);

    const goToNext = useCallback(() => {
        setState((prev) => {
            if (prev.currentQuestionIndex < prev.shuffledQuestions.length - 1) {
                return {
                    ...prev,
                    currentQuestionIndex: prev.currentQuestionIndex + 1,
                    questionStartTime: Date.now(),
                };
            }
            return prev;
        });
    }, []);

    const goToPrevious = useCallback(() => {
        setState((prev) => {
            if (prev.currentQuestionIndex > 0) {
                return {
                    ...prev,
                    currentQuestionIndex: prev.currentQuestionIndex - 1,
                    questionStartTime: Date.now(),
                };
            }
            return prev;
        });
    }, []);

    const goToQuestion = useCallback((index: number) => {
        setState((prev) => {
            if (index >= 0 && index < prev.shuffledQuestions.length) {
                return {
                    ...prev,
                    currentQuestionIndex: index,
                    questionStartTime: Date.now(),
                };
            }
            return prev;
        });
    }, []);

    const skipQuestion = useCallback(() => {
        goToNext();
    }, [goToNext]);

    const finishQuiz = useCallback(() => {
        setState((prev) => ({ ...prev, isFinished: true }));
    }, []);

    const resetQuiz = useCallback(() => {
        setState(initialState);
    }, []);

    const getAnswerForQuestion = useCallback(
        (questionId: string) => {
            return state.answers.find((a) => a.questionId === questionId)?.selectedOptionId;
        },
        [state.answers]
    );

    const currentQuestion = state.shuffledQuestions.length > 0
        ? state.shuffledQuestions[state.currentQuestionIndex]
        : originalQuestions[0];

    const value: QuizContextType = {
        state,
        currentQuestion,
        totalQuestions: state.shuffledQuestions.length || originalQuestions.length,
        selectAnswer,
        goToNext,
        goToPrevious,
        goToQuestion,
        skipQuestion,
        startQuiz,
        finishQuiz,
        resetQuiz,
        getAnswerForQuestion,
    };

    return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
    const context = useContext(QuizContext);
    if (!context) {
        throw new Error('useQuiz must be used within a QuizProvider');
    }
    return context;
}
