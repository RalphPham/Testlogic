'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/contexts/QuizContext';
import { useAuth } from '@/contexts/AuthContext';
import { OptionGrid } from '@/components/OptionGrid';
import { RavenMatrixQuestion } from '@/components/RavenMatrix';
import { XorShapesQuestion } from '@/components/XorShapes';
import { NestedPolygonsQuestion } from '@/components/NestedPolygons';
import { NumberSequenceQuestion, MatrixEquationQuestion } from '@/components/MathQuestions';
import { ChevronLeft, SkipForward, AlertTriangle } from 'lucide-react';
import { CognitiveDomain } from '@/data/questions';

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function QuizPage() {
    const router = useRouter();
    const { isLoggedIn } = useAuth();
    const {
        state,
        currentQuestion,
        totalQuestions,
        selectAnswer,
        goToPrevious,
        skipQuestion,
        getAnswerForQuestion,
        finishQuiz,
    } = useQuiz();

    useEffect(() => {
        if (!isLoggedIn || !state.isStarted) {
            router.push('/');
        }
    }, [isLoggedIn, state.isStarted, router]);

    useEffect(() => {
        if (state.isFinished) {
            router.push('/result');
        }
    }, [state.isFinished, router]);

    if (!state.isStarted || state.isFinished || !currentQuestion) return null;

    const progress = ((state.currentQuestionIndex + 1) / totalQuestions) * 100;
    const isTimeLow = state.timeRemaining < 180; // Dưới 3 phút
    const selectedAnswer = getAnswerForQuestion(currentQuestion.id);
    const visualType = (currentQuestion.visualData as Record<string, unknown>)?.type as string | undefined;
    const isGeometry = currentQuestion.type === 'geometry';

    // Map Domain sang Tiếng Việt với màu sắc tương ứng
    const getDomainLabel = (domain: CognitiveDomain) => {
        switch (domain) {
            case 'spatial': return { label: 'Không gian', color: 'bg-indigo-100 text-indigo-700' };
            case 'algorithmic': return { label: 'Thuật toán', color: 'bg-emerald-100 text-emerald-700' };
            case 'arithmetic': return { label: 'Số học', color: 'bg-cyan-100 text-cyan-700' };
            case 'logic': return { label: 'Logic', color: 'bg-purple-100 text-purple-700' };
            default: return { label: 'Tư duy', color: 'bg-slate-100 text-slate-700' };
        }
    };

    // Map Difficulty Tier sang UI
    const getTierLabel = (tier: number) => {
        switch (tier) {
            case 1: return { label: 'Khởi động', color: 'bg-green-100 text-green-700' };
            case 2: return { label: 'Tiêu chuẩn', color: 'bg-blue-100 text-blue-700' };
            case 3: return { label: 'Senior', color: 'bg-amber-100 text-amber-700' };
            case 4: return { label: 'Thiên tài', color: 'bg-red-100 text-red-700 font-bold border border-red-200 shadow-sm' };
            default: return { label: 'Normal', color: 'bg-slate-100 text-slate-700' };
        }
    };

    const domainConfig = getDomainLabel(currentQuestion.domain);
    const tierConfig = getTierLabel(currentQuestion.difficultyTier);

    const renderQuestionVisual = () => {
        if (!currentQuestion.visualData) return null;
        const vd = currentQuestion.visualData;

        switch (visualType) {
            case 'raven_matrix': return <RavenMatrixQuestion visualData={vd} />;
            case 'xor_shapes': return <XorShapesQuestion visualData={vd} />;
            case 'nested_polygons': return <NestedPolygonsQuestion visualData={vd} />;
            case 'number_sequence': return <NumberSequenceQuestion visualData={vd} />;
            case 'matrix_equation': return <MatrixEquationQuestion visualData={vd} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 flex flex-col">
            {/* --- HEADER --- */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                        {/* Status Badges */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            <span className="text-sm font-bold text-slate-700">
                                Câu {state.currentQuestionIndex + 1} / {totalQuestions}
                            </span>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${domainConfig.color}`}>
                                {domainConfig.label}
                            </span>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${tierConfig.color}`}>
                                {tierConfig.label}
                            </span>
                        </div>

                        {/* Timer */}
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-sm font-bold transition-colors ${isTimeLow
                            ? 'bg-red-50 text-red-600 animate-pulse border border-red-200 shadow-sm'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                            {isTimeLow && <AlertTriangle className="w-3.5 h-3.5" />}
                            {formatTime(state.timeRemaining)}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 flex flex-col">

                {/* 1. Tiêu đề câu hỏi */}
                <div className="mb-6 max-w-2xl mx-auto text-center">
                    <div className="text-xs font-mono text-slate-400 mb-2 uppercase tracking-widest">
                        #{currentQuestion.id.toUpperCase()}
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug">
                        {currentQuestion.prompt}
                    </h2>
                </div>

                {/* 2. KHUNG HIỂN THỊ HÌNH ẢNH / CÂU HỎI (ĐÃ ĐƯỢC FIX CỨNG) */}
                <div className="mb-8 w-full flex justify-center items-center">
                    {isGeometry ? (
                        <div className="w-full max-w-[280px] sm:max-w-[340px] mx-auto flex items-center justify-center">
                            {renderQuestionVisual()}
                        </div>
                    ) : (
                        /* NẾU LÀ TOÁN HỌC/LOGIC: Để width giãn tự nhiên theo chiều ngang (max-w-2xl) */
                        <div className="w-full max-w-2xl flex justify-center items-center">
                            {renderQuestionVisual()}
                        </div>
                    )}
                </div>

                {/* Divider ngăn cách Đề bài và Đáp án */}
                <div className="flex items-center gap-4 mb-8 max-w-3xl mx-auto w-full">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2">Chọn đáp án</span>
                    <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* 3. Lưới Đáp án */}
                <div className="mb-12 w-full flex justify-center">
                    <div className="w-full max-w-3xl">
                        <OptionGrid
                            options={currentQuestion.options}
                            questionType={currentQuestion.type}
                            visualType={visualType}
                            selectedOptionId={selectedAnswer}
                            onSelect={selectAnswer}
                        />
                    </div>
                </div>

                {/* 4. Thanh Điều hướng (Quay lại / Bỏ qua / Nộp bài) */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200 max-w-3xl mx-auto w-full pb-8">
                    <button
                        onClick={goToPrevious}
                        disabled={state.currentQuestionIndex === 0}
                        className={`flex items-center gap-1.5 px-5 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${state.currentQuestionIndex === 0
                            ? 'text-slate-300 cursor-not-allowed bg-slate-50'
                            : 'text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Quay lại
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={skipQuestion}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-slate-600 bg-white border-2 border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
                        >
                            Bỏ qua
                            <SkipForward className="w-4 h-4" />
                        </button>

                        {state.currentQuestionIndex === totalQuestions - 1 && (
                            <button
                                onClick={finishQuiz}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200/50 hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95"
                            >
                                Nộp bài ngay
                            </button>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}