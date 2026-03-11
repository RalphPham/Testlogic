'use client';

import React from 'react';
import { RavenOptionVisual } from './RavenMatrix';
import { XorOptionVisual } from './XorShapes';
import { PolygonOptionVisual } from './NestedPolygons';
import type { Option } from '@/data/questions';

interface OptionGridProps {
    options: Option[];
    questionType: string;
    visualType?: string;
    selectedOptionId?: string;
    onSelect: (optionId: string) => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function OptionGrid({ options, questionType, visualType, selectedOptionId, onSelect }: OptionGridProps) {
    // Với câu hỏi Hình học (geometry), ép khung đáp án thành hình vuông (aspect-square)
    // Với Toán học/Logic (text), không ép vuông để chữ hiển thị tự nhiên
    const isGeometry = questionType === 'geometry';

    return (
        <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 w-full max-w-[560px] mx-auto`}>
            {options.map((option, idx) => {
                const isSelected = selectedOptionId === option.id;
                return (
                    <button
                        key={option.id}
                        onClick={() => onSelect(option.id)}
                        className={`
                            group relative rounded-2xl border-2 transition-all duration-200 ease-out overflow-hidden flex items-center justify-center
                            ${isGeometry ? 'aspect-square p-1 sm:p-2' : 'min-h-[80px] sm:min-h-[100px] p-4'}
                            ${isSelected
                                ? 'border-blue-600 bg-blue-50 shadow-md ring-4 ring-blue-600/10 scale-[1.02] z-10'
                                : 'border-slate-200 bg-white hover:border-blue-400 hover:shadow-md hover:bg-slate-50 active:scale-95'
                            }
                            cursor-pointer
                        `}
                    >
                        {/* Label Badge (A, B, C...) */}
                        <div className={`
                            absolute top-2 left-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold z-20 shadow-sm
                            ${isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-200 text-slate-600 group-hover:bg-blue-500 group-hover:text-white'
                            }
                            transition-colors duration-200
                        `}>
                            {OPTION_LABELS[idx]}
                        </div>

                        {/* Option Visual Content */}
                        {isGeometry && option.visual ? (
                            <div className="w-full h-full flex items-center justify-center">
                                {/* Component con bên trong sẽ tự scale ra w-full h-full */}
                                {visualType === 'raven_matrix' && <RavenOptionVisual visual={option.visual} />}
                                {visualType === 'xor_shapes' && <XorOptionVisual visual={option.visual} />}
                                {visualType === 'nested_polygons' && <PolygonOptionVisual visual={option.visual} />}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-full h-full">
                                <span className={`
                                    text-lg md:text-xl font-bold text-center break-words
                                    ${isSelected ? 'text-blue-700' : 'text-slate-700 group-hover:text-blue-600'}
                                    transition-colors duration-200
                                `}>
                                    {option.label}
                                </span>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
}