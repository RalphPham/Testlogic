'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/contexts/QuizContext';
import { OptionGrid } from '@/components/OptionGrid';
import { NumberSequenceQuestion, MatrixEquationQuestion } from '@/components/MathQuestions';
import { ChevronLeft, SkipForward, AlertTriangle } from 'lucide-react';

// ==========================================
// 1. INLINE SVG COMPONENTS (FIXED SIZING)
// Đưa thẳng code vẽ hình vào đây để bỏ qua lỗi cache file
// ==========================================

function RavenCell({ dotAngle, lineAngle, isEmpty = false }: { dotAngle: number; lineAngle: number; isEmpty?: boolean }) {
    const cx = 50, cy = 50, radius = 38, dotRadius = 6, lineLength = radius * 0.85;
    const dotRad = (dotAngle - 90) * (Math.PI / 180);
    const dotX = cx + radius * 0.72 * Math.cos(dotRad);
    const dotY = cy + radius * 0.72 * Math.sin(dotRad);
    const lineRad = (lineAngle - 90) * (Math.PI / 180);
    const lineX1 = cx - lineLength * Math.cos(lineRad), lineY1 = cy - lineLength * Math.sin(lineRad);
    const lineX2 = cx + lineLength * Math.cos(lineRad), lineY2 = cy + lineLength * Math.sin(lineRad);

    if (isEmpty) return (
        <svg viewBox="0 0 100 100" className="w-full h-full object-contain">
            <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="6 6" />
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="#94a3b8" fontSize="28" fontWeight="bold">?</text>
        </svg>
    );
    return (
        <svg viewBox="0 0 100 100" className="w-full h-full object-contain">
            <circle cx={cx} cy={cy} r={radius} fill="#f8fafc" stroke="#1e293b" strokeWidth="2.5" />
            <line x1={lineX1} y1={lineY1} x2={lineX2} y2={lineY2} stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={dotX} cy={dotY} r={dotRadius} fill="#1e293b" />
        </svg>
    );
}

function InlineRavenMatrix({ visualData }: { visualData: any }) {
    const grid = visualData.grid;
    return (
        <div className="flex justify-center items-center w-full">
            <div className="grid grid-cols-3 gap-1 w-full max-w-[300px] sm:max-w-[340px] aspect-square bg-slate-100/80 p-1.5 sm:p-2 rounded-2xl border border-slate-200">
                {grid.flat().map((cell: any, i: number) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 aspect-square flex items-center justify-center p-1">
                        {cell ? <RavenCell dotAngle={cell.dotAngle} lineAngle={cell.lineAngle} /> : <RavenCell dotAngle={0} lineAngle={0} isEmpty />}
                    </div>
                ))}
            </div>
        </div>
    );
}

function XorCell({ fills, isEmpty = false }: { fills: any; isEmpty?: boolean }) {
    if (isEmpty) return (
        <svg viewBox="0 0 100 100" className="w-full h-full object-contain">
            <rect x="5" y="5" width="90" height="90" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="6 6" rx="8" />
            <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fill="#94a3b8" fontSize="32" fontWeight="bold">?</text>
        </svg>
    );
    const tr = [
        { points: "50,50 5,5 95,5", f: fills.top }, { points: "50,50 95,5 95,95", f: fills.right },
        { points: "50,50 95,95 5,95", f: fills.bottom }, { points: "50,50 5,95 5,5", f: fills.left }
    ];
    return (
        <svg viewBox="0 0 100 100" className="w-full h-full object-contain">
            <rect x="5" y="5" width="90" height="90" fill="#f8fafc" stroke="#1e293b" strokeWidth="2.5" rx="4" />
            {tr.map((t, i) => <polygon key={i} points={t.points} fill={t.f ? '#1e293b' : 'transparent'} stroke="#1e293b" strokeWidth="1.5" />)}
        </svg>
    );
}

function InlineXorShapes({ visualData }: { visualData: any }) {
    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-2.5 sm:p-3 shadow-sm w-full max-w-[320px] sm:max-w-[360px] flex flex-col gap-1.5">
                {visualData.rows.map((row: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-white p-1 sm:p-1.5 rounded-lg border border-slate-100 shadow-sm">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0"><XorCell fills={row.col1} /></div>
                        <div className="text-slate-300 font-bold text-xs sm:text-sm">⊕</div>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0"><XorCell fills={row.col2} /></div>
                        <div className="text-slate-300 font-bold text-xs sm:text-sm">=</div>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0">{row.col3 ? <XorCell fills={row.col3} /> : <XorCell fills={{}} isEmpty />}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function PolygonCell({ outer, inner, dots, isEmpty = false }: { outer: number; inner: number; dots: number; isEmpty?: boolean; }) {
    const cx = 50, cy = 50, oR = 42, iR = 22, dR = 4;
    if (isEmpty) return (
        <svg viewBox="0 0 100 100" className="w-full h-full object-contain">
            <circle cx={cx} cy={cy} r={oR} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="6 6" />
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="#94a3b8" fontSize="32" fontWeight="bold">?</text>
        </svg>
    );
    const getPts = (r: number, s: number) => {
        let pts = [];
        for (let i = 0; i < s; i++) pts.push(`${cx + r * Math.cos((2 * Math.PI * i) / s - Math.PI / 2)},${cy + r * Math.sin((2 * Math.PI * i) / s - Math.PI / 2)}`);
        return pts.join(' ');
    };
    const dPts = []; const absD = Math.abs(dots);
    if (absD === 1) dPts.push({ x: cx, y: cy });
    else if (absD > 1) {
        for (let i = 0; i < absD; i++) dPts.push({ x: cx + 8 * Math.cos((2 * Math.PI * i) / absD - Math.PI / 2), y: cy + 8 * Math.sin((2 * Math.PI * i) / absD - Math.PI / 2) });
    }
    return (
        <svg viewBox="0 0 100 100" className="w-full h-full object-contain">
            {outer === 2 ? <line x1={cx - oR} y1={cy} x2={cx + oR} y2={cy} stroke="#1e293b" strokeWidth="2.5" /> : <polygon points={getPts(oR, outer)} fill="#f1f5f9" stroke="#1e293b" strokeWidth="2.5" />}
            {inner === 2 ? <line x1={cx - iR} y1={cy} x2={cx + iR} y2={cy} stroke="#1e293b" strokeWidth="2.5" /> : inner === 1 ? <circle cx={cx} cy={cy} r={dR * 1.5} fill="#1e293b" /> : <polygon points={getPts(iR, inner)} fill="#e2e8f0" stroke="#1e293b" strokeWidth="2" />}
            {dPts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={dR} fill="#ef4444" />)}
        </svg>
    );
}

function InlineNestedPolygons({ visualData }: { visualData: any }) {
    return (
        <div className="flex justify-center items-center w-full">
            <div className="grid grid-cols-3 gap-1 w-full max-w-[300px] sm:max-w-[340px] aspect-square bg-slate-100 p-1.5 sm:p-2 rounded-2xl border border-slate-200">
                {visualData.gridCorrected.flat().map((cell: any, i: number) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 aspect-square flex items-center justify-center p-1 sm:p-2">
                        {cell ? <PolygonCell outer={cell.outer} inner={cell.inner} dots={cell.dots} /> : <PolygonCell outer={3} inner={3} dots={0} isEmpty />}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ==========================================
// 2. MAIN PAGE COMPONENT
// ==========================================

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function QuizPageRoute() {
    const router = useRouter();
    const { state, currentQuestion, totalQuestions, selectAnswer, goToPrevious, goToQuestion, skipQuestion, getAnswerForQuestion, finishQuiz } = useQuiz();
    const [showNav, setShowNav] = useState(false);

    useEffect(() => { if (!state.isStarted) router.push('/'); }, [state.isStarted, router]);
    useEffect(() => { if (state.isFinished) router.push('/result'); }, [state.isFinished, router]);

    if (!state.isStarted || state.isFinished || !currentQuestion) return null;

    const progress = ((state.currentQuestionIndex + 1) / totalQuestions) * 100;
    const isTimeLow = state.timeRemaining < 180;
    const selectedAnswer = getAnswerForQuestion(currentQuestion.id);
    const visualType = (currentQuestion.visualData as any)?.type;

    const renderVisual = () => {
        if (!currentQuestion.visualData) return null;
        switch (visualType) {
            case 'raven_matrix': return <InlineRavenMatrix visualData={currentQuestion.visualData} />;
            case 'xor_shapes': return <InlineXorShapes visualData={currentQuestion.visualData} />;
            case 'nested_polygons': return <InlineNestedPolygons visualData={currentQuestion.visualData} />;
            case 'number_sequence': return <NumberSequenceQuestion visualData={currentQuestion.visualData} />;
            case 'matrix_equation': return <MatrixEquationQuestion visualData={currentQuestion.visualData} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 flex flex-col">
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            <span className="text-sm font-bold text-slate-700">Câu {state.currentQuestionIndex + 1} / {totalQuestions}</span>
                            {(() => {
                                const tier = (currentQuestion as any).difficultyTier as 1 | 2 | 3 | 4;
                                const tierConfig = {
                                    1: { label: 'Khởi động', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                                    2: { label: 'Tiêu chuẩn', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
                                    3: { label: 'Nâng cao', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
                                    4: { label: 'Thiên tài', cls: 'bg-red-50 text-red-700 border-red-200' },
                                };
                                const config = tierConfig[tier] || tierConfig[1];
                                return (
                                    <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border ${config.cls}`}>
                                        ★{tier} {config.label}
                                    </span>
                                );
                            })()}
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-sm font-bold transition-colors ${isTimeLow ? 'bg-red-50 text-red-600 animate-pulse border border-red-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                            {isTimeLow && <AlertTriangle className="w-3.5 h-3.5" />}
                            {formatTime(state.timeRemaining)}
                        </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 flex flex-col">
                <div className="mb-6 max-w-2xl mx-auto text-center">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug">{currentQuestion.prompt}</h2>
                    {currentQuestion.description && (
                        <p className="text-sm font-medium text-slate-500 mt-3 bg-white/60 inline-block px-4 py-2 rounded-xl">💡 Gợi ý: {currentQuestion.description}</p>
                    )}
                </div>

                <div className="mb-6 w-full flex justify-center items-center overflow-hidden">
                    <div className="w-full max-w-[360px] sm:max-w-[400px] flex justify-center">
                        {renderVisual()}
                    </div>
                </div>

                <div className="flex items-center gap-4 mb-8 max-w-3xl mx-auto w-full">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2">Chọn đáp án</span>
                    <div className="flex-1 h-px bg-slate-200" />
                </div>

                <div className="mb-12 w-full flex justify-center">
                    <div className="w-full max-w-3xl">
                        <OptionGrid options={currentQuestion.options} questionType={currentQuestion.type} visualType={visualType} selectedOptionId={selectedAnswer} onSelect={selectAnswer} />
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200 max-w-3xl mx-auto w-full pb-8">
                    <button onClick={goToPrevious} disabled={state.currentQuestionIndex === 0} className={`flex items-center gap-1.5 px-5 py-3 rounded-xl text-sm font-bold transition-all ${state.currentQuestionIndex === 0 ? 'text-slate-300 cursor-not-allowed bg-slate-50' : 'text-slate-700 bg-white border-2 border-slate-200'}`}>
                        <ChevronLeft className="w-5 h-5" /> Quay lại
                    </button>
                    <div className="flex items-center gap-3">
                        <button onClick={skipQuestion} className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-slate-600 bg-white border-2 border-slate-200">
                            Bỏ qua <SkipForward className="w-4 h-4" />
                        </button>
                        {state.currentQuestionIndex === totalQuestions - 1 && (
                            <button onClick={finishQuiz} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                Nộp bài ngay
                            </button>
                        )}
                    </div>
                </div>
            </main>

            {/* Question Navigator Toggle Button */}
            <button
                onClick={() => setShowNav(!showNav)}
                className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-white/90 backdrop-blur-sm border border-r-0 border-slate-200 rounded-l-xl px-1.5 py-3 shadow-lg hover:bg-blue-50 transition-colors"
                title="Danh sách câu hỏi"
            >
                <div className="flex flex-col items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span className="text-[9px] font-bold text-slate-500 writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>Câu hỏi</span>
                </div>
            </button>

            {/* Question Navigator Panel */}
            {showNav && (
                <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setShowNav(false)}>
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
                    <div
                        className="relative w-[280px] sm:w-[320px] bg-white/95 backdrop-blur-md shadow-2xl border-l border-slate-200 h-full overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-700">📋 Danh sách câu hỏi</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-400 font-medium">
                                    {state.answers.length}/{totalQuestions} đã làm
                                </span>
                                <button onClick={() => setShowNav(false)} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-5 gap-2">
                                {Array.from({ length: totalQuestions }, (_, i) => {
                                    const q = state.shuffledQuestions[i];
                                    const isAnswered = q && state.answers.some(a => a.questionId === q.id);
                                    const isCurrent = i === state.currentQuestionIndex;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => { goToQuestion(i); setShowNav(false); }}
                                            className={`
                                                w-full aspect-square rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center
                                                ${isCurrent
                                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-110 ring-2 ring-blue-300'
                                                    : isAnswered
                                                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200'
                                                        : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                                                }
                                            `}
                                        >
                                            {i + 1}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="mt-4 flex items-center gap-4 text-[10px] text-slate-400 font-medium">
                                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-600 inline-block" /> Đang làm</span>
                                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200 inline-block" /> Đã làm</span>
                                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-100 border border-slate-200 inline-block" /> Chưa làm</span>
                            </div>
                            <button
                                onClick={finishQuiz}
                                className="mt-6 w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all"
                            >
                                🏁 Nộp bài ({state.answers.length}/{totalQuestions})
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}