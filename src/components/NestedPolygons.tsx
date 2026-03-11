'use client';

import React from 'react';

function generatePolygonPoints(cx: number, cy: number, radius: number, sides: number): string {
    if (sides < 2) {
        if (sides <= 1) return `${cx},${cy}`;
        return `${cx - radius},${cy} ${cx + radius},${cy}`;
    }
    const points: string[] = [];
    for (let i = 0; i < sides; i++) {
        const angle = (2 * Math.PI * i) / sides - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return points.join(' ');
}

function PolygonCell({ outer, inner, dots, isEmpty = false }: { outer: number; inner: number; dots: number; isEmpty?: boolean; }) {
    const cx = 50;
    const cy = 50;
    const outerRadius = 42;
    const innerRadius = 22;
    const dotRadius = 4;

    if (isEmpty) {
        return (
            <svg viewBox="0 0 100 100" className="w-full h-full object-contain">
                <circle cx={cx} cy={cy} r={outerRadius} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="6 6" />
                <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="#94a3b8" fontSize="32" fontWeight="bold">?</text>
            </svg>
        );
    }

    const dotPositions: { x: number; y: number }[] = [];
    const absDots = Math.abs(dots);
    if (absDots > 0) {
        const dotCircleRadius = 8;
        if (absDots === 1) {
            dotPositions.push({ x: cx, y: cy });
        } else {
            for (let i = 0; i < absDots; i++) {
                const angle = (2 * Math.PI * i) / absDots - Math.PI / 2;
                dotPositions.push({
                    x: cx + dotCircleRadius * Math.cos(angle),
                    y: cy + dotCircleRadius * Math.sin(angle),
                });
            }
        }
    }

    return (
        <svg viewBox="0 0 100 100" className="w-full h-full object-contain">
            {outer === 2 ? (
                <line x1={cx - outerRadius} y1={cy} x2={cx + outerRadius} y2={cy} stroke="#1e293b" strokeWidth="2.5" />
            ) : (
                <polygon points={generatePolygonPoints(cx, cy, outerRadius, outer)} fill="#f1f5f9" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
            )}

            {inner === 2 ? (
                <line x1={cx - innerRadius} y1={cy} x2={cx + innerRadius} y2={cy} stroke="#1e293b" strokeWidth="2.5" />
            ) : inner === 1 ? (
                <circle cx={cx} cy={cy} r={dotRadius * 1.5} fill="#1e293b" />
            ) : (
                <polygon points={generatePolygonPoints(cx, cy, innerRadius, inner)} fill="#e2e8f0" stroke="#1e293b" strokeWidth="2" strokeLinejoin="round" />
            )}

            {dotPositions.map((pos, i) => (
                <circle key={i} cx={pos.x} cy={pos.y} r={dotRadius} fill="#ef4444" />
            ))}
        </svg>
    );
}

interface NestedPolygonsProps {
    visualData: Record<string, unknown>;
}

export function NestedPolygonsQuestion({ visualData }: NestedPolygonsProps) {
    const data = visualData as {
        gridCorrected: Array<Array<{ outer: number; inner: number; dots: number } | null>>;
    };

    return (
        <div className="flex justify-center items-center w-full">
            {/* Ép cứng kích thước khối lưới ở mức 300px */}
            <div className="grid grid-cols-3 gap-1.5 w-full max-w-[300px] aspect-square bg-slate-100 p-2 sm:p-3 rounded-2xl border border-slate-200">
                {data.gridCorrected.flat().map((cell, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 aspect-square flex items-center justify-center p-1 sm:p-2">
                        {cell ? (
                            <PolygonCell outer={cell.outer} inner={cell.inner} dots={cell.dots} />
                        ) : (
                            <PolygonCell outer={3} inner={3} dots={0} isEmpty />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

interface PolygonOptionProps {
    visual: Record<string, unknown>;
}

export function PolygonOptionVisual({ visual }: PolygonOptionProps) {
    const data = visual as { outer: number; inner: number; dots: number };
    return (
        <div className="w-full h-full flex items-center justify-center p-1 sm:p-2">
            <PolygonCell outer={data.outer} inner={data.inner} dots={data.dots} />
        </div>
    );
}