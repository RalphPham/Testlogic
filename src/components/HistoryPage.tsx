'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSessionsByUser } from '@/lib/storage';
import { calculateResults } from '@/utils/scoreCalculator';
import { questions } from '@/data/questions';
import {
    History, Brain, ChevronLeft, Trophy, TrendingUp, Target, Clock,
    BarChart2, ChevronDown, ChevronUp
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';

export default function HistoryPage() {
    const router = useRouter();
    const { user, isLoggedIn } = useAuth();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const sessions = useMemo(() => {
        if (!user) return [];
        return getSessionsByUser(user.id);
    }, [user]);

    // Recalculate results for each session
    const enrichedSessions = useMemo(() => {
        return sessions.map(s => {
            const sessionQuestions = s.questionOrder
                .map(id => questions.find(q => q.id === id))
                .filter(Boolean) as typeof questions;
            const results = calculateResults(sessionQuestions, s.answers);
            return { ...s, results };
        });
    }, [sessions]);

    // Chart data: IQ over time
    const iqChartData = enrichedSessions.slice().reverse().map((s, i) => ({
        name: `Lần ${i + 1}`,
        IQ: s.results.estimatedIQ,
        date: new Date(s.date).toLocaleDateString('vi-VN'),
    }));

    // Radar comparison: latest vs previous
    const latestRadar = enrichedSessions[0]?.results.radarData || [];
    const prevRadar = enrichedSessions[1]?.results.radarData || [];
    const comparisonData = latestRadar.map((d, i) => ({
        subject: d.subject,
        'Lần này': d.value,
        'Lần trước': prevRadar[i]?.value ?? 0,
    }));

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-white text-2xl font-bold mb-2">Yêu cầu đăng nhập</h2>
                    <p className="text-slate-400 mb-6">Bạn cần đăng nhập để xem lịch sử thi.</p>
                    <button onClick={() => router.push('/')} className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-all">
                        Về trang chủ
                    </button>
                </div>
            </div>
        );
    }

    if (sessions.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col">
                <nav className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-4 py-3">
                    <button onClick={() => router.push('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold">
                        <ChevronLeft className="w-4 h-4" /> Về trang chủ
                    </button>
                </nav>
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                        <History className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h2 className="text-white text-2xl font-bold mb-2">Chưa có lịch sử</h2>
                        <p className="text-slate-400 mb-6">Hãy hoàn thành một bài thi để xem lịch sử của bạn.</p>
                        <button onClick={() => router.push('/')} className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-all">
                            Bắt đầu thi
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
            {/* Nav */}
            <nav className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-4 py-3">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <button onClick={() => router.push('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold">
                        <ChevronLeft className="w-4 h-4" /> Trang chủ
                    </button>
                    <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-blue-400" />
                        <span className="text-white font-bold text-sm">Lịch Sử Thi</span>
                    </div>
                    <span className="text-slate-400 text-sm">{user?.username}</span>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { icon: <History className="w-5 h-5" />, val: enrichedSessions.length, label: 'Lần thi', color: 'text-blue-400' },
                        { icon: <Trophy className="w-5 h-5" />, val: Math.max(...enrichedSessions.map(s => s.results.estimatedIQ)), label: 'IQ Cao nhất', color: 'text-amber-400' },
                        { icon: <Brain className="w-5 h-5" />, val: Math.round(enrichedSessions.reduce((a, s) => a + s.results.estimatedIQ, 0) / enrichedSessions.length), label: 'IQ Trung bình', color: 'text-purple-400' },
                        { icon: <Target className="w-5 h-5" />, val: Math.round(enrichedSessions.reduce((a, s) => a + s.results.accuracy, 0) / enrichedSessions.length) + '%', label: 'Độ chính xác', color: 'text-emerald-400' },
                    ].map((s, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                            <div className={`flex justify-center mb-2 ${s.color}`}>{s.icon}</div>
                            <div className="text-2xl font-black text-white">{s.val}</div>
                            <div className="text-xs text-slate-400 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* IQ Line Chart */}
                {iqChartData.length >= 2 && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                        <div className="flex items-center gap-2 mb-5">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                            <h3 className="text-white font-bold">Biểu đồ IQ theo thời gian</h3>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={iqChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <YAxis domain={['auto', 'auto']} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#f1f5f9' }}
                                        formatter={(value: number | undefined) => [`IQ: ${value}`, 'Điểm']}
                                        labelFormatter={(label, payload) => payload?.[0]?.payload?.date || label}
                                    />
                                    <Line type="monotone" dataKey="IQ" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 5 }} activeDot={{ r: 7 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Radar Comparison (latest 2 sessions) */}
                {enrichedSessions.length >= 2 && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                        <div className="flex items-center gap-2 mb-5">
                            <BarChart2 className="w-5 h-5 text-purple-400" />
                            <h3 className="text-white font-bold">So sánh Lần thi gần nhất</h3>
                            <span className="text-xs text-slate-500 ml-1">({new Date(enrichedSessions[0].date).toLocaleDateString('vi-VN')} vs {new Date(enrichedSessions[1].date).toLocaleDateString('vi-VN')})</span>
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={comparisonData}>
                                    <PolarGrid stroke="#ffffff20" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                    <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                                    <Radar name="Lần này" dataKey="Lần này" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                                    <Radar name="Lần trước" dataKey="Lần trước" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                                    <Legend iconType="circle" wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#f1f5f9', fontSize: 12 }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Session List */}
                <div>
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" /> Tất cả các lần thi
                    </h3>
                    <div className="space-y-3">
                        {enrichedSessions.map((s, idx) => {
                            const isExpanded = expandedId === s.id;
                            const r = s.results;
                            return (
                                <div key={s.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                                    <button
                                        onClick={() => setExpandedId(isExpanded ? null : s.id)}
                                        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors text-left"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                                            {enrichedSessions.length - idx}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-white font-bold text-sm">{s.examSetName}</span>
                                                <span className="text-xs text-slate-400">{new Date(s.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs text-slate-400">{r.correct}/{r.total} đúng</span>
                                                <span className="text-xs text-slate-400">{r.accuracy.toFixed(0)}% chính xác</span>
                                                <span className="text-xs text-slate-400">{Math.floor(s.totalTime / 60)}:{String(s.totalTime % 60).padStart(2, '0')} phút</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <div className="text-right">
                                                <div className="text-2xl font-black text-white">{r.estimatedIQ}</div>
                                                <div className="text-xs text-slate-400">IQ</div>
                                            </div>
                                            {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                        </div>
                                    </button>

                                    {isExpanded && (
                                        <div className="border-t border-white/10 px-5 py-4">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                                {r.radarData.map(d => (
                                                    <div key={d.subject} className="bg-white/5 rounded-xl p-3 text-center">
                                                        <div className="text-lg font-bold text-white">{d.value}%</div>
                                                        <div className="text-xs text-slate-400 mt-0.5 leading-tight">{d.subject}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="text-xs text-slate-500 text-right">{r.category}</div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
