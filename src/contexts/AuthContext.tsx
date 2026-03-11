'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, getCurrentUser, setCurrentUser, registerUser, loginUser } from '@/lib/storage';

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    login: (email: string, password: string) => { success: boolean; error?: string };
    register: (username: string, email: string, password: string) => { success: boolean; error?: string };
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = getCurrentUser();
        if (storedUser) setUser(storedUser);
    }, []);

    const login = useCallback((email: string, password: string) => {
        const result = loginUser(email, password);
        if (result.success && result.user) {
            setCurrentUser(result.user);
            setUser(result.user);
        }
        return { success: result.success, error: result.error };
    }, []);

    const register = useCallback((username: string, email: string, password: string) => {
        const result = registerUser(username, email, password);
        if (result.success && result.user) {
            setCurrentUser(result.user);
            setUser(result.user);
        }
        return { success: result.success, error: result.error };
    }, []);

    const logout = useCallback(() => {
        setCurrentUser(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
