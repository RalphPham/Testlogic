// src/lib/storage.ts
// Short-term localStorage data storage

export interface User {
    id: string;
    username: string;
    email: string;
    passwordHash: string; // Simple hash for demo
    createdAt: string;
}

export interface DomainScore {
    correct: number;
    total: number;
    score: number;
}

export interface ExamSession {
    id: string;
    userId: string;
    examSetId: string;
    examSetName: string;
    date: string;
    totalTime: number; // seconds used
    answers: Array<{
        questionId: string;
        selectedOptionId: string;
        timeSpent: number;
    }>;
    score: {
        estimatedIQ: number;
        theta: number;
        category: string;
        correct: number;
        total: number;
        accuracy: number;
        averageTime: number;
        domainScores: Record<string, DomainScore>;
        radarData: Array<{ subject: string; value: number; fullMark: number }>;
    };
    questionOrder: string[]; // array of question IDs in the order they were presented
}

const KEYS = {
    USERS: 'iqapp_users',
    SESSIONS: 'iqapp_sessions',
    CURRENT_USER: 'iqapp_current_user',
};

// ---- Simple hash (for demo only, NOT secure) ----
export function simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}

// ---- Users ----
export function getUsers(): User[] {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    } catch {
        return [];
    }
}

export function saveUsers(users: User[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

export function registerUser(username: string, email: string, password: string): { success: boolean; error?: string; user?: User } {
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: 'Email đã được sử dụng.' };
    }
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, error: 'Tên đăng nhập đã tồn tại.' };
    }
    const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        username,
        email: email.toLowerCase(),
        passwordHash: simpleHash(password),
        createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    return { success: true, user: newUser };
}

export function loginUser(email: string, password: string): { success: boolean; error?: string; user?: User } {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { success: false, error: 'Email không tồn tại.' };
    if (user.passwordHash !== simpleHash(password)) {
        return { success: false, error: 'Mật khẩu không đúng.' };
    }
    return { success: true, user };
}

// ---- Current Session ----
export function getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(KEYS.CURRENT_USER);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function setCurrentUser(user: User | null): void {
    if (typeof window === 'undefined') return;
    if (user) {
        localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
        localStorage.removeItem(KEYS.CURRENT_USER);
    }
}

// ---- Exam Sessions ----
export function getExamSessions(): ExamSession[] {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(KEYS.SESSIONS) || '[]');
    } catch {
        return [];
    }
}

export function getSessionsByUser(userId: string): ExamSession[] {
    return getExamSessions().filter(s => s.userId === userId).sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

export function saveExamSession(session: ExamSession): void {
    if (typeof window === 'undefined') return;
    const sessions = getExamSessions();
    const idx = sessions.findIndex(s => s.id === session.id);
    if (idx >= 0) {
        sessions[idx] = session;
    } else {
        sessions.push(session);
    }
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
}
