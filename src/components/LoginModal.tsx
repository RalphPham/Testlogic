'use client';

import React, { useState } from 'react';
import { X, Eye, EyeOff, User, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginModalProps {
    onClose: () => void;
    defaultTab?: 'login' | 'register';
}

export default function LoginModal({ onClose, defaultTab = 'login' }: LoginModalProps) {
    const { login, register } = useAuth();
    const [tab, setTab] = useState<'login' | 'register'>(defaultTab);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Login form
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register form
    const [regUsername, setRegUsername] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirm, setRegConfirm] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!loginEmail || !loginPassword) { setError('Vui lòng nhập đầy đủ thông tin.'); return; }
        setLoading(true);
        const result = login(loginEmail, loginPassword);
        setLoading(false);
        if (result.success) { onClose(); }
        else { setError(result.error || 'Đăng nhập thất bại.'); }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!regUsername || !regEmail || !regPassword || !regConfirm) {
            setError('Vui lòng nhập đầy đủ thông tin.'); return;
        }
        if (regPassword !== regConfirm) { setError('Mật khẩu xác nhận không khớp.'); return; }
        if (regPassword.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự.'); return; }
        setLoading(true);
        const result = register(regUsername, regEmail, regPassword);
        setLoading(false);
        if (result.success) { onClose(); }
        else { setError(result.error || 'Đăng ký thất bại.'); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 pt-8 pb-6">
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex gap-1 bg-white/10 rounded-2xl p-1">
                        <button
                            onClick={() => { setTab('login'); setError(''); }}
                            className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all ${tab === 'login' ? 'bg-white text-blue-700 shadow-md' : 'text-white/80 hover:text-white'}`}
                        >
                            <LogIn className="w-4 h-4 inline mr-2" />Đăng nhập
                        </button>
                        <button
                            onClick={() => { setTab('register'); setError(''); }}
                            className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all ${tab === 'register' ? 'bg-white text-blue-700 shadow-md' : 'text-white/80 hover:text-white'}`}
                        >
                            <UserPlus className="w-4 h-4 inline mr-2" />Đăng ký
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="px-8 py-6">
                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
                            ⚠️ {error}
                        </div>
                    )}

                    {tab === 'login' ? (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                                        placeholder="ten@email.com"
                                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Mật khẩu</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'} value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-10 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit" disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-60 mt-2"
                            >
                                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Tên đăng nhập</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text" value={regUsername} onChange={e => setRegUsername(e.target.value)}
                                        placeholder="Tên của bạn"
                                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                                        placeholder="ten@email.com"
                                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Mật khẩu</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'} value={regPassword} onChange={e => setRegPassword(e.target.value)}
                                        placeholder="Tối thiểu 6 ký tự"
                                        className="w-full pl-10 pr-10 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Xác nhận mật khẩu</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'} value={regConfirm} onChange={e => setRegConfirm(e.target.value)}
                                        placeholder="Nhập lại mật khẩu"
                                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit" disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-60 mt-2"
                            >
                                {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
