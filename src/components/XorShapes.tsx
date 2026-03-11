'use client';

import React from 'react';

interface TriangleFills {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
}

function XorCell({ fills, isEmpty = false }: { fills: TriangleFills; isEmpty?: boolean }) {
    if (isEmpty) {
        return (
            <svg viewBox="0 0 100 100" className="w-full h-full object-contain">
                <rect x="5" y="5" width="90" height="90" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="6 6" rx="8" />
                <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fill="#94a3b8" fontSize="32" fontWeight="bold">?</text>
            </svg>
        );
    }

    const triangles = [
        { points: "50,50 5,5 95,5", filled: fills.top },
        { points: "50,50 95,5 95,95", filled: fills.right },
        { points: "50,50 95,95 5,95", filled: fills.bottom },
        { points: "50,50 5,95 5,5", filled: fills.left },
    ];

    return (
        <svg viewBox="0 0 100 100" className="w-full h-full object-contain">
            <rect x="5" y="5" width="90" height="90" fill="#f8fafc" stroke="#1e293b" strokeWidth="2.5" rx="4" />
            {triangles.map((t, i) => (
                <polygon
                    key={i}
                    points={t.points}
                    fill={t.filled ? '#1e293b' : 'transparent'}
                    stroke="#1e293b"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
            ))}
        </svg>
    );
}

interface XorShapesProps {
    visualData: Record<string, unknown>;
}

export function XorShapesQuestion({ visualData }: XorShapesProps) {
    const data = visualData as {
        rows: Array<{
            col1: TriangleFills;
            col2: TriangleFills;
            col3: TriangleFills | null;
        }>;
    };

    return (
        <div className="flex flex-col items-center justify-center w-full">
            {/* Ép cứng bề rộng tối đa 350px */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 shadow-sm w-full max-w-[350px] flex flex-col gap-3">
                {data.rows.map((row, rowIdx) => (
                    <div key={rowIdx} className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
                            <XorCell fills={row.col1} />
                        </div>
                        <div className="text-slate-400 font-bold text-xl">⊕</div>
                        <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
                            <XorCell fills={row.col2} />
                        </div>
                        <div className="text-slate-400 font-bold text-xl">=</div>
                        <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
                            {row.col3 ? (
                                <XorCell fills={row.col3} />
                            ) : (
                                <XorCell fills={{ top: false, right: false, bottom: false, left: false }} isEmpty />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface XorOptionProps {
    visual: Record<string, unknown>;
}

export function XorOptionVisual({ visual }: XorOptionProps) {
    return (
        <div className="w-full h-full flex items-center justify-center p-2">
            <XorCell fills={visual as unknown as TriangleFills} />
        </div>
    );
}