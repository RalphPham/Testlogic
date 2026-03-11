// src/utils/scoreCalculator.ts

export interface Answer {
    questionId: string;
    selectedOptionId: string;
    timeSpent: number; // Tính bằng giây
}

export type CognitiveDomain = 'spatial' | 'algorithmic' | 'arithmetic' | 'logic';

export interface IRTParams {
    a: number; // Độ phân biệt (Discrimination): càng cao càng lọc giỏi
    b: number; // Độ khó (Difficulty): scale từ -3.0 (rất dễ) đến +3.0 (thiên tài)
    c: number; // Xác suất đoán mò (Guessing): Mặc định bài 6 đáp án là ~0.167
}

export interface Question {
    id: string;
    type: string;
    domain: CognitiveDomain;
    difficultyTier: 1 | 2 | 3 | 4; // 1: Khởi động, 2: Tiêu chuẩn, 3: Senior, 4: Thiên tài
    irt: IRTParams;
    correctOptionId: string;
}

export interface ResultData {
    estimatedIQ: number;
    theta: number; // Năng lực thực sự theo IRT
    category: string;
    categoryColor: string;
    correct: number;
    total: number;
    domainScores: Record<CognitiveDomain, { correct: number; total: number; score: number }>;
    averageTime: number;
    accuracy: number;
    radarData: Array<{ subject: string; value: number; fullMark: number }>;
}

export function calculateResults(questions: Question[], answers: Answer[]): ResultData {
    const total = questions.length;
    let correct = 0;

    // Khởi tạo điểm cho 4 ma trận lõi
    const domainScores: Record<CognitiveDomain, { correct: number; total: number; score: number }> = {
        spatial: { correct: 0, total: 0, score: 0 }, // Tư duy Không gian
        algorithmic: { correct: 0, total: 0, score: 0 }, // Tư duy Thuật toán
        arithmetic: { correct: 0, total: 0, score: 0 }, // Phân tích Số học
        logic: { correct: 0, total: 0, score: 0 } // Ngôn ngữ Logic
    };

    let totalThetaScore = 0;
    let maxPossibleTheta = 0;

    questions.forEach((q) => {
        const answer = answers.find((a) => a.questionId === q.id);
        const isCorrect = answer?.selectedOptionId === q.correctOptionId;
        const timeSpent = answer?.timeSpent || 0;

        domainScores[q.domain].total++;

        // Tính điểm tối đa có thể đạt được của câu hỏi này (để chuẩn hóa)
        const questionWeight = q.irt.a * (q.irt.b + 3.0);
        maxPossibleTheta += questionWeight;

        if (isCorrect) {
            correct++;
            domainScores[q.domain].correct++;

            // Mô hình B-GLIRT: Trừng phạt nếu đoán mò (chọn đúng nhưng thời gian < 5s cho câu khó)
            let timePenalty = 1;
            if (q.difficultyTier >= 3 && timeSpent < 5) {
                timePenalty = 0.5; // Đoán mò trúng -> Chỉ được 50% điểm năng lực
            }

            // Tính điểm năng lực Theta tích lũy dựa trên IRT 3PL (Giản lược cho Frontend)
            // Câu càng khó (b cao) và độ phân biệt tốt (a cao) thì điểm càng lớn
            const gainedTheta = questionWeight * timePenalty;
            totalThetaScore += gainedTheta;
            domainScores[q.domain].score += gainedTheta;
        } else {
            // Hệ thống IRT không trừ điểm câu sai (no penalty for guessing), chỉ không cộng điểm
        }
    });

    const accuracy = total > 0 ? (correct / total) * 100 : 0;
    const averageTime = answers.length > 0
        ? answers.reduce((sum, a) => sum + a.timeSpent, 0) / answers.length
        : 0;

    // Quy đổi Theta sang IQ (Hệ quy chiếu kỹ sư công nghệ)
    // Giả sử base IQ là 85, cộng thêm tối đa 55 điểm (Max IQ = 140)
    const normalizedTheta = totalThetaScore / maxPossibleTheta;
    let estimatedIQ = Math.round(85 + (normalizedTheta * 55));

    // Nếu sai quá nhiều, rớt xuống đáy
    if (accuracy < 20) estimatedIQ = Math.max(70, estimatedIQ - 10);

    // Phân loại hạng mức theo chuẩn CCAT
    let category = 'Rủi ro cao';
    let categoryColor = 'text-slate-500';

    if (estimatedIQ >= 135) {
        category = 'Thiên tài (Top 1%)';
        categoryColor = 'text-purple-600';
    } else if (estimatedIQ >= 120) {
        category = 'Ưu tú (Senior/Tech Lead)';
        categoryColor = 'text-indigo-600';
    } else if (estimatedIQ >= 105) {
        category = 'Tiêu chuẩn cạnh tranh';
        categoryColor = 'text-blue-600';
    } else if (estimatedIQ >= 90) {
        category = 'Bình thường';
        categoryColor = 'text-green-600';
    } else {
        category = 'Dưới trung bình';
        categoryColor = 'text-orange-500';
    }

    // Chuẩn bị Data cho biểu đồ Radar (Scale 100 điểm)
    const calcDomainPercentage = (domain: CognitiveDomain) => {
        const d = domainScores[domain];
        if (d.total === 0) return 0;
        return Math.round((d.correct / d.total) * 100);
    };

    // Tốc độ xử lý: Trung bình < 15s là 100đ, > 60s là 0đ
    const speedScore = Math.min(100, Math.max(0, (1 - (averageTime - 15) / 45) * 100));

    const radarData = [
        { subject: 'Không gian & Trừu tượng', value: calcDomainPercentage('spatial'), fullMark: 100 },
        { subject: 'Tư duy Thuật toán', value: calcDomainPercentage('algorithmic'), fullMark: 100 },
        { subject: 'Toán học & Dữ liệu', value: calcDomainPercentage('arithmetic'), fullMark: 100 },
        { subject: 'Ngôn ngữ Logic', value: calcDomainPercentage('logic'), fullMark: 100 },
        { subject: 'Tốc độ xử lý', value: Math.round(speedScore), fullMark: 100 },
    ];

    return {
        estimatedIQ,
        theta: Number(normalizedTheta.toFixed(3)),
        category,
        categoryColor,
        correct,
        total,
        domainScores,
        averageTime,
        accuracy,
        radarData,
    };
}