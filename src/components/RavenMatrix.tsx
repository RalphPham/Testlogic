'use client';

import React from 'react';

interface RavenCellProps {
    dotAngle: number;
    lineAngle: number;
    isEmpty?: boolean;
}

function RavenCell({ dotAngle, lineAngle, isEmpty = false }: RavenCellProps) {
    const cx = 50;
    const cy = 50;
    const radius = 38;
    const dotRadius = 6;
    const lineLength = radius * 0.85;

    const dotRad = (dotAngle - 90) * (Math.PI / 180);
    const dotX = cx + radius * 0.72 * Math.cos(dotRad);
    const dotY = cy + radius * 0.72 * Math.sin(dotRad);

    const lineRad = (lineAngle - 90) * (Math.PI / 180);
    const lineX1 = cx - lineLength * Math.cos(lineRad);
    const lineY1 = cy - lineLength * Math.sin(lineRad);
    const lineX2 = cx + lineLength * Math.cos(lineRad);
    const lineY2 = cy + lineLength * Math.sin(lineRad);

    if (isEmpty) {
        return (
            <svg viewBox="0 0 100 100" className="w-full h-full object-contain">
                <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="6 6" />
                <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="#94a3b8" fontSize="28" fontWeight="bold">?</text>
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 100 100" className="w-full h-full object-contain">
            <circle cx={cx} cy={cy} r={radius} fill="#f8fafc" stroke="#1e293b" strokeWidth="2.5" />
            <line x1={lineX1} y1={lineY1} x2={lineX2} y2={lineY2} stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={dotX} cy={dotY} r={dotRadius} fill="#1e293b" />
        </svg>
    );
}

interface RavenMatrixProps {
    visualData: Record<string, unknown>;
}

export function RavenMatrixQuestion({ visualData }: RavenMatrixProps) {
    const grid = visualData.grid as Array<Array<{ dotAngle: number; lineAngle: number } | null>>;

    return (
        <div className="flex justify-center items-center w-full">
            {/* Ép cứng kích thước khối lưới ở mức 300px */}
            <div className="grid grid-cols-3 gap-1.5 w-full max-w-[300px] aspect-square bg-slate-100 p-2 sm:p-3 rounded-2xl border border-slate-200">
                {grid.flat().map((cell, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 aspect-square flex items-center justify-center p-1 sm:p-2">
                        {cell ? (
                            <RavenCell dotAngle={cell.dotAngle} lineAngle={cell.lineAngle} />
                        ) : (
                            <RavenCell dotAngle={0} lineAngle={0} isEmpty />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

interface RavenOptionProps {
    visual: Record<string, unknown>;
}

export function RavenOptionVisual({ visual }: RavenOptionProps) {
    return (
        <div className="w-full h-full flex items-center justify-center p-1 sm:p-2">
            <RavenCell dotAngle={visual.dotAngle as number} lineAngle={visual.lineAngle as number} />
        </div>
    );
}