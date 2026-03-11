// src/data/questions.ts

export type QuestionType = 'geometry' | 'math' | 'logic';
export type Difficulty = 'medium' | 'hard';
export type CognitiveDomain = 'spatial' | 'algorithmic' | 'arithmetic' | 'logic';

export interface IRTParams {
  a: number; // Discrimination
  b: number; // Difficulty (-3.0 to +3.0)
  c: number; // Guessing probability (~0.167 for 6 options)
}

export interface Option {
  id: string;
  label?: string;
  visual?: Record<string, unknown>;
}

export interface Question {
  id: string;
  type: QuestionType;
  difficulty?: Difficulty;
  domain: CognitiveDomain;
  difficultyTier: 1 | 2 | 3 | 4;
  irt: IRTParams;
  prompt: string;
  description?: string;
  visualData?: Record<string, unknown>;
  options: Option[];
  correctOptionId: string;
  explanation?: string; // Giải thích đáp án đúng
}

export const questions: Question[] = [
  // ==========================================
  // TẦNG 1 & 2: KHỞI ĐỘNG VÀ TIÊU CHUẨN (TIER 1 & 2)
  // ==========================================

  // Q1: Spatial - Raven Matrix (Dễ)
  {
    id: 'q1',
    type: 'geometry',
    domain: 'spatial',
    difficultyTier: 1,
    irt: { a: 0.8, b: -1.83, c: 0.16 },
    prompt: 'Tìm hình phù hợp để điền vào ô trống trong ma trận 3×3.',
    visualData: {
      type: 'raven_matrix',
      grid: [
        [{ dotAngle: 0, lineAngle: 45 }, { dotAngle: 45, lineAngle: 45 }, { dotAngle: 90, lineAngle: 45 }],
        [{ dotAngle: 135, lineAngle: 135 }, { dotAngle: 180, lineAngle: 135 }, { dotAngle: 225, lineAngle: 135 }],
        [{ dotAngle: 270, lineAngle: 225 }, { dotAngle: 315, lineAngle: 225 }, null],
      ],
      missingCell: { row: 2, col: 2 },
    },
    options: [
      { id: 'A', label: 'A', visual: { dotAngle: 135, lineAngle: 0 } },
      { id: 'B', label: 'B', visual: { dotAngle: 0, lineAngle: 225 } }, // Correct (360=0)
      { id: 'C', label: 'C', visual: { dotAngle: 0, lineAngle: 0 } },
      { id: 'D', label: 'D', visual: { dotAngle: 45, lineAngle: 225 } },
      { id: 'E', label: 'E', visual: { dotAngle: 90, lineAngle: 315 } },
      { id: 'F', label: 'F', visual: { dotAngle: 180, lineAngle: 270 } },
    ],
    correctOptionId: 'B',
    explanation: 'Quy luật: mỗi số tiếp theo = số hiện tại × 2 + số hạng tăng dần (×1, ×2, ×4...). Cụ thể: dotAngle tăng 45° mỗi bước theo hàng; lineAngle giữ nguyên theo cột (225°). Ô (3,3) cần dotAngle=360°=0°, lineAngle=225° → đáp án B.',
  },

  // Q2: Arithmetic - Dãy số (Dễ)
  {
    id: 'q2',
    type: 'math',
    domain: 'arithmetic',
    difficultyTier: 2,
    irt: { a: 1.0, b: -0.01, c: 0.16 },
    prompt: 'Tìm số tiếp theo trong dãy số sau:',
    visualData: { type: 'number_sequence', sequence: [2, 6, 14, 30, 62] },
    options: [
      { id: 'A', label: '124' },
      { id: 'B', label: '126' }, // Correct (62 + 64 = 126)
      { id: 'C', label: '128' },
      { id: 'D', label: '130' },
      { id: 'E', label: '122' },
      { id: 'F', label: '120' },
    ],
    correctOptionId: 'B',
    explanation: 'Quy luật: mỗi số = số trước × 2 + 2. Cụ thể: 2→6 (+4), 6→14 (+8), 14→30 (+16), 30→62 (+32), 62→126 (+64). Đáp án: 62 + 64 = 126 (B).',
  },

  // Q3: Spatial - XOR Logic (Tiêu chuẩn)
  {
    id: 'q3',
    type: 'geometry',
    domain: 'spatial',
    difficultyTier: 2,
    irt: { a: 1.2, b: 1.27, c: 0.16 },
    prompt: 'Áp dụng phép toán logic (XOR) trên hàng ngang để tìm hình ở Cột 3.',
    visualData: {
      type: 'xor_shapes',
      rows: [
        {
          col1: { top: true, right: false, bottom: false, left: true },
          col2: { top: true, right: false, bottom: true, left: false },
          col3: null,
        },
        {
          col1: { top: false, right: true, bottom: true, left: false },
          col2: { top: true, right: true, bottom: false, left: false },
          col3: { top: true, right: false, bottom: true, left: false },
        },
        {
          col1: { top: true, right: false, bottom: true, left: true },
          col2: { top: false, right: true, bottom: true, left: false },
          col3: { top: true, right: true, bottom: false, left: true },
        },
      ],
      missingCell: { row: 0, col: 2 },
    },
    options: [
      { id: 'A', label: 'A', visual: { top: false, right: false, bottom: true, left: true } }, // Correct
      { id: 'B', label: 'B', visual: { top: true, right: false, bottom: true, left: true } },
      { id: 'C', label: 'C', visual: { top: true, right: false, bottom: false, left: false } },
      { id: 'D', label: 'D', visual: { top: false, right: true, bottom: true, left: false } },
      { id: 'E', label: 'E', visual: { top: false, right: false, bottom: false, left: false } },
      { id: 'F', label: 'F', visual: { top: false, right: true, bottom: false, left: true } },
    ],
    correctOptionId: 'A',
    explanation: 'Phép XOR theo hàng ngang: Cột3 = Cột1 XOR Cột2. Hàng 1: top=T⊕T=0(✗), right=F⊕F=0, bottom=F⊕T=1, left=T⊕F=1 → {top:F, right:F, bottom:T, left:T} = đáp án A.',
  },

  // Q4: Algorithmic - Phương trình ma trận ẩn (Tiêu chuẩn)
  {
    id: 'q4',
    type: 'math',
    domain: 'algorithmic',
    difficultyTier: 3,
    irt: { a: 1.4, b: 2.46, c: 0.16 },
    prompt: 'Tìm số điền vào dấu (?) trong hệ ma trận toán tử:',
    visualData: {
      type: 'matrix_equation',
      rows: [
        { x: 4, y: 5, z: 21 },
        { x: 6, y: 3, z: 39 },
        { x: 9, y: 7, z: null },
      ],
    },
    options: [
      { id: 'A', label: '88' }, // Correct (81 + 7 = 88)
      { id: 'B', label: '70' },
      { id: 'C', label: '130' },
      { id: 'D', label: '81' },
      { id: 'E', label: '86' },
      { id: 'F', label: '62' },
    ],
    correctOptionId: 'A',
    explanation: 'Tìm quy luật ẩn: hàng 1 → 4×5=20, 20+1=21. Hàng 2 → 6×5=30, 30+9=39. Thử: z = x²+y. Hàng 1: 16+5=21✓, Hàng 2: 36+3=39✓. Hàng 3: 9²+7 = 81+7 = 88 (A).',
  },

  // ==========================================
  // TẦNG 3: SENIOR / TECH LEAD (TIER 3)
  // ==========================================

  // Q5: Arithmetic - Dãy số phi tuyến tính ẩn
  {
    id: 'q5',
    type: 'math',
    domain: 'arithmetic',
    difficultyTier: 3,
    irt: { a: 1.8, b: 1.26, c: 0.16 },
    prompt: 'Tìm số tiếp theo trong dãy số phi tuyến tính sau:',
    visualData: { type: 'number_sequence', sequence: [5, 14, 41, 122, 365] },
    options: [
      { id: 'A', label: '1094' }, // Correct
      { id: 'B', label: '1095' },
      { id: 'C', label: '1096' },
      { id: 'D', label: '1084' },
      { id: 'E', label: '1085' },
      { id: 'F', label: '1104' },
    ],
    correctOptionId: 'A',
    explanation: 'Dãy số theo quy tắc: f(n) = 3×f(n-1) + 2. Cụ thể: 5×3+(-1)=14... Thực ra: 5→14 (×3-1), 14→41 (×3-1), 41→122 (×3-1), 122→365 (×3-1), 365→1094 (×3-1). Đáp án: 365×3-1 = 1094 (A).',
  },

  // Q6: Spatial - Biến đổi đa giác đa lớp
  {
    id: 'q6',
    type: 'geometry',
    domain: 'spatial',
    difficultyTier: 3,
    irt: { a: 2.0, b: 2.39, c: 0.16 },
    prompt: 'Tìm hình đa giác lồng nhau điền vào ô (3,3):',
    visualData: {
      type: 'nested_polygons',
      gridCorrected: [
        [{ outer: 4, inner: 5, dots: 0 }, { outer: 5, inner: 4, dots: 1 }, { outer: 6, inner: 3, dots: 3 }],
        [{ outer: 5, inner: 4, dots: 1 }, { outer: 6, inner: 3, dots: 3 }, { outer: 7, inner: 2, dots: 5 }],
        [{ outer: 6, inner: 3, dots: 3 }, { outer: 7, inner: 2, dots: 5 }, null],
      ],
      missingCell: { row: 2, col: 2 },
    },
    options: [
      { id: 'A', label: 'A', visual: { outer: 8, inner: 1, dots: 7 } }, // Correct
      { id: 'B', label: 'B', visual: { outer: 8, inner: 2, dots: 6 } },
      { id: 'C', label: 'C', visual: { outer: 7, inner: 1, dots: 6 } },
      { id: 'D', label: 'D', visual: { outer: 8, inner: 3, dots: 5 } },
      { id: 'E', label: 'E', visual: { outer: 9, inner: 1, dots: 8 } },
      { id: 'F', label: 'F', visual: { outer: 8, inner: 1, dots: 9 } },
    ],
    correctOptionId: 'A',
    explanation: 'Theo hàng: outer+1, inner-1, dots+2. Theo cột: tương tự. Ô (3,3): outer=8 (6+1+1), inner=1 (3-1-1), dots=7 (3+2+2). Kiểm tra hàng 3 cột 3: outer=6+2=8, inner=3-2=1, dots=3+4=7 → đáp án A.',
  },
  // ==========================================
  // PHẦN 2: TƯ DUY THUẬT TOÁN, LOGIC & BIẾN THỂ (Q7 - Q21)
  // ==========================================

  // Q7: Logic - Suy luận Mệnh đề (Tiêu chuẩn)
  {
    id: 'q7',
    type: 'logic',
    domain: 'logic',
    difficultyTier: 3,
    irt: { a: 1.1, b: 1.80, c: 0.16 },
    prompt: 'Đọc kỹ các điều kiện hệ thống sau và tìm trạng thái đầu ra:',
    visualData: {
      type: 'number_sequence',
      sequence: [
        'Hệ quy chiếu:',
        '1. A chết -> B bật',
        '2. B bật -> CSDL = Read-Only',
        '3. CSDL hiện tại = Read-Write',
        'Kết luận nào sau đây ĐÚNG?'
      ]
    },
    options: [
      { id: 'A', label: 'Server B đang bật' },
      { id: 'B', label: 'Server A đã chết' },
      { id: 'C', label: 'Server A đang hoạt động' }, // Correct: CSDL là Read-Write => B không bật => A không chết (Modus Tollens)
      { id: 'D', label: 'Hệ thống đang lỗi' },
      { id: 'E', label: 'Không thể xác định trạng thái Server A' },
      { id: 'F', label: 'Server B đang tắt nhưng A đã chết' },
    ],
    correctOptionId: 'C',
    explanation: 'Dùng Modus Tollens: (A chết→B bật), (B bật→CSDL=ReadOnly). Biết CSDL=Read-Write (≠ReadOnly) → B không bật (phủ định kết) → A không chết → A đang hoạt động (C).',
  },

  // Q8: Algorithmic - Tracing Vòng lặp (Senior)
  {
    id: 'q8',
    type: 'logic',
    domain: 'algorithmic',
    difficultyTier: 3,
    irt: { a: 1.6, b: 2.37, c: 0.16 },
    prompt: 'PHÂN TÍCH VÒNG LẶP: Xác định giá trị của y sau khi đoạn mã thực thi xong.',
    visualData: {
      type: 'number_sequence',
      sequence: [
        'Vòng lặp hộp đen:',
        'Khởi tạo: x = 2, y = 0',
        'Điều kiện: while (x < 15)',
        'Thực thi: x = x + 4',
        'Thực thi: y = y + x',
        'Output: y = ?'
      ]
    },
    // Tracing:
    // L1: x = 6, y = 6
    // L2: x = 10, y = 16
    // L3: x = 14, y = 30
    // L4: x = 18, y = 48. Thoát vòng lặp.
    options: [
      { id: 'A', label: '30' },
      { id: 'B', label: '48' }, // Correct
      { id: 'C', label: '14' },
      { id: 'D', label: '18' },
      { id: 'E', label: '52' },
      { id: 'F', label: '26' },
    ],
    correctOptionId: 'B',
    explanation: 'Tracing từng vòng: x=2,y=0 → (x=6,y=6) → (x=10,y=16) → (x=14,y=30) → x=18≥15, thoát vòng lặp với y=48. Chú ý: x cập nhật TRƯỚC khi cộng vào y. Đáp án: y=48 (B).',
  },

  // Q9: Arithmetic - Dãy số Fibonacci biến thể
  {
    id: 'q9',
    type: 'math',
    domain: 'arithmetic',
    difficultyTier: 2,
    irt: { a: 1.3, b: 0.75, c: 0.16 },
    prompt: 'Tìm số tiếp theo trong dãy số dựa trên chuỗi quy nạp:',
    visualData: { type: 'number_sequence', sequence: [1, 2, 4, 7, 12, 20, 33, "?"] },
    // 1+2+1=4 | 2+4+1=7 | 4+7+1=12 | 7+12+1=20 | 12+20+1=33 | 20+33+1=54
    options: [
      { id: 'A', label: '52' },
      { id: 'B', label: '53' },
      { id: 'C', label: '54' }, // Correct
      { id: 'D', label: '55' },
      { id: 'E', label: '48' },
      { id: 'F', label: '50' },
    ],
    correctOptionId: 'C',
    explanation: 'Quy tắc: f(n) = f(n-1) + f(n-2) + 1. Cụ thể: f(7)=f(6)+f(5)+1=20+12+1=33. Tiếp theo: f(8)=f(7)+f(6)+1=33+20+1=54 (C).',
  },

  // Q10: Spatial - Phép quay Raven độ khó cao (Senior)
  {
    id: 'q10',
    type: 'geometry',
    domain: 'spatial',
    difficultyTier: 2,
    irt: { a: 1.7, b: 1.20, c: 0.16 },
    prompt: 'Ma trận quay phức hợp: Tìm hình điền vào ô (3,3).',
    visualData: {
      type: 'raven_matrix',
      grid: [
        [{ dotAngle: 0, lineAngle: 0 }, { dotAngle: 315, lineAngle: 0 }, { dotAngle: 270, lineAngle: 0 }],
        [{ dotAngle: 0, lineAngle: 90 }, { dotAngle: 315, lineAngle: 90 }, { dotAngle: 270, lineAngle: 90 }],
        [{ dotAngle: 0, lineAngle: 180 }, { dotAngle: 315, lineAngle: 180 }, null],
      ],
      missingCell: { row: 2, col: 2 },
    },
    options: [
      { id: 'A', label: 'A', visual: { dotAngle: 270, lineAngle: 180 } }, // Correct
      { id: 'B', label: 'B', visual: { dotAngle: 225, lineAngle: 180 } },
      { id: 'C', label: 'C', visual: { dotAngle: 270, lineAngle: 90 } },
      { id: 'D', label: 'D', visual: { dotAngle: 0, lineAngle: 180 } },
      { id: 'E', label: 'E', visual: { dotAngle: 270, lineAngle: 270 } },
      { id: 'F', label: 'F', visual: { dotAngle: 315, lineAngle: 180 } },
    ],
    correctOptionId: 'A',
    explanation: 'Theo hàng: dotAngle giảm 45° (cột 1→2→3: 0°→315°→270°). Theo cột: lineAngle tăng 90° (hàng 1→2→3: 0°→90°→180°). Ô (3,3): dotAngle=270°, lineAngle=180° → đáp án A.',
  },

  // Q11: Arithmetic - Lập phương ma trận
  {
    id: 'q11',
    type: 'math',
    domain: 'arithmetic',
    difficultyTier: 1,
    irt: { a: 1.5, b: -1.33, c: 0.16 },
    prompt: 'Phân tích ma trận số học và tìm giá trị ở dấu (?):',
    visualData: {
      type: 'matrix_equation',
      rows: [
        { x: 2, y: 3, z: 5 },   // 2^3 - 3 = 5
        { x: 3, y: 5, z: 22 },  // 3^3 - 5 = 22
        { x: 4, y: 10, z: null }, // 4^3 - 10 = 64 - 10 = 54
      ],
    },
    options: [
      { id: 'A', label: '64' },
      { id: 'B', label: '54' }, // Correct
      { id: 'C', label: '44' },
      { id: 'D', label: '38' },
      { id: 'E', label: '56' },
      { id: 'F', label: '70' },
    ],
    correctOptionId: 'B',
    explanation: 'Quy luật: z = x³ - y. Hàng 1: 2³-3=8-3=5✓. Hàng 2: 3³-5=27-5=22✓. Hàng 3: 4³-10=64-10=54 (B).',
  },

  // Q12: Spatial - Phép tịnh tiến XOR (Senior)
  {
    id: 'q12',
    type: 'geometry',
    domain: 'spatial',
    difficultyTier: 2,
    irt: { a: 1.9, b: -0.46, c: 0.16 },
    prompt: 'Áp dụng phép XOR trên mảng tam giác đen trắng. Tìm Cột 3 của Hàng 3.',
    visualData: {
      type: 'xor_shapes',
      rows: [
        {
          col1: { top: false, right: true, bottom: true, left: true },
          col2: { top: true, right: true, bottom: false, left: true },
          col3: { top: true, right: false, bottom: true, left: false },
        },
        {
          col1: { top: true, right: true, bottom: true, left: false },
          col2: { top: false, right: false, bottom: true, left: true },
          col3: { top: true, right: true, bottom: false, left: true },
        },
        {
          col1: { top: true, right: false, bottom: false, left: true },
          col2: { top: true, right: true, bottom: true, left: false },
          col3: null, // XOR thông thường: top:false, right:true, bottom:true, left:true
        },
      ],
      missingCell: { row: 0, col: 2 },
    },
    options: [
      { id: 'A', label: 'A', visual: { top: false, right: true, bottom: true, left: true } }, // Correct
      { id: 'B', label: 'B', visual: { top: true, right: true, bottom: true, left: true } },
      { id: 'C', label: 'C', visual: { top: false, right: true, bottom: false, left: true } },
      { id: 'D', label: 'D', visual: { top: true, right: false, bottom: false, left: false } },
      { id: 'E', label: 'E', visual: { top: false, right: true, bottom: true, left: false } },
      { id: 'F', label: 'F', visual: { top: false, right: false, bottom: false, left: false } },
    ],
    correctOptionId: 'A',
    explanation: 'XOR theo hàng: C3 = C1 XOR C2. Hàng 3: top=T⊕T=0(F), right=F⊕T=1(T), bottom=F⊕T=1(T), left=T⊕F=1(T) → {F,T,T,T} = đáp án A.',
  },

  // Q13: Logic - Suy luận hệ điều hành (Senior)
  {
    id: 'q13',
    type: 'logic',
    domain: 'logic',
    difficultyTier: 3,
    irt: { a: 1.8, b: 1.39, c: 0.16 },
    prompt: 'Phân tích Deadlock (Bế tắc) trong hệ điều hành:',
    visualData: {
      type: 'number_sequence',
      sequence: [
        'Hệ thống cấp phát:',
        'P1: Hold(R1) -> Wait(R2)',
        'P2: Hold(R2) -> Wait(R3)',
        'P3: Hold(R3) -> Wait(?)',
        'Tìm điều kiện để xảy ra vòng lặp bế tắc tuyệt đối.'
      ]
    },
    options: [
      { id: 'A', label: 'P3 Wait(R3)' },
      { id: 'B', label: 'P3 Wait(R2)' },
      { id: 'C', label: 'P3 Wait(R1)' }, // Correct: Tạo thành chu trình P1->P2->P3->P1
      { id: 'D', label: 'P1 Release(R1)' },
      { id: 'E', label: 'P2 Wait(R1)' },
      { id: 'F', label: 'Không có Deadlock' },
    ],
    correctOptionId: 'C',
    explanation: 'Deadlock xảy ra khi có chu trình phụ thuộc khép kín. Hiện tại: P1→R2→P2→R3→P3. Nếu P3 Wait(R1) thì R1 đang bị P1 giữ → chu trình P1→P2→P3→P1 khép kín → Deadlock tuyệt đối (C).',
  },

  // Q14: Algorithmic - Tracing Dịch bit (Bitwise Shift)
  {
    id: 'q14',
    type: 'math',
    domain: 'algorithmic',
    difficultyTier: 2,
    irt: { a: 1.7, b: 0.79, c: 0.16 },
    prompt: 'PHÂN TÍCH TOÁN TỬ BITWISE: Kết quả của biến Z là bao nhiêu?',
    visualData: {
      type: 'number_sequence',
      sequence: [
        'Toán tử hệ nhị phân:',
        'X = 5',
        'Y = X << 1',
        'Z = Y | X',
        'Output(Z) = ? (Hệ thập phân)'
      ]
    },
    // X = 5 (0101)
    // Y = 5 << 1 = 10 (1010)
    // Z = 1010 OR 0101 = 1111 = 15
    options: [
      { id: 'A', label: '10' },
      { id: 'B', label: '12' },
      { id: 'C', label: '14' },
      { id: 'D', label: '15' }, // Correct
      { id: 'E', label: '7' },
      { id: 'F', label: '16' },
    ],
    correctOptionId: 'D',
    explanation: 'Bước 1: X=5 (nhị phân: 0101). Bước 2: Y = X << 1 = 1010 = 10. Bước 3: Z = Y | X = 1010 | 0101 = 1111 = 15. Phép OR: bất kỳ vị trí nào có ít nhất 1 bit=1 → kết quả=1 (D).',
  },

  // Q15: Arithmetic - Chuỗi đan xen (Tiêu chuẩn)
  {
    id: 'q15',
    type: 'math',
    domain: 'arithmetic',
    difficultyTier: 1,
    irt: { a: 1.2, b: -1.58, c: 0.16 },
    prompt: 'Tìm số tiếp theo trong dãy số đan xen sau:',
    visualData: { type: 'number_sequence', sequence: [2, 20, 4, 17, 8, 14, 16, "?"] },
    // Dãy 1 (vị trí lẻ): 2, 4, 8, 16 (Nhân 2)
    // Dãy 2 (vị trí chẵn): 20, 17, 14, ? (Trừ 3) => 14 - 3 = 11
    options: [
      { id: 'A', label: '10' },
      { id: 'B', label: '11' }, // Correct
      { id: 'C', label: '12' },
      { id: 'D', label: '32' },
      { id: 'E', label: '9' },
      { id: 'F', label: '13' },
    ],
    correctOptionId: 'B',
    explanation: 'Dãy đan xen hai dãy độc lập. Dãy lẻ (vị trí 1,3,5,7): 2, 4, 8, 16 (nhân 2). Dãy chẵn (vị trí 2,4,6,?): 20, 17, 14, ? (trừ 3) → 14-3=11 (B).',
  },

  // Q16: Spatial - Nested Polygons (Tiêu chuẩn)
  {
    id: 'q16',
    type: 'geometry',
    domain: 'spatial',
    difficultyTier: 2,
    irt: { a: 1.1, b: 1.46, c: 0.16 },
    prompt: 'Tìm quy luật ma trận đa giác ở ô (3,3):',
    visualData: {
      type: 'nested_polygons',
      gridCorrected: [
        [{ outer: 3, inner: 3, dots: 6 }, { outer: 3, inner: 4, dots: 7 }, { outer: 3, inner: 5, dots: 8 }],
        [{ outer: 4, inner: 3, dots: 7 }, { outer: 4, inner: 4, dots: 8 }, { outer: 4, inner: 5, dots: 9 }],
        [{ outer: 5, inner: 3, dots: 8 }, { outer: 5, inner: 4, dots: 9 }, null],
      ],
      missingCell: { row: 2, col: 2 },
    },
    // Row 3: outer is always 5. Col 3: inner is always 5. Dots = 5+5=10.
    options: [
      { id: 'A', label: 'A', visual: { outer: 6, inner: 5, dots: 11 } },
      { id: 'B', label: 'B', visual: { outer: 5, inner: 5, dots: 9 } },
      { id: 'C', label: 'C', visual: { outer: 5, inner: 4, dots: 10 } },
      { id: 'D', label: 'D', visual: { outer: 5, inner: 5, dots: 10 } }, // Correct
      { id: 'E', label: 'E', visual: { outer: 4, inner: 5, dots: 9 } },
      { id: 'F', label: 'F', visual: { outer: 5, inner: 6, dots: 11 } },
    ],
    correctOptionId: 'D',
    explanation: 'Quy luật: outer theo hàng (3,4,5), inner theo cột (3,4,5), dots = outer+inner. Hàng 3 cột 3: outer=5, inner=5, dots=10 → đáp án D.',
  },

  // Q17: Logic - Mệnh đề Đảo (Senior)
  {
    id: 'q17',
    type: 'logic',
    domain: 'logic',
    difficultyTier: 2,
    irt: { a: 1.6, b: 0.86, c: 0.16 },
    prompt: 'Xác định tính chất logic của đoạn mã điều kiện:',
    visualData: {
      type: 'number_sequence',
      sequence: [
        'Mệnh đề gốc (P ∧ Q) -> R',
        'Hãy tìm Mệnh đề Đảo tương đương:'
      ]
    },
    // Contrapositive: ~R -> ~(P ∧ Q) = ~R -> (~P ∨ ~Q)
    // "Nếu Z != 1 thì X là số lẻ HOẶC Y không phải là số nguyên tố"
    options: [
      { id: 'A', label: 'Nếu Z != 1 thì X là lẻ VÀ Y không nguyên tố' },
      { id: 'B', label: 'Nếu Z == 1 thì X là chẵn VÀ Y là nguyên tố' },
      { id: 'C', label: 'Nếu Z != 1 thì X là lẻ HOẶC Y không nguyên tố' }, // Correct
      { id: 'D', label: 'Nếu X là lẻ HOẶC Y không nguyên tố thì Z != 1' },
      { id: 'E', label: 'Nếu Z == 1 thì X là lẻ HOẶC Y không nguyên tố' },
      { id: 'F', label: 'Nếu X là chẵn thì Z = 1' },
    ],
    correctOptionId: 'C',
    explanation: 'Mệnh đề đảo (Contrapositive) của (P∧Q)→R là: ¬R→¬(P∧Q) = ¬R→(¬P∨¬Q). Dịch: Nếu Z≠1 thì X là lẻ HOẶC Y không nguyên tố (C). Lưu ý: đảo phủ mệnh đề HợP (AND) thành HOẶC (OR) theo De Morgan.',
  },

  // Q18: Arithmetic - Chuỗi ma trận trừu tượng (Senior)
  {
    id: 'q18',
    type: 'math',
    domain: 'arithmetic',
    difficultyTier: 3,
    irt: { a: 1.8, b: 1.27, c: 0.16 },
    prompt: 'Tính toán giá trị ẩn trong phép biến đổi ma trận:',
    visualData: {
      type: 'matrix_equation',
      rows: [
        { x: 8, y: 4, z: 32 },
        { x: 6, y: 5, z: 30 },
        { x: 9, y: 8, z: null }, // Wait, row 3 is the question
      ],
      // Simply x * y
    },
    options: [
      { id: 'A', label: '68' },
      { id: 'B', label: '72' }, // Correct
      { id: 'C', label: '64' },
      { id: 'D', label: '81' },
      { id: 'E', label: '17' },
      { id: 'F', label: '80' },
    ],
    correctOptionId: 'B',
    explanation: 'Quy luật đơn giản: z = x × y. Hàng 1: 8×4=32✓. Hàng 2: 6×5=30✓. Hàng 3: 9×8=72 (B).',
  },

  // Q19: Algorithmic - Đệ quy (Recursion)
  {
    id: 'q19',
    type: 'logic',
    domain: 'algorithmic',
    difficultyTier: 3,
    irt: { a: 1.9, b: 1.47, c: 0.16 },
    prompt: 'PHÂN TÍCH ĐỆ QUY: Giá trị trả về của hàm f(4) là bao nhiêu?',
    visualData: {
      type: 'number_sequence',
      sequence: [
        'Hàm đệ quy f(n):',
        'if (n <= 1) return 1;',
        'return f(n-1) + 2 * f(n-2);',
        'Output của f(4) = ?'
      ]
    },
    // f(0) = 1, f(1) = 1
    // f(2) = f(1) + 2*f(0) = 1 + 2 = 3
    // f(3) = f(2) + 2*f(1) = 3 + 2 = 5
    // f(4) = f(3) + 2*f(2) = 5 + 2*3 = 11
    options: [
      { id: 'A', label: '9' },
      { id: 'B', label: '10' },
      { id: 'C', label: '11' }, // Correct
      { id: 'D', label: '13' },
      { id: 'E', label: '15' },
      { id: 'F', label: '7' },
    ],
    correctOptionId: 'C',
    explanation: 'Giải đệ quy từng bước: f(0)=1, f(1)=1. f(2)=f(1)+2×f(0)=1+2=3. f(3)=f(2)+2×f(1)=3+2=5. f(4)=f(3)+2×f(2)=5+2×3=5+6=11 (C). Lưu ý: mỗi lần gọi đệ quy phải expand toàn bộ cây gọi.',
  },

  // Q20: Spatial - Di chuyển chấm hạt (Tiêu chuẩn)
  {
    id: 'q20',
    type: 'geometry',
    domain: 'spatial',
    difficultyTier: 2,
    irt: { a: 1.2, b: 2.01, c: 0.16 },
    prompt: 'Tìm hình phù hợp điền vào ô (3,3):',
    visualData: {
      type: 'raven_matrix',
      grid: [
        [{ dotAngle: 45, lineAngle: 45 }, { dotAngle: 135, lineAngle: 45 }, { dotAngle: 225, lineAngle: 45 }],
        [{ dotAngle: 45, lineAngle: 135 }, { dotAngle: 135, lineAngle: 135 }, { dotAngle: 225, lineAngle: 135 }],
        [{ dotAngle: 45, lineAngle: 225 }, { dotAngle: 135, lineAngle: 225 }, null],
      ],
      missingCell: { row: 2, col: 2 },
    },
    // Row 3, Col 3 -> dot at 225, line at 225
    options: [
      { id: 'A', label: 'A', visual: { dotAngle: 225, lineAngle: 225 } }, // Correct
      { id: 'B', label: 'B', visual: { dotAngle: 315, lineAngle: 225 } },
      { id: 'C', label: 'C', visual: { dotAngle: 225, lineAngle: 135 } },
      { id: 'D', label: 'D', visual: { dotAngle: 135, lineAngle: 225 } },
      { id: 'E', label: 'E', visual: { dotAngle: 45, lineAngle: 315 } },
      { id: 'F', label: 'F', visual: { dotAngle: 225, lineAngle: 315 } },
    ],
    correctOptionId: 'A',
    explanation: 'Ma trận đơn giản. Theo hàng: dotAngle giữ nguyên (cột 1=45, cột 2=135, cột 3=225). Theo cột: lineAngle giữ nguyên (hàng 1=45, hàng 2=135, hàng 3=225). Ô (3,3): dot=225, line=225 (A).',
  },

  // Q21: Logic - Tối ưu hóa thuật toán
  {
    id: 'q21',
    type: 'logic',
    domain: 'algorithmic',
    difficultyTier: 3,
    irt: { a: 1.7, b: 1.92, c: 0.16 },
    prompt: 'Độ phức tạp thuật toán (Time Complexity):',
    visualData: {
      type: 'number_sequence',
      sequence: [
        'for (i = 0; i < n; i++) {',
        '   for (j = i; j < n; j++) {',
        '      // Do something',
        '   }',
        '}',
        'Số lần chạy xấp xỉ tỉ lệ với?'
      ]
    },
    options: [
      { id: 'A', label: 'n' },
      { id: 'B', label: 'n * log(n)' },
      { id: 'C', label: 'n^2 / 2' }, // Correct
      { id: 'D', label: 'n^2' },
      { id: 'E', label: '2^n' },
      { id: 'F', label: 'log(n)' },
    ],
    correctOptionId: 'C',
    explanation: 'Vòng lặp trong: j bắt đầu từ i, không phải từ 0. Số phần tử xử lý: khi i=0 có n lần, i=1 có n-1 lần... Tổng = n+(n-1)+...+1 = n(n+1)/2 ≈ n²/2. Đãp án C. (Khác n² vì j bắt đầu từ i, không phải 0).',
  },
  // ==========================================
  // PHẦN 3: CẤU TRÚC DỮ LIỆU, TOÁN HỌC PHỨC HỢP & LOGIC HỆ THỐNG (Q22 - Q38)
  // ==========================================

  // Q22: Arithmetic - Dãy số lũy thừa tự thân (Tier 2)
  {
    id: 'q22',
    type: 'math',
    domain: 'arithmetic',
    difficultyTier: 2,
    irt: { a: 1.3, b: -0.05, c: 0.16 },
    prompt: 'Tìm số tiếp theo trong dãy số lũy thừa:',
    visualData: { type: 'number_sequence', sequence: [1, 4, 27, 256, "?"] },
    options: [
      { id: 'A', label: '1024' },
      { id: 'B', label: '3125' }, // Correct (5^5)
      { id: 'C', label: '625' },
      { id: 'D', label: '4096' },
      { id: 'E', label: '1296' },
      { id: 'F', label: '512' },
    ],
    correctOptionId: 'B',
    explanation: 'Dãy: 1¹=1, 2²=4, 3³=27, 4⁴=256, 5⁵=3125. Quy luật: phần tử thứ n = nⁿ. Số tiếp theo là 5⁵ = 3125 (B).',
  },

  // Q23: Spatial - Raven Matrix biến thể nhảy cóc (Tier 2)
  {
    id: 'q23',
    type: 'geometry',
    domain: 'spatial',
    difficultyTier: 2,
    irt: { a: 1.2, b: 0.87, c: 0.16 },
    prompt: 'Tìm hình phù hợp điền vào ô (3,3):',
    visualData: {
      type: 'raven_matrix',
      grid: [
        [{ dotAngle: 0, lineAngle: 135 }, { dotAngle: 90, lineAngle: 135 }, { dotAngle: 180, lineAngle: 135 }],
        [{ dotAngle: 90, lineAngle: 135 }, { dotAngle: 180, lineAngle: 135 }, { dotAngle: 270, lineAngle: 135 }],
        [{ dotAngle: 180, lineAngle: 135 }, { dotAngle: 270, lineAngle: 135 }, null],
      ],
      missingCell: { row: 2, col: 2 },
    },
    options: [
      { id: 'A', label: 'A', visual: { dotAngle: 0, lineAngle: 135 } }, // Correct (360=0)
      { id: 'B', label: 'B', visual: { dotAngle: 90, lineAngle: 135 } },
      { id: 'C', label: 'C', visual: { dotAngle: 180, lineAngle: 135 } },
      { id: 'D', label: 'D', visual: { dotAngle: 270, lineAngle: 45 } },
      { id: 'E', label: 'E', visual: { dotAngle: 0, lineAngle: 45 } },
      { id: 'F', label: 'F', visual: { dotAngle: 315, lineAngle: 135 } },
    ],
    correctOptionId: 'A',
    explanation: 'Theo hàng: dotAngle tăng 90° (hàng 1: 0,90,180; hàng 2: 90,180,270; hàng 3: 180,270,?). lineAngle luôn = 135°. Ô (3,3): dot=270+90=360=0°, line=135° → đáp án A.',
  },

  // Q24: Logic - Suy luận Tam đoạn luận (Tier 2)
  {
    id: 'q24',
    type: 'logic',
    domain: 'logic',
    difficultyTier: 2,
    irt: { a: 1.1, b: 0.87, c: 0.16 },
    prompt: 'Dựa vào các tiền đề, kết luận nào sau đây chắc chắn đúng?',
    visualData: {
      type: 'number_sequence',
      sequence: [
        'Tiền đề 1: Tất cả Lập trình viên đều biết gõ phím.',
        'Tiền đề 2: Một số người thích chơi game là Lập trình viên.',
        'Vậy suy ra:'
      ]
    },
    options: [
      { id: 'A', label: 'Mọi người thích chơi game đều biết gõ phím' },
      { id: 'B', label: 'Một số người biết gõ phím thích chơi game' }, // Correct
      { id: 'C', label: 'Tất cả người biết gõ phím là Lập trình viên' },
      { id: 'D', label: 'Người không thích chơi game không biết gõ phím' },
      { id: 'E', label: 'Lập trình viên không thích chơi game' },
      { id: 'F', label: 'Không có kết luận nào đúng' },
    ],
    correctOptionId: 'B',
    explanation: 'Tam đoạn luận: Tất cả LTV biết gõ phím (tiền đề 1). Một số game thủ là LTV (tiền đề 2) → một số game thủ biết gõ phím. Đảo lại: một số người biết gõ phím thích chơi game (B). A sai vì chỉ “một số” game thủ là LTV, không phải tất cả.',
  },

  // Q25: Algorithmic - Tracing State Machine (Tier 2)
  {
    id: 'q25',
    type: 'logic',
    domain: 'algorithmic',
    difficultyTier: 1,
    irt: { a: 1.4, b: -1.17, c: 0.16 },
    prompt: 'PHÂN TÍCH TRẠNG THÁI: Trạng thái cuối cùng của hệ thống là gì?',
    visualData: {
      type: 'number_sequence',
      sequence: [
        'Trạng thái ban đầu: S0',
        'Chuỗi sự kiện đầu vào: [1, 0, 1, 1, 0]',
        'Quy tắc chuyển:',
        'S0 + 1 -> S1 | S0 + 0 -> S0',
        'S1 + 1 -> S1 | S1 + 0 -> S2',
        'S2 + 1 -> S0 | S2 + 0 -> S1',
        'Trạng thái cuối = ?'
      ]
    },
    // Trace: S0 -(1)-> S1 -(0)-> S2 -(1)-> S0 -(1)-> S1 -(0)-> S2
    options: [
      { id: 'A', label: 'S0' },
      { id: 'B', label: 'S1' },
      { id: 'C', label: 'S2' }, // Correct
      { id: 'D', label: 'Lỗi hệ thống' },
      { id: 'E', label: 'Không xác định' },
      { id: 'F', label: 'Quay lại S0' },
    ],
    correctOptionId: 'C',
    explanation: 'Trace tầng bước: S0→(1)→S1→(0)→S2→(1)→S0→(1)→S1→(0)→S2. Kết quả cuối cùng là S2 (C). Mẹo: đọc quy tắc chuyển từng sự kiện một cách tuần tự, không nhảy cóc.',
  },

  // Q26: Arithmetic - Dãy số nguyên tố đan xen (Tier 3)
  {
    id: 'q26',
    type: 'math',
    domain: 'arithmetic',
    difficultyTier: 2,
    irt: { a: 1.6, b: 1.02, c: 0.16 },
    prompt: 'Tìm số tiếp theo trong dãy số bảo mật (mật mã học cơ bản):',
    visualData: { type: 'number_sequence', sequence: [4, 6, 10, 14, 22, 26, "?"] },
    // Next prime is 17. 17 * 2 = 34.
    options: [
      { id: 'A', label: '30' },
      { id: 'B', label: '32' },
      { id: 'C', label: '34' }, // Correct
      { id: 'D', label: '38' },
      { id: 'E', label: '28' },
      { id: 'F', label: '36' },
    ],
    correctOptionId: 'C',
    explanation: 'Dãy: mỗi số = 2 × số nguyên tố tương ứng. Các số nguyên tố liên tiếp: 2,3,5,7,11,13,17... Dãy dữ liệu: 4=2×2, 6=2×3, 10=2×5, 14=2×7, 22=2×11, 26=2×13. Tiếp theo: 2×17=34 (C).',
  },

  // Q27: Spatial - Trừu tượng hóa ảnh Inverse XOR (Tier 3)
  {
    id: 'q27',
    type: 'geometry',
    domain: 'spatial',
    difficultyTier: 3,
    irt: { a: 1.8, b: 2.41, c: 0.16 },
    prompt: 'Tìm Cột 3 với quy luật ĐẢO NGƯỢC XOR (XNOR):',
    visualData: {
      type: 'xor_shapes',
      rows: [
        {
          col1: { top: true, right: false, bottom: false, left: true },
          col2: { top: false, right: false, bottom: true, left: true },
          col3: null, // XNOR: top(1,0)->0(Trắng), right(0,0)->1(Đen), bottom(0,1)->0, left(1,1)->1
        },
        {
          col1: { top: false, right: true, bottom: true, left: false },
          col2: { top: true, right: true, bottom: false, left: false },
          col3: { top: false, right: true, bottom: false, left: true },
        },
        {
          col1: { top: true, right: false, bottom: true, left: true },
          col2: { top: false, right: true, bottom: true, left: false },
          col3: { top: false, right: false, bottom: true, left: false },
        },
      ],
      missingCell: { row: 0, col: 2 },
    },
    // Row 1 XNOR: top(T,F)->F(White), right(F,F)->T(Black), bottom(F,T)->F(White), left(T,T)->T(Black)
    options: [
      { id: 'A', label: 'A', visual: { top: false, right: true, bottom: false, left: true } }, // Correct
      { id: 'B', label: 'B', visual: { top: true, right: false, bottom: true, left: false } },
      { id: 'C', label: 'C', visual: { top: false, right: false, bottom: false, left: false } },
      { id: 'D', label: 'D', visual: { top: true, right: true, bottom: true, left: true } },
      { id: 'E', label: 'E', visual: { top: true, right: true, bottom: false, left: false } },
      { id: 'F', label: 'F', visual: { top: false, right: true, bottom: true, left: false } },
    ],
    correctOptionId: 'A',
    explanation: 'XNOR (NOT XOR): cho kết quả 1 khi hai bit GIỐNG nhau. Hàng 1: top(T,F)→F, right(F,F)→T (đen), bottom(F,T)→F, left(T,T)→T (đen) → {F,T,F,T} = đáp án A.',
  },

  // Q28: Algorithmic - Tracing Duyệt Cây (Tier 3)
  {
    id: 'q28',
    type: 'logic',
    domain: 'algorithmic',
    difficultyTier: 2,
    irt: { a: 1.9, b: 1.24, c: 0.16 },
    prompt: 'PHÂN TÍCH CẤU TRÚC: Duyệt cây nhị phân theo thứ tự In-order.',
    visualData: {
      type: 'number_sequence',
      sequence: [
        'Cây Nhị Phân Tìm Kiếm (BST):',
        '          5          ',
        '        /   \\        ',
        '       3     8       ',
        '      / \\   / \\      ',
        '     1   4 6   9     ',
        'Kết quả in ra khi duyệt In-Order (Left-Root-Right)?'
      ]
    },
    options: [
      { id: 'A', label: '5, 3, 1, 4, 8, 6, 9' },
      { id: 'B', label: '1, 3, 4, 5, 6, 8, 9' }, // Correct
      { id: 'C', label: '1, 4, 3, 6, 9, 8, 5' },
      { id: 'D', label: '9, 8, 6, 5, 4, 3, 1' },
      { id: 'E', label: '5, 8, 9, 6, 3, 4, 1' },
      { id: 'F', label: '1, 4, 6, 9, 3, 8, 5' },
    ],
    correctOptionId: 'B',
    explanation: 'In-Order (Left-Root-Right): Truy cập cây con trái rồi gốc rồi cây con phải. Kết quả: [1] (cây con trái của 3) → 3 → [4] → 5 (gốc) → [6] → 8 → [9] = 1,3,4,5,6,8,9 (B). Đây là thứ tự tăng dần trong BST.',
  },

  // Q29: Arithmetic - Ma trận tổng chéo (Tier 3)
  {
    id: 'q29',
    type: 'math',
    domain: 'arithmetic',
    difficultyTier: 2,
    irt: { a: 1.5, b: 0.78, c: 0.16 },
    prompt: 'Tìm số điền vào dấu (?) trong hệ ma trận:',
    visualData: {
      type: 'matrix_equation',
      rows: [
        { x: 4, y: 6, z: 12 },
        { x: 10, y: 5, z: 25 },
        { x: 8, y: 9, z: null }, // 8*9 / 2 = 36
      ],
    },
    options: [
      { id: 'A', label: '36' }, // Correct
      { id: 'B', label: '34' },
      { id: 'C', label: '72' },
      { id: 'D', label: '40' },
      { id: 'E', label: '17' },
      { id: 'F', label: '38' },
    ],
    correctOptionId: 'A',
    explanation: 'Quy luật: z = (x × y) / 2. Hàng 1: (4×6)/2=12✓. Hàng 2: (10×5)/2=25✓. Hàng 3: (8×9)/2=72/2=36 (A).',
  },

  // Q30: Spatial - Biến đổi đa giác Nested (Tier 3)
  {
    id: 'q30',
    type: 'geometry',
    domain: 'spatial',
    difficultyTier: 2,
    irt: { a: 1.7, b: 0.92, c: 0.16 },
    prompt: 'Tìm quy luật ma trận đa giác lồng nhau ô (3,3):',
    visualData: {
      type: 'nested_polygons',
      gridCorrected: [
        [{ outer: 6, inner: 3, dots: 9 }, { outer: 5, inner: 3, dots: 8 }, { outer: 4, inner: 3, dots: 7 }],
        [{ outer: 6, inner: 4, dots: 10 }, { outer: 5, inner: 4, dots: 9 }, { outer: 4, inner: 4, dots: 8 }],
        [{ outer: 6, inner: 5, dots: 11 }, { outer: 5, inner: 5, dots: 10 }, null],
      ],
      missingCell: { row: 2, col: 2 },
    },
    // Row 3: outer goes 6->5->4. Col 3: inner goes 3->4->5. Dots = 4+5 = 9.
    options: [
      { id: 'A', label: 'A', visual: { outer: 4, inner: 5, dots: 9 } }, // Correct
      { id: 'B', label: 'B', visual: { outer: 3, inner: 6, dots: 9 } },
      { id: 'C', label: 'C', visual: { outer: 4, inner: 6, dots: 10 } },
      { id: 'D', label: 'D', visual: { outer: 5, inner: 4, dots: 9 } },
      { id: 'E', label: 'E', visual: { outer: 4, inner: 4, dots: 8 } },
      { id: 'F', label: 'F', visual: { outer: 3, inner: 5, dots: 8 } },
    ],
    correctOptionId: 'A',
    explanation: 'Theo hàng: outer giảm 1 (6→5→4). Theo cột: inner tăng 1 (3→4→5). dots = outer + inner. Ô (3,3): outer=4, inner=5, dots=9 (A).',
  },

  // Q31: Logic - Hiệp sĩ và Kẻ lừa dối (Tier 3)
  {
    id: 'q31',
    type: 'logic',
    domain: 'logic',
    difficultyTier: 2,
    irt: { a: 1.8, b: 0.71, c: 0.16 },
    prompt: 'PHÂN TÍCH MỆNH ĐỀ: Ai là người nói thật?',
    visualData: {
      type: 'number_sequence',
      sequence: [
        'Server A log: "Server B đang chết."',
        'Server B log: "Server C đang chết."',
        'Server C log: "Cả A và B đều chết."',
        'Chỉ có 1 Server trả về Log đúng. Đó là?'
      ]
    },
    // Giả sử A thật -> B chết (sai), C chết (sai). Nếu C sai -> "A và B chết" sai -> Đúng vì A đang sống. Hợp lý.
    // Thử B thật -> B sống, A chết (sai), C chết (sai). Nếu A sai -> B sống -> mâu thuẫn vì A nói B chết mà A sai tức là B sống (chuẩn). Nhưng nếu C chết(sai) -> "A và B chết" sai -> Chuẩn vì B sống. Có vẻ hợp lý? Wait. Bài toán Knights/Knaves.
    // Log C: "Cả A và B chết". Nếu C thật -> A chết, B chết. => A sai, B sai. A nói B chết (mà B chết thật) => A nói thật => Mâu thuẫn (chỉ 1 thật).
    // Nếu B thật -> C chết. A nói B chết (sai, vì B thật). C nói "A và B chết" (sai, vì B thật). Điều kiện khớp! => B là người nói thật.
    options: [
      { id: 'A', label: 'Server A' },
      { id: 'B', label: 'Server B' }, // Correct
      { id: 'C', label: 'Server C' },
      { id: 'D', label: 'Không có Server nào' },
      { id: 'E', label: 'Tất cả đều nói thật' },
      { id: 'F', label: 'Dữ liệu vòng lặp vô hạn' },
    ],
    correctOptionId: 'B',
    explanation: 'Thử giả thiết B nói thật: B sống → C chết (B nói). A nói "B chết" → sai. C nói "A và B chết" → sai (vì B đang sống). Điều kiện khớp: đúng chính xác 1 server nói thật (B). Thử giả thiết A hoặc C nói thật đều dẫn đến mâu thuẫn.',
  },

  // Q32: Algorithmic - Tracing Stack (Tier 3)
  {
    id: 'q32',
    type: 'logic',
    domain: 'algorithmic',
    difficultyTier: 3,
    irt: { a: 1.9, b: 1.24, c: 0.16 },
    prompt: 'PHÂN TÍCH BỘ NHỚ: Giá trị nào bị lấy ra cuối cùng (Pop)?',
    visualData: {
      type: 'number_sequence',
      sequence: [
        'Khởi tạo Stack S rỗng.',
        '1. Push(5), Push(8), Push(3)',
        '2. Pop()',
        '3. Push(2)',
        '4. Pop()',
        '5. Pop()',
        'Giá trị của lần Pop() cuối cùng là?'
      ]
    },
    // Tracing:
    // [5, 8, 3] -> Pop() -> lấy 3. Stack = [5, 8]
    // Push(2) -> Stack = [5, 8, 2]
    // Pop() -> lấy 2. Stack = [5, 8]
    // Pop() -> lấy 8. Stack = [5]
    // Lần Pop cuối cùng ở bước 5 lấy ra 8.
    options: [
      { id: 'A', label: '5' },
      { id: 'B', label: '8' }, // Correct
      { id: 'C', label: '3' },
      { id: 'D', label: '2' },
      { id: 'E', label: 'Stack rỗng' },
      { id: 'F', label: 'Lỗi tràn bộ nhớ' },
    ],
    correctOptionId: 'B',
    explanation: 'Trace Stack (LIFO): Push(5,8,3) → [5,8,3]. Pop() lấy 3 → Stack=[5,8]. Push(2) → [5,8,2]. Pop() lấy 2 → [5,8]. Pop() lấy 8 (lần cuối cùng) → đáp án B. Stack luôn lấy phần tử được thêm vào gần nhất (Last-In-First-Out).',
  },

  // Q33: Arithmetic - Modulo số dư (Tier 3)
  {
    id: 'q33',
    type: 'math',
    domain: 'arithmetic',
    difficultyTier: 3,
    irt: { a: 1.4, b: 1.99, c: 0.16 },
    prompt: 'Tìm số dư trong phép tính phân tán (Modulo):',
    visualData: {
      type: 'number_sequence',
      sequence: [
        'Hệ thống phân tải Hash Ring:',
        'Node = (ID^3 + 5) % 7',
        'Nếu ID = 4, request sẽ chạy vào Node số mấy?'
      ]
    },
    // 4^3 = 64. 64 + 5 = 69. 69 % 7 = 6 (7*9 = 63, dư 6)
    options: [
      { id: 'A', label: '2' },
      { id: 'B', label: '4' },
      { id: 'C', label: '5' },
      { id: 'D', label: '6' }, // Correct
      { id: 'E', label: '1' },
      { id: 'F', label: '0' },
    ],
    correctOptionId: 'D',
    explanation: 'Bước 1: 4³ = 64. Bước 2: 64 + 5 = 69. Bước 3: 69 % 7 = ? Tính: 7×9=63, 69-63=6. Vậy Node = 6 (D). Đây là thuật toán Consistent Hashing trong hệ thống phân tán.',
  },

  // Q34: Spatial - Ma trận góc pha (Tier 3)
  {
    id: 'q34',
    type: 'geometry',
    domain: 'spatial',
    difficultyTier: 2,
    irt: { a: 1.8, b: 1.05, c: 0.16 },
    prompt: 'Tìm hình điền vào ô (3,3):',
    visualData: {
      type: 'raven_matrix',
      grid: [
        [{ dotAngle: 0, lineAngle: 0 }, { dotAngle: 0, lineAngle: 135 }, { dotAngle: 0, lineAngle: 270 }],
        [{ dotAngle: 0, lineAngle: 45 }, { dotAngle: 0, lineAngle: 180 }, { dotAngle: 0, lineAngle: 315 }],
        [{ dotAngle: 0, lineAngle: 90 }, { dotAngle: 0, lineAngle: 225 }, null],
      ],
      missingCell: { row: 2, col: 2 },
    },
    // 225 + 135 = 360 = 0
    options: [
      { id: 'A', label: 'A', visual: { dotAngle: 0, lineAngle: 0 } }, // Correct
      { id: 'B', label: 'B', visual: { dotAngle: 0, lineAngle: 90 } },
      { id: 'C', label: 'C', visual: { dotAngle: 90, lineAngle: 0 } },
      { id: 'D', label: 'D', visual: { dotAngle: 0, lineAngle: 135 } },
      { id: 'E', label: 'E', visual: { dotAngle: 45, lineAngle: 270 } },
      { id: 'F', label: 'F', visual: { dotAngle: 0, lineAngle: 180 } },
    ],
    correctOptionId: 'A',
    explanation: 'dotAngle luôn = 0° trong toàn bộ mạ. lineAngle theo mẫu: cột 1 +45°, cột 2 +45° → {0,45,90} hàng 1; {45,90,135} hàng 1... Nhận thấy: line = 45° × (hàng + cột) % 360. Hàng 3, cột 3: (2+2)×45 = 180°? Kiểm lại: cột 3 của mỗi hàng: 270°, 315°, ? → +45° → 360=0°. đáp án A (lineAngle=0°).',
  },

  // Q35: Algorithmic - Bubble Sort (Tier 3)
  {
    id: 'q35',
    type: 'logic',
    domain: 'algorithmic',
    difficultyTier: 2,
    irt: { a: 1.7, b: -0.44, c: 0.16 },
    prompt: 'PHÂN TÍCH THUẬT TOÁN: Có bao nhiêu lần hoán đổi (Swap) xảy ra?',
    visualData: {
      type: 'number_sequence',
      sequence: [
        'Mảng đầu vào: [4, 2, 5, 1, 3]',
        'Sắp xếp tăng dần bằng Bubble Sort.',
        'Tổng số lệnh Swap thực thi = ?'
      ]
    },
    // [4, 2, 5, 1, 3] -> swap(4,2) -> [2,4,5,1,3] -> swap(5,1) -> [2,4,1,5,3] -> swap(5,3) -> [2,4,1,3,5] (3 swaps)
    // Pass 2: [2,4,1,3,5] -> swap(4,1) -> [2,1,4,3,5] -> swap(4,3) -> [2,1,3,4,5] (2 swaps)
    // Pass 3: [2,1,3,4,5] -> swap(2,1) -> [1,2,3,4,5] (1 swap)
    // Total = 3 + 2 + 1 = 6 swaps.
    options: [
      { id: 'A', label: '4' },
      { id: 'B', label: '5' },
      { id: 'C', label: '6' }, // Correct
      { id: 'D', label: '7' },
      { id: 'E', label: '8' },
      { id: 'F', label: '10' },
    ],
    correctOptionId: 'C',
    explanation: 'Pass 1 [4,2,5,1,3]: swap(4→2)=1, skip(2↔5), swap(5→1)=2, swap(5→3)=3. Tổng: 3 swaps. Pass 2 [2,4,1,3,5]: swap(4→1)=1, swap(4→3)=2. Tổng: 2. Pass 3 [2,1,3,4,5]: swap(2→1)=1. Tổng: 1. Tỵng cộng: 3+2+1 = 6 (C).',
  },

  // Q36: Arithmetic - Tổ hợp xác suất (Tier 3)
  {
    id: 'q36',
    type: 'math',
    domain: 'arithmetic',
    difficultyTier: 2,
    irt: { a: 1.6, b: 0.10, c: 0.16 },
    prompt: 'Toán rời rạc: Tính số lượng Subnet tối đa.',
    visualData: {
      type: 'number_sequence',
      sequence: [
        'Có N = 4 bit dành cho Subnet ID.',
        'Số lượng Mạng Con (Subnet) tối đa được tạo ra là bao nhiêu?',
        '(Không trừ mạng gốc và broadcast)'
      ]
    },
    // 2^4 = 16
    options: [
      { id: 'A', label: '4' },
      { id: 'B', label: '8' },
      { id: 'C', label: '16' }, // Correct
      { id: 'D', label: '32' },
      { id: 'E', label: '14' },
      { id: 'F', label: '64' },
    ],
    correctOptionId: 'C',
    explanation: 'Với N bit subnet, số subnet tối đa = 2Ἷ tổ hợp. N=4 → 2⁴ = 16. Đáp án C. (14 là trường hợp xem xét mạng giao thức cũ RFC 950 trừ 2 mạng đặc biệt).',
  },

  // Q37: Spatial - Phép dịch bit trên ma trận (Tier 3)
  {
    id: 'q37',
    type: 'geometry',
    domain: 'spatial',
    difficultyTier: 1,
    irt: { a: 1.8, b: -1.94, c: 0.16 },
    prompt: 'Tìm Cột 3 với quy luật Dịch phải (Right Shift):',
    visualData: {
      type: 'xor_shapes',
      rows: [
        {
          col1: { top: false, right: false, bottom: false, left: true }, // left is black
          col2: { top: true, right: false, bottom: false, left: false }, // top is black
          col3: null,
        },
        {
          col1: { top: false, right: true, bottom: false, left: false },
          col2: { top: false, right: false, bottom: true, left: false },
          col3: { top: false, right: false, bottom: false, left: true },
        },
        {
          col1: { top: true, right: true, bottom: true, left: true }, // 1111
          col2: { top: true, right: true, bottom: true, left: true }, // 1111
          col3: { top: true, right: true, bottom: true, left: true },
        },
      ],
      missingCell: { row: 0, col: 2 },
    },
    // Dịch phải (Clockwise theo góc): Left -> Top -> Right -> Bottom -> Left.
    // Hàng 1, Cột 1: Left. Cột 2: Top. => Cột 3 sẽ là Right.
    options: [
      { id: 'A', label: 'A', visual: { top: false, right: true, bottom: false, left: false } }, // Correct
      { id: 'B', label: 'B', visual: { top: false, right: false, bottom: true, left: false } },
      { id: 'C', label: 'C', visual: { top: true, right: false, bottom: false, left: false } },
      { id: 'D', label: 'D', visual: { top: false, right: false, bottom: false, left: true } },
      { id: 'E', label: 'E', visual: { top: true, right: true, bottom: false, left: false } },
      { id: 'F', label: 'F', visual: { top: false, right: false, bottom: false, left: false } },
    ],
    correctOptionId: 'A',
    explanation: 'Dịch phải theo chiều kim đồng hồ: Left→Top→Right→Bottom. Hàng 1: C1=Left(đen), C2=Top(đen). Vậy C3 tiếp theo là Right(đen) → {top:F, right:T, bottom:F, left:F} = đáp án A.',
  },

  // Q38: Logic - Tính toàn vẹn Transaction (Tier 3)
  {
    id: 'q38',
    type: 'logic',
    domain: 'logic',
    difficultyTier: 3,
    irt: { a: 1.9, b: 1.64, c: 0.16 },
    prompt: 'PHÂN TÍCH DATABASE: Giá trị cuối cùng của Balance là bao nhiêu?',
    visualData: {
      type: 'number_sequence',
      sequence: [
        'BEGIN TRANSACTION',
        '  Balance = Balance - 20',
        '  SAVEPOINT SP1',
        '  Balance = Balance + 50',
        '  ROLLBACK TO SP1',
        '  Balance = Balance + 10',
        'COMMIT',
        'Balance = ?'
      ]
    },
    // Init: 100
    // Bal - 20 = 80 (SP1 lưu lại 80)
    // Bal + 50 = 130
    // Rollback SP1 -> Quay về 80.
    // Bal + 10 = 90.
    options: [
      { id: 'A', label: '140' },
      { id: 'B', label: '100' },
      { id: 'C', label: '130' },
      { id: 'D', label: '80' },
      { id: 'E', label: '90' }, // Correct
      { id: 'F', label: '120' },
    ],
    correctOptionId: 'E',
    explanation: 'Trace từng dòng (giả sử Balance=100): -20→80. SAVEPOINT SP1 lưu Balance=80. +50→130. ROLLBACK TO SP1 → quay về 80. +10→90. COMMIT chấp nhận giá trị 90. SAVEPOINT chỉ khôi phục về điểm lưu, không phủ nhận toàn bộ giao dịch (E).',
  },
  // ==========================================
  // TẦNG 4: THIÊN TÀI (CHỈ CÓ 2 CÂU DUY NHẤT)
  // Hai câu này có độ phân biệt (a) cực cao, độ khó (b) tiệm cận 3.0
  // Nếu làm đúng, điểm năng lực Theta sẽ bùng nổ, đưa ứng viên vào top 1%.
  // ==========================================

  // Q39 (Thiên Tài 1): Algorithmic - Tracing Sơ đồ khối (Hộp Đen)
  {
    id: 'q39',
    type: 'logic',
    domain: 'algorithmic',
    difficultyTier: 4,
    irt: { a: 2.8, b: 2.41, c: 0.05 }, // a cực cao, c rất thấp (khó đoán mò)
    prompt: 'PHÂN TÍCH HỘP ĐEN: Cho một hàm f(x, y, z) xử lý mảng đầu vào [14, 5, 9]. Tính giá trị Output (z) cuối cùng.',
    visualData: {
      type: 'number_sequence',
      sequence: ['Input: [14, 5, 9]', 'Step 1: if(x>y) swap(x,y)', 'Step 2: z = (x+y) ⊕ z', 'Step 3: y = y & x', 'Step 4: z = z - y', 'Output = ?'],
    },
    options: [
      { id: 'A', label: '26' },
      { id: 'B', label: '18' },
      { id: 'C', label: '22' }, // Correct: x=5, y=14. x+y=19. 19 XOR 9 = 26. y = 14 & 5 = 4. z = 26 - 4 = 22.
      { id: 'D', label: '15' },
      { id: 'E', label: '19' },
      { id: 'F', label: '28' },
    ],
    correctOptionId: 'C',
    explanation: 'Step 1: x=14,y=5 → x>y nên swap → x\'=5, y\'=14. Step 2: z = (5+14) ⊕ 9 = 19 ⊕ 9. Nhị phân: 10011 ⊕ 01001 = 11010 = 26. Step 3: y = 14 & 5 = 01110 & 00101 = 00100 = 4. Step 4: z = 26 - 4 = 22 (C).',
  },

  // Q40 (Thiên Tài 2): Spatial - Ma trận Raven Không gian đa chiều
  {
    id: 'q40',
    type: 'geometry',
    domain: 'spatial',
    difficultyTier: 4,
    irt: { a: 3.0, b: 1.09, c: 0.1 }, // Đỉnh cao của độ khó
    prompt: 'MA TRẬN ĐA CHIỀU: Tìm hình điền vào ô trống (3,3) dựa trên 3 quy luật hình học vận hành đồng thời.',
    visualData: {
      type: 'raven_matrix',
      grid: [
        [{ dotAngle: 45, lineAngle: 45 }, { dotAngle: 90, lineAngle: 135 }, { dotAngle: 180, lineAngle: 225 }],
        [{ dotAngle: 90, lineAngle: 90 }, { dotAngle: 180, lineAngle: 270 }, { dotAngle: 0, lineAngle: 90 }],
        [{ dotAngle: 180, lineAngle: 180 }, { dotAngle: 0, lineAngle: 180 }, null],
      ],
      missingCell: { row: 2, col: 2 },
    },
    // Ghi chú giải: Theo ma trận nhân đôi góc xoay, cột 3 hàng 3 sẽ là 0 * 2 = 0 độ hoặc 180 * 2 = 360 (0 độ). 
    // Góc Line là xoay chéo +45, +90, +135.
    options: [
      { id: 'A', label: 'A', visual: { dotAngle: 90, lineAngle: 0 } },
      { id: 'B', label: 'B', visual: { dotAngle: 0, lineAngle: 315 } },
      { id: 'C', label: 'C', visual: { dotAngle: 180, lineAngle: 90 } },
      { id: 'D', label: 'D', visual: { dotAngle: 0, lineAngle: 270 } }, // Correct
      { id: 'E', label: 'E', visual: { dotAngle: 45, lineAngle: 180 } },
      { id: 'F', label: 'F', visual: { dotAngle: 180, lineAngle: 135 } },
    ],
    correctOptionId: 'D',
    explanation: 'Quy luật: dotAngle nhân đôi theo hàng (45→90→180→0). Với hàng 3: dot=0°. lineAngle cột 3 mỗi hàng: 225°, 90°... theo quy luật xoáy: hàng 3 cột 3 = 270°. đáp án D (dot=0°, line=270°).',
  },

  // ==========================================
  // HÌNH HỌC KHÔNG GIAN & LÝ THUYẾT ĐỒ THỊ (Q41 - Q44)
  // ==========================================

  // Q41: Hình học không gian — Định lý Euler về đa diện (Tier 2)
  {
    id: 'q41',
    type: 'geometry',
    domain: 'spatial',
    difficultyTier: 2,
    irt: { a: 1.3, b: -0.2, c: 0.16 },
    prompt: 'ĐA DIỆN HỌC: Áp dụng công thức Euler V − E + F = 2. Tìm số cạnh (E) của hình lăng trụ ngũ giác đứng.',
    visualData: {
      type: 'number_sequence',
      sequence: [
        '📦 Hình Lăng Trụ Ngũ Giác (Pentagonal Prism):',
        'Gồm 2 mặt đáy ngũ giác + 5 mặt bên hình chữ nhật',
        '─────────────────────────────',
        'V (Đỉnh) = 2 × 5 = 10',
        'F (Mặt)  = 5 + 2 = 7',
        '─────────────────────────────',
        'Công thức Euler: V − E + F = 2',
        'Tìm E (số cạnh) = ?',
      ],
    },
    // V - E + F = 2 → 10 - E + 7 = 2 → E = 15
    options: [
      { id: 'A', label: '10' },
      { id: 'B', label: '12' },
      { id: 'C', label: '13' },
      { id: 'D', label: '14' },
      { id: 'E', label: '15' }, // Correct
      { id: 'F', label: '18' },
    ],
    correctOptionId: 'E',
    explanation: 'Công thức Euler: V − E + F = 2. V=10 (đỉnh), F=7 (mặt). Vậy E = V + F - 2 = 10 + 7 - 2 = 15 cạnh (E). Có thể đếm trực tiếp: 5+5+5=15.',
  },

  // Q42: Hình học không gian — Cắt mặt phẳng khối lập phương (Tier 3)
  {
    id: 'q42',
    type: 'geometry',
    domain: 'spatial',
    difficultyTier: 3,
    irt: { a: 1.7, b: 1.35, c: 0.16 },
    prompt: 'HÌNH HỌC KHÔNG GIAN: Một mặt phẳng cắt qua khối lập phương qua 3 điểm giữa của 3 cạnh không cùng mặt. Thiết diện tạo thành là hình gì?',
    visualData: {
      type: 'number_sequence',
      sequence: [
        '🧊 Khối Lập Phương — Cắt Mặt Phẳng:',
        '─────────────────────────────',
        'Điểm M: giữa cạnh AB (mặt trên)',
        'Điểm N: giữa cạnh CD (mặt trước)',
        'Điểm P: giữa cạnh EF (mặt bên phải)',
        '─────────────────────────────',
        'Ba điểm M, N, P không cùng nằm trên',
        'một mặt của khối lập phương.',
        'Thiết diện MNP là hình gì?',
      ],
    },
    // Cắt qua 3 điểm giữa của 3 cạnh không song song, đối xứng → tam giác đều
    options: [
      { id: 'A', label: 'Tam giác thường' },
      { id: 'B', label: 'Tam giác đều' }, // Correct
      { id: 'C', label: 'Hình vuông' },
      { id: 'D', label: 'Hình chữ nhật' },
      { id: 'E', label: 'Lục giác đều' },
      { id: 'F', label: 'Hình thang' },
    ],
    correctOptionId: 'B',
    explanation: 'Khi mặt phẳng cắt qua 3 điểm giữa của 3 cạnh song song từng đôi một (thuộc 3 cặp mặt đối diện), thiết diện tạo thành tam giác đều. Các cạnh bằng nhau vì mỗi cạnh là đường trung bình của mặt vuông cạnh 1 (= √2/2). Đáp án B.',
  },

  // Q43: Lý thuyết đồ thị — Điều kiện tồn tại Euler Path (Tier 2)
  {
    id: 'q43',
    type: 'logic',
    domain: 'algorithmic',
    difficultyTier: 2,
    irt: { a: 1.4, b: 0.1, c: 0.16 },
    prompt: 'LÝ THUYẾT ĐỒ THỊ: Đồ thị nào SAU ĐÂY có thể vẽ được một đường đi qua mỗi cạnh đúng một lần (Euler Path)?',
    visualData: {
      type: 'number_sequence',
      sequence: [
        '📊 Định lý Euler về Euler Path:',
        'Đồ thị vô hướng liên thông có Euler Path',
        'khi và chỉ khi có đúng 0 hoặc 2 đỉnh bậc lẻ.',
        '─────────────────────────────',
        'Đồ thị A: Bậc đỉnh: [2, 2, 4, 4]       → ? đỉnh lẻ',
        'Đồ thị B: Bậc đỉnh: [1, 2, 3, 4]       → ? đỉnh lẻ',
        'Đồ thị C: Bậc đỉnh: [2, 3, 3, 4, 4]    → ? đỉnh lẻ',
        'Đồ thị D: Bậc đỉnh: [1, 3, 3, 3]       → ? đỉnh lẻ',
        '─────────────────────────────',
        'Đồ thị nào có Euler Path?',
      ],
    },
    // A: 0 đỉnh lẻ → Euler Circuit (có) ✓; B: 2 đỉnh lẻ (1,3) → có EP ✓
    // C: 2 đỉnh lẻ (3,3) → có EP ✓; D: 4 đỉnh lẻ → không có
    // Câu hỏi "đồ thị nào": B có 2 đỉnh lẻ (bậc 1 và 3) → Euler Path ✓
    options: [
      { id: 'A', label: 'Chỉ đồ thị A' },
      { id: 'B', label: 'Chỉ đồ thị D' },
      { id: 'C', label: 'Đồ thị A và B' },
      { id: 'D', label: 'Đồ thị B và C' }, // Correct (2 đỉnh lẻ mỗi đồ thị)
      { id: 'E', label: 'Đồ thị A, B và C' },
      { id: 'F', label: 'Không đồ thị nào' },
    ],
    correctOptionId: 'D',
    explanation: 'Đếm số đỉnh bậc lẻ: A:[2,2,4,4]→0 lẻ→Euler Circuit. B:[1,2,3,4]→2 lẻ(1,3)→Euler Path✓. C:[2,3,3,4,4]→2 lẻ(3,3)→Euler Path✓. D:[1,3,3,3]→4 lẻ→Không có. Vậy B và C đều có Euler Path (D).',
  },

  // Q44: Lý thuyết đồ thị — Graph Coloring (Chromatic Number) (Tier 3)
  {
    id: 'q44',
    type: 'logic',
    domain: 'algorithmic',
    difficultyTier: 3,
    irt: { a: 1.8, b: 1.55, c: 0.16 },
    prompt: 'TÔ MÀU ĐỒ THỊ: Tìm số màu tối thiểu cần thiết (Chromatic Number χ) để tô đồ thị sau sao cho hai đỉnh kề nhau luôn khác màu.',
    visualData: {
      type: 'number_sequence',
      sequence: [
        '🎨 Đồ thị G — Danh sách cạnh:',
        '─────────────────────────────',
        'A — B, A — C, A — D',
        'B — C, B — E',
        'C — D, C — E',
        'D — E',
        '─────────────────────────────',
        'Đỉnh: {A, B, C, D, E}    Cạnh: 8',
        'Bậc đỉnh: A=3, B=3, C=4, D=3, E=3',
        '─────────────────────────────',
        'χ(G) = ? (số màu tối thiểu)',
      ],
    },
    // Đồ thị K5 thiếu 2 cạnh, chromatic number = 3
    // A-B-C tạo tam giác → cần ít nhất 3 màu. Thử 3 màu: A=1,B=2,C=3,D=2,E=1 → hợp lệ
    options: [
      { id: 'A', label: '2' },
      { id: 'B', label: '3' }, // Correct
      { id: 'C', label: '4' },
      { id: 'D', label: '5' },
      { id: 'E', label: '6' },
      { id: 'F', label: 'Không thể tô màu' },
    ],
    correctOptionId: 'B',
    explanation: 'A-B-C tạo tam giác → cần ít nhất 3 màu. Thử tô: A=1(xanh), B=2(đỏ), C=3(vàng), D=2(đỏ, không kề B? Kiểm: D kề A,C,E - không kề B nên dùng 2 được), E=1(xanh, kề B,C,D - không kề A nên dùng 1 được). Hợp lệ! χ(G)=3 (B).',
  },
];

