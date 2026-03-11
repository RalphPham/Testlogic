'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/contexts/QuizContext';
import { questions, Question } from '@/data/questions';
import { calculateResults } from '@/utils/scoreCalculator';
import {
    Award, RotateCcw, Download, TrendingUp, Brain, Target, Zap, Activity,
    CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, Eye,
} from 'lucide-react';
import {
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    ResponsiveContainer, Tooltip,
} from 'recharts';

// Render nội dung text của câu hỏi (sequence hoặc matrix) trong review
function renderQuestionContent(q: Question) {
    const vd = q.visualData as Record<string, unknown> | undefined;
    if (!vd) return null;
    const type = vd.type as string;

    // Dãy số hoặc text/logic
    if (type === 'number_sequence') {
        const seq = vd.sequence as (number | string)[];
        const isText = seq.some(s => typeof s === 'string' && String(s).length > 4);
        if (isText) {
            return (
                <div className="bg-slate-800 rounded-xl px-4 py-3 font-mono text-xs text-emerald-400 flex flex-col gap-1 overflow-x-auto">
                    {seq.map((line, i) => (
                        <div key={i} className="whitespace-pre-wrap leading-snug">
                            <span className="text-slate-600 mr-2 select-none">{i + 1}</span>{String(line)}
                        </div>
                    ))}
                </div>
            );
        }
        return (
            <div className="flex items-center gap-2 flex-wrap py-1">
                {seq.map((n, i) => (
                    <span key={i} className={`inline-flex items-center justify-center min-w-[36px] h-9 px-2 rounded-lg border font-bold text-sm ${n === '?' ? 'bg-amber-50 border-amber-300 text-amber-600' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                        {n}
                    </span>
                ))}
            </div>
        );
    }

    // Ma trận phương trình
    if (type === 'matrix_equation') {
        const rows = vd.rows as Array<{ x: number; y: number; z: number | null }>;
        return (
            <div className="flex flex-col gap-1.5 py-1">
                {rows.map((row, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm font-mono">
                        <span className="bg-slate-100 rounded px-2 py-0.5 font-bold text-slate-700 w-10 text-center">{row.x}</span>
                        <span className="text-slate-400 text-xs">×</span>
                        <span className="bg-slate-100 rounded px-2 py-0.5 font-bold text-slate-700 w-10 text-center">{row.y}</span>
                        <span className="text-slate-400">→</span>
                        <span className={`rounded px-2 py-0.5 font-bold w-10 text-center ${row.z === null ? 'bg-amber-100 text-amber-600 border border-amber-300' : 'bg-indigo-50 text-indigo-700'}`}>
                            {row.z === null ? '?' : row.z}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    // Hình học (raven_matrix, xor_shapes, nested_polygons) — chỉ hiển thị mô tả
    const typeLabels: Record<string, string> = {
        raven_matrix: '🧩 Ma trận hình học (xem khi làm bài)',
        xor_shapes: '🔷 Phép toán XOR trên hình (xem khi làm bài)',
        nested_polygons: '⬡ Đa giác lồng nhau (xem khi làm bài)',
    };
    return (
        <div className="text-xs text-slate-400 italic py-1 bg-slate-50 rounded-lg px-3">
            {typeLabels[type] || 'Hình ảnh trực quan'}
        </div>
    );
}

export default function ResultPage() {
    const router = useRouter();
    const { state, resetQuiz } = useQuiz();
    const [showAnswers, setShowAnswers] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const results = useMemo(() => {
        return calculateResults(questions, state.answers);
    }, [state.answers]);

    const orderedQuestions = useMemo(() => {
        if (!state.shuffledQuestions || state.shuffledQuestions.length === 0) return questions;
        return state.shuffledQuestions;
    }, [state.shuffledQuestions]);

    const handleRetry = () => {
        resetQuiz();
        router.push('/');
    };

    const handleSave = () => { window.print(); };

    const getIQColor = (iq: number) => {
        if (iq >= 135) return 'from-purple-600 to-indigo-600';
        if (iq >= 120) return 'from-indigo-500 to-blue-600';
        if (iq >= 105) return 'from-blue-500 to-cyan-500';
        if (iq >= 90) return 'from-emerald-500 to-green-500';
        return 'from-orange-500 to-red-500';
    };

    const getIQEmoji = (iq: number) => {
        if (iq >= 135) return '👑';
        if (iq >= 120) return '🧠';
        if (iq >= 105) return '⭐';
        if (iq >= 90) return '✅';
        return '⚠️';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 border border-slate-200 shadow-sm mb-4">
                        <Award className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-slate-600">Báo cáo năng lực Psychometrics</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Kết Quả Đánh Giá Năng Lực</h1>
                </div>

                {/* Main Score Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mb-6 text-center">
                    <div className="text-5xl mb-3">{getIQEmoji(results.estimatedIQ)}</div>
                    <div className={`text-6xl md:text-8xl font-black bg-gradient-to-r ${getIQColor(results.estimatedIQ)} bg-clip-text text-transparent mb-2`}>
                        {results.estimatedIQ}
                    </div>
                    <div className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">Chỉ số IQ Ước tính</div>
                    <div className={`inline-block text-lg font-bold ${results.categoryColor} px-6 py-2 rounded-full bg-slate-50 border border-slate-100 shadow-sm`}>
                        {results.category}
                    </div>
                </div>

                {/* Score breakdown Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-100 shadow-sm text-center">
                        <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-slate-800">{results.correct}/{results.total}</div>
                        <div className="text-xs font-medium text-slate-500 mt-1">Trả lời đúng</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-100 shadow-sm text-center">
                        <Activity className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-slate-800">{results.theta}</div>
                        <div className="text-xs font-medium text-slate-500 mt-1">Điểm Năng Lực (θ)</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-100 shadow-sm text-center">
                        <Brain className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-slate-800">{results.accuracy.toFixed(0)}%</div>
                        <div className="text-xs font-medium text-slate-500 mt-1">Độ chính xác</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-100 shadow-sm text-center">
                        <Zap className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-slate-800">{results.averageTime.toFixed(1)}s</div>
                        <div className="text-xs font-medium text-slate-500 mt-1">Tốc độ TB/câu</div>
                    </div>
                </div>

                {/* Radar Chart */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 mb-6">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <h3 className="text-xl font-bold text-slate-800">Bản đồ Năng lực Cốt lõi</h3>
                    </div>
                    <div className="w-full h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={results.radarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }} />
                                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                    }}
                                    formatter={(value: number | undefined) => [`${value ?? 0} Điểm`, 'Chỉ số']}
                                />
                                <Radar name="Năng lực" dataKey="value" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.3} strokeWidth={3} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ---- ANSWER REVIEW ---- */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 mb-6 overflow-hidden">
                    <button
                        onClick={() => setShowAnswers(!showAnswers)}
                        className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Eye className="w-5 h-5 text-emerald-600" />
                            <span className="text-lg font-bold text-slate-800">Xem Lại Toàn Bộ Câu Hỏi & Đáp Án</span>
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{orderedQuestions.length} câu</span>
                        </div>
                        <span className="text-slate-400 text-sm font-medium">{showAnswers ? '▲ Thu gọn' : '▼ Xem tất cả'}</span>
                    </button>

                    {showAnswers && (
                        <div className="divide-y divide-slate-100">
                            {orderedQuestions.map((q, idx) => {
                                const userAnswer = state.answers.find(a => a.questionId === q.id);
                                const isCorrect = userAnswer?.selectedOptionId === q.correctOptionId;
                                const isSkipped = !userAnswer;
                                const isExpanded = expandedId === q.id;

                                const tierLabel = ['', 'Dễ', 'TB', 'Khó', 'Thiên tài'][q.difficultyTier];
                                const tierColor = ['', 'text-green-600', 'text-blue-600', 'text-amber-600', 'text-red-600'][q.difficultyTier];

                                const rowBg = isCorrect ? 'bg-emerald-50/50' : isSkipped ? 'bg-slate-50/40' : 'bg-red-50/50';
                                const statusIcon = isSkipped
                                    ? <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0"><span className="text-xs font-bold text-slate-500">–</span></div>
                                    : isCorrect
                                        ? <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                                        : <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />;

                                return (
                                    <div key={q.id} className={rowBg}>
                                        {/* Summary row — click to expand */}
                                        <button
                                            onClick={() => setExpandedId(isExpanded ? null : q.id)}
                                            className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-black/[0.02] transition-colors text-left"
                                        >
                                            {statusIcon}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs font-mono text-slate-400">#{q.id.toUpperCase()}</span>
                                                    <span className="text-xs font-medium text-slate-500">Câu {idx + 1}</span>
                                                    <span className={`text-xs font-bold ${tierColor}`}>{tierLabel}</span>
                                                    {userAnswer && (
                                                        <span className="text-xs text-slate-400 flex items-center gap-0.5 ml-auto">
                                                            <Clock className="w-3 h-3" />{userAnswer.timeSpent.toFixed(1)}s
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm font-semibold text-slate-700 leading-snug mt-0.5 truncate pr-4">{q.prompt}</p>
                                            </div>
                                            {isExpanded
                                                ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                                        </button>

                                        {/* Expanded detail */}
                                        {isExpanded && (
                                            <div className="px-5 pb-5 pt-1 border-t border-slate-100/80">
                                                {/* Nội dung câu hỏi */}
                                                <div className="mb-4">
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nội dung</p>
                                                    {renderQuestionContent(q)}
                                                </div>

                                                {/* Các lựa chọn */}
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Các đáp án</p>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                        {q.options.map(opt => {
                                                            const isUserPick = userAnswer?.selectedOptionId === opt.id;
                                                            const isRight = opt.id === q.correctOptionId;

                                                            let cls = 'bg-white border-slate-200 text-slate-600';
                                                            let badge = null;
                                                            if (isRight && isUserPick) {
                                                                cls = 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold ring-2 ring-emerald-300';
                                                                badge = <span className="text-[10px] bg-emerald-500 text-white rounded px-1 ml-1">✓ Đúng</span>;
                                                            } else if (isRight) {
                                                                cls = 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold';
                                                                badge = <span className="text-[10px] bg-emerald-500 text-white rounded px-1 ml-1">✓</span>;
                                                            } else if (isUserPick) {
                                                                cls = 'bg-red-50 border-red-400 text-red-700 font-semibold ring-2 ring-red-200';
                                                                badge = <span className="text-[10px] bg-red-500 text-white rounded px-1 ml-1">✗ Bạn chọn</span>;
                                                            }

                                                            return (
                                                                <div key={opt.id} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${cls}`}>
                                                                    <span className="font-bold text-xs w-5 h-5 flex items-center justify-center rounded-full bg-white/60 border border-current/20 flex-shrink-0">{opt.id}</span>
                                                                    <span className="flex-1 truncate">{opt.label || `Đáp án ${opt.id}`}</span>
                                                                    {badge}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Giải thích đáp án */}
                                                {q.explanation && (
                                                    <div className="mt-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                                                        <span className="text-lg flex-shrink-0 mt-0.5">💡</span>
                                                        <div>
                                                            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Giải thích</p>
                                                            <p className="text-sm text-amber-900 leading-relaxed">{q.explanation}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleRetry}
                        className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-700 font-bold py-4 px-6 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Thi lại từ đầu
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-blue-200/50 hover:shadow-xl transition-all active:scale-95"
                    >
                        <Download className="w-5 h-5" />
                        Lưu báo cáo (PDF)
                    </button>
                </div>
            </div>
        </div>
    );
}