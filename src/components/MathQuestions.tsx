'use client';

import React, { useState } from 'react';

interface NumberSequenceProps {
    visualData: Record<string, unknown>;
}

// Bảng thuật ngữ kỹ thuật toàn diện
const GLOSSARY_ITEMS: { symbol: string; meaning: string }[] = [
    { symbol: '⊕ (XOR)', meaning: 'Hai bit khác nhau → 1, giống nhau → 0' },
    { symbol: '& (AND)', meaning: 'Cả hai bit đều là 1 → 1, còn lại → 0' },
    { symbol: '| (OR)', meaning: 'Ít nhất một bit là 1 → 1' },
    { symbol: '~ (NOT)', meaning: 'Đảo bit: 0 → 1, 1 → 0' },
    { symbol: '<< n', meaning: 'Left Shift: dịch bit sang trái n vị trí (× 2ⁿ)' },
    { symbol: '>> n', meaning: 'Right Shift: dịch bit sang phải n vị trí (÷ 2ⁿ)' },
    { symbol: "x'", meaning: "Giá trị mới của x SAU khi thực hiện phép gán" },
    { symbol: '% (mod)', meaning: 'Lấy phần dư của phép chia nguyên' },
    { symbol: 'f(n)', meaning: 'Hàm đệ quy: gọi lại chính nó với tham số mới' },
    { symbol: 'swap(a,b)', meaning: 'Hoán đổi giá trị của hai biến a và b' },
];

// Hàm xác định loại dòng từ nội dung text
function classifyLine(line: string): 'header' | 'init' | 'loop' | 'exec' | 'out' | 'comment' | 'plain' {
    const t = line.trim();
    if (t.startsWith('//') || t.startsWith('#')) return 'comment';
    if (/^(Hệ |Hàm |Cây |Mảng |Input:|Vòng lặp|Toán tử|Khởi tạo|BEGIN|Trạng thái ban đầu|Stack)/i.test(t)) return 'header';
    if (/^(if|while|for|return|Điều kiện:|Quy tắc|S[012] \+)/i.test(t)) return 'loop';
    if (/^(Output|Kết quả|Giá trị|Số lần|Trạng thái cuối|Node =|Balance =\?|Output của)/i.test(t)) return 'out';
    if (/^(Khởi tạo:|x\s*=|y\s*=|z\s*=|[A-Z][0-9]?:|P[0-9]+:|1\.|2\.|3\.|4\.|5\.|[A-Z]+\s*=\s*[A-Z]|BEGIN TRANSACTION|SAVEPOINT|ROLLBACK|COMMIT|Push|Pop)/i.test(t)) return 'init';
    if (/[:=+\-\[\]{}(){}]/.test(t) && !/^\d+\.\s/.test(t)) return 'exec';
    return 'plain';
}

function getLineStyle(type: ReturnType<typeof classifyLine>): { prefix: string; className: string } {
    switch (type) {
        case 'header': return { prefix: '━━', className: 'text-sky-300 font-bold border-b border-slate-700 pb-1 mb-1' };
        case 'init': return { prefix: '◆ ', className: 'text-violet-300' };
        case 'loop': return { prefix: '⟳ ', className: 'text-amber-300 font-semibold' };
        case 'exec': return { prefix: '▶ ', className: 'text-emerald-400' };
        case 'out': return { prefix: '⇒ ', className: 'text-yellow-300 font-bold mt-2 pt-2 border-t border-slate-700/50' };
        case 'comment': return { prefix: '// ', className: 'text-slate-500 italic' };
        default: return { prefix: '  ', className: 'text-slate-300' };
    }
}

// Lọc các thuật ngữ có liên quan đến câu hỏi này
function getRelevantGlossary(sequence: (number | string)[]): typeof GLOSSARY_ITEMS {
    const text = sequence.join(' ');
    return GLOSSARY_ITEMS.filter(item => {
        const key = item.symbol.split(' ')[0].replace(/[()]/g, '');
        return text.includes(key);
    });
}

export function NumberSequenceQuestion({ visualData }: NumberSequenceProps) {
    const [showGlossary, setShowGlossary] = useState(true);

    const data = visualData as {
        type: string;
        sequence: (number | string)[];
        formula?: string;
    };

    const isTextLogic = data.sequence.some(item => typeof item === 'string' && item.length > 5);

    if (isTextLogic) {
        const relevantGlossary = getRelevantGlossary(data.sequence);

        return (
            <div className="w-full max-w-xl mx-auto py-2 flex flex-col gap-3">
                {/* Terminal Block */}
                <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
                    {/* Title bar */}
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border-b border-slate-700">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        <span className="ml-2 text-xs text-slate-400 font-mono">logic_engine.sh</span>
                    </div>

                    {/* Lines */}
                    <div className="px-5 py-4 font-mono text-sm flex flex-col gap-1.5 overflow-x-auto">
                        {data.sequence.map((item, i) => {
                            const text = String(item);
                            const isQuestion = text.endsWith('?') || text.startsWith('Output') || text.startsWith('Kết quả') || text.startsWith('Giá trị') || text.startsWith('Tìm') || text.startsWith('Trạng thái cuối');
                            const type = isQuestion ? 'out' : classifyLine(text);
                            const style = getLineStyle(type);
                            return (
                                <div key={i} className={`flex items-start gap-2 ${style.className}`}>
                                    <span className="flex-shrink-0 opacity-70 text-xs mt-0.5 w-4 text-slate-500">{i + 1}</span>
                                    <span className="flex-shrink-0 text-xs mt-0.5">{style.prefix}</span>
                                    <span className="leading-snug break-all whitespace-pre-wrap">{text}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bảng thuật ngữ */}
                {relevantGlossary.length > 0 && (
                    <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
                        <button
                            onClick={() => setShowGlossary(!showGlossary)}
                            className="w-full flex items-center justify-between px-4 py-2.5 text-left"
                        >
                            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                                <span>📖</span> Bảng Ký Hiệu & Thuật Ngữ
                            </span>
                            <span className="text-xs text-slate-500">{showGlossary ? '▲ Ẩn' : '▼ Hiện'}</span>
                        </button>
                        {showGlossary && (
                            <div className="border-t border-slate-700 divide-y divide-slate-700/50">
                                {relevantGlossary.map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 px-4 py-2">
                                        <code className="flex-shrink-0 text-xs bg-slate-700 text-amber-300 px-2 py-0.5 rounded font-mono min-w-[80px] text-center">
                                            {item.symbol}
                                        </code>
                                        <span className="text-xs text-slate-300 leading-snug pt-0.5">{item.meaning}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // Nếu là Dãy số bình thường
    return (
        <div className="flex flex-col items-center justify-center w-full py-6">
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center max-w-2xl">
                {data.sequence.map((num, i) => {
                    const isUnknown = num === '?' || num === null;
                    return (
                        <React.Fragment key={i}>
                            <div className={`
                                flex items-center justify-center rounded-2xl border-2 shadow-sm transition-all
                                min-w-[50px] sm:min-w-[64px] h-[50px] sm:h-[64px] px-2 sm:px-3
                                ${isUnknown
                                    ? 'bg-amber-50 border-amber-300 animate-pulse ring-4 ring-amber-500/10'
                                    : 'bg-white border-slate-200'}
                            `}>
                                <span className={`
                                    text-xl sm:text-2xl font-bold
                                    ${isUnknown ? 'text-amber-500' : 'text-slate-800'}
                                `}>
                                    {num}
                                </span>
                            </div>
                            {i < data.sequence.length - 1 && (
                                <span className="text-slate-300 font-bold text-xl sm:text-2xl mt-1">
                                    ,
                                </span>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}

interface MatrixEquationProps {
    visualData: Record<string, unknown>;
}

export function MatrixEquationQuestion({ visualData }: MatrixEquationProps) {
    const data = visualData as {
        type: string;
        rows: Array<{ x: number; y: number; z: number | null }>;
    };

    return (
        <div className="flex flex-col items-center justify-center w-full py-4">
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm max-w-md w-full flex flex-col gap-4 sm:gap-5">
                {/* Header labels */}
                <div className="flex items-center justify-between gap-3 sm:gap-4 pb-1 border-b border-slate-100">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-14 sm:w-16 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">X</div>
                        <div className="w-14 sm:w-16 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Y</div>
                    </div>
                    <div className="w-4" />
                    <div className="w-16 sm:w-20 text-center text-xs font-bold text-indigo-400 uppercase tracking-wider">Kết quả</div>
                </div>

                {data.rows.map((row, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 sm:gap-4">
                        {/* Cột X & Y */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex items-center justify-center bg-slate-50 border-2 border-slate-200 rounded-xl w-14 h-14 sm:w-16 sm:h-16 shadow-sm">
                                <span className="text-xl sm:text-2xl font-bold text-slate-700">{row.x}</span>
                            </div>
                            <div className="flex items-center justify-center bg-slate-50 border-2 border-slate-200 rounded-xl w-14 h-14 sm:w-16 sm:h-16 shadow-sm">
                                <span className="text-xl sm:text-2xl font-bold text-slate-700">{row.y}</span>
                            </div>
                        </div>

                        {/* Mũi tên */}
                        <div className="text-slate-300 font-bold text-2xl">→</div>

                        {/* Cột Kết quả */}
                        <div className="flex justify-end">
                            {row.z !== null ? (
                                <div className="flex items-center justify-center bg-indigo-50 border-2 border-indigo-200 rounded-xl w-16 h-14 sm:w-20 sm:h-16 shadow-sm">
                                    <span className="text-xl sm:text-2xl font-bold text-indigo-700">{row.z}</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center bg-amber-50 border-2 border-amber-300 rounded-xl w-16 h-14 sm:w-20 sm:h-16 shadow-sm animate-pulse ring-4 ring-amber-500/10">
                                    <span className="text-xl sm:text-2xl font-bold text-amber-500">?</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}