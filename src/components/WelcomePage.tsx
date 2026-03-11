'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/contexts/QuizContext';
import { useAuth } from '@/contexts/AuthContext';
import { questions } from '@/data/questions';
import LoginModal from '@/components/LoginModal';
import {
    Brain, Clock, Target, Zap, ChevronRight, History, BookOpen, LogOut,
    User, Trophy, Lock, BarChart2, Star, Cpu
} from 'lucide-react';

interface ExamSet {
    id: string;
    name: string;
    description: string;
    questionCount: number;
    timeMinutes: number;
    level: string;
    levelColor: string;
    icon: React.ReactNode;
    questionFilter?: (q: typeof questions[0]) => boolean;
}

const examSets: ExamSet[] = [
    {
        id: 'standard',
        name: 'Đề Chuẩn',
        description: 'Kiểm tra toàn diện 40 câu bao gồm không gian, logic, toán học và thuật toán.',
        questionCount: 40,
        timeMinutes: 30,
        level: 'Tất cả cấp độ',
        levelColor: 'from-blue-500 to-indigo-600',
        icon: <Brain className="w-6 h-6" />,
    },
    {
        id: 'quick',
        name: 'Đề Nhanh',
        description: '15 câu ngẫu nhiên, phù hợp để luyện tập hàng ngày trong thời gian ngắn.',
        questionCount: 15,
        timeMinutes: 12,
        level: 'Cơ bản → Trung bình',
        levelColor: 'from-emerald-500 to-teal-600',
        icon: <Zap className="w-6 h-6" />,
        questionFilter: (q) => q.difficultyTier <= 2,
    },
    {
        id: 'spatial',
        name: 'Tư Duy Hình Học',
        description: 'Chuyên sâu các câu ma trận không gian, XOR hình học và đa giác lồng nhau.',
        questionCount: 12,
        timeMinutes: 15,
        level: 'Không gian & Tư duy',
        levelColor: 'from-purple-500 to-violet-600',
        icon: <Star className="w-6 h-6" />,
        questionFilter: (q) => q.domain === 'spatial',
    },
    {
        id: 'algorithm',
        name: 'Thuật Toán & Logic',
        description: 'Tracing vòng lặp, đệ quy, Stack, cấu trúc dữ liệu và suy luận logic hệ thống.',
        questionCount: 14,
        timeMinutes: 18,
        level: 'Senior / Tech Lead',
        levelColor: 'from-orange-500 to-red-500',
        icon: <Cpu className="w-6 h-6" />,
        questionFilter: (q) => q.domain === 'algorithmic' || q.domain === 'logic',
    },
    {
        id: 'math',
        name: 'Toán Học & Số Học',
        description: 'Dãy số, ma trận số học, modulo, xác suất và các biến thể tính toán phức hợp.',
        questionCount: 14,
        timeMinutes: 18,
        level: 'Phân tích số liệu',
        levelColor: 'from-cyan-500 to-blue-500',
        icon: <BarChart2 className="w-6 h-6" />,
        questionFilter: (q) => q.domain === 'arithmetic',
    },
    {
        id: 'genius',
        name: 'Thiên Tài',
        description: 'Chỉ 10 câu cấp độ Senior & Genius. Phân tích phức hợp, không gian đa chiều.',
        questionCount: 10,
        timeMinutes: 20,
        level: 'Cực khó – Top 1%',
        levelColor: 'from-rose-500 to-pink-600',
        icon: <Trophy className="w-6 h-6" />,
        questionFilter: (q) => q.difficultyTier >= 3,
    },
];

type NavTab = 'home' | 'exams' | 'history';

export default function WelcomePage() {
    const router = useRouter();
    const { startQuiz } = useQuiz();
    const { user, isLoggedIn, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<NavTab>('home');
    const [loginModal, setLoginModal] = useState<'login' | 'register' | null>(null);

    const handleStart = (examSet: ExamSet) => {
        if (!isLoggedIn) {
            setLoginModal('login');
            return;
        }
        const pool = examSet.questionFilter
            ? questions.filter(examSet.questionFilter)
            : questions;
        startQuiz(examSet.id, examSet.name, pool);
        router.push('/quiz');
    };

    const navItems = [
        { id: 'home' as NavTab, label: 'Bài Thi', icon: <Brain className="w-4 h-4" /> },
        { id: 'exams' as NavTab, label: 'Các Đề Thi', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'history' as NavTab, label: 'Lịch Sử Thi', icon: <History className="w-4 h-4" />, requiresAuth: true },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
            {/* Decorative */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
            </div>

            {/* NAVBAR */}
            <nav className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-white text-sm hidden sm:block">Logic IQ</span>
                    </div>

                    {/* Nav Tabs */}
                    <div className="flex items-center gap-1">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    if (item.requiresAuth && !isLoggedIn) { setLoginModal('login'); return; }
                                    if (item.id === 'history') { router.push('/history'); return; }
                                    setActiveTab(item.id);
                                }}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === item.id
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {item.icon}
                                <span className="hidden sm:block">{item.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Auth */}
                    <div className="flex items-center gap-2">
                        {isLoggedIn ? (
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                                    <User className="w-4 h-4 text-blue-400" />
                                    <span className="text-sm font-semibold text-white hidden sm:block">{user?.username}</span>
                                </div>
                                <button onClick={logout} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:block">Đăng xuất</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={() => setLoginModal('login')} className="text-xs font-semibold px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all">
                                    Đăng nhập
                                </button>
                                <button onClick={() => setLoginModal('register')} className="text-xs font-semibold px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all">
                                    Đăng ký
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 py-10 relative">
                {/* HERO */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-5">
                        <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Psychometrics Assessment</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
                        Kiểm Tra<br />
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Năng Lực Tư Duy</span>
                    </h1>
                    <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                        Đánh giá IQ bằng bài kiểm tra Psychometrics chuẩn quốc tế — không gian, logic, thuật toán và số học.
                    </p>

                    {/* Stats Row */}
                    <div className="flex justify-center gap-6 mt-8">
                        {[
                            { icon: <Target className="w-4 h-4" />, val: '40', label: 'Câu hỏi' },
                            { icon: <Clock className="w-4 h-4" />, val: '30', label: 'Phút' },
                            { icon: <BookOpen className="w-4 h-4" />, val: '6', label: 'Đề thi' },
                        ].map((s, i) => (
                            <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                                <span className="text-blue-400">{s.icon}</span>
                                <span className="text-white font-bold">{s.val}</span>
                                <span className="text-slate-400 text-sm">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* QUICK START - Featured */}
                <div className="mb-6">
                    <button
                        onClick={() => handleStart(examSets[0])}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-5 px-8 rounded-2xl shadow-xl shadow-blue-900/50 hover:shadow-blue-900/70 transition-all active:scale-[0.99] flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                                <Brain className="w-7 h-7" />
                            </div>
                            <div className="text-left">
                                <div className="text-lg font-black">Bắt đầu Đề Chuẩn</div>
                                <div className="text-blue-200 text-sm font-medium">40 câu · 30 phút · Tất cả cấp độ</div>
                            </div>
                        </div>
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* EXAM CARDS GRID */}
                <div>
                    <h2 className="text-white font-bold text-lg mb-4">Các Đề Thi Chuyên Biệt</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {examSets.slice(1).map((exam) => (
                            <div
                                key={exam.id}
                                className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-5 transition-all cursor-pointer"
                                onClick={() => handleStart(exam)}
                            >
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${exam.levelColor} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                                    {exam.icon}
                                </div>
                                <h3 className="text-white font-bold mb-1">{exam.name}</h3>
                                <p className="text-slate-400 text-xs mb-3 leading-relaxed">{exam.description}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <span className="text-xs bg-white/10 text-slate-300 px-2 py-0.5 rounded-lg font-medium">{exam.questionCount} câu</span>
                                        <span className="text-xs bg-white/10 text-slate-300 px-2 py-0.5 rounded-lg font-medium">{exam.timeMinutes} phút</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* History teaser (not logged in) */}
                {!isLoggedIn && (
                    <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Lock className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-bold mb-0.5">Theo dõi lịch sử thi</h3>
                            <p className="text-slate-400 text-sm">Đăng nhập để lưu kết quả, xem biểu đồ tiến bộ và so sánh các đợt thi.</p>
                        </div>
                        <button onClick={() => setLoginModal('register')} className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all">
                            Đăng ký miễn phí
                        </button>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="text-center py-6 text-slate-600 text-xs">
                © 2026 Logic IQ Assessment System • IRT Engine v2
            </footer>

            {/* Login Modal */}
            {loginModal && (
                <LoginModal defaultTab={loginModal} onClose={() => setLoginModal(null)} />
            )}
        </div>
    );
}