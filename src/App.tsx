import React, { useState } from 'react';
import {
  Zap,
  Flame,
  Award,
  BookOpen,
  Target,
  Users,
  AlertTriangle,
  Sparkles,
  Volume2,
  VolumeX,
  Send,
  PlusCircle,
  ChevronRight,
  Shield,
  Swords,
  TrendingUp,
  Cpu,
  Bot,
  CheckCircle2,
  Compass,
  Gift,
  Crown,
  HeartHandshake,
  MessageSquare,
  X,
  Factory,
  Sliders,
  Atom,
  ShieldCheck,
  Briefcase,
  Layers,
  ExternalLink,
  UserCheck,
  Maximize2,
  Search,
  Filter
} from 'lucide-react';

// --- WEB AUDIO SFX ENGINE (Self-contained, zero-dependency) ---
class SoundFx {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playAction() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(420, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  playFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.22, this.ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.08);
      osc.stop(this.ctx.currentTime + idx * 0.08 + 0.35);
    });
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }
}

const sfx = new SoundFx();

// --- BADGE SYSTEM DEFINITION ---
export type BadgeCode = 'IS' | 'DS' | 'ML' | 'SPS' | 'PP' | 'EDS' | 'VS' | 'AU' | 'PE' | 'VC' | 'CL';
export type BadgeColor = 'yellow' | 'green' | 'black';
export type CrownType = 'gold' | 'silver' | 'none';

export interface CompanyBadge {
  code: BadgeCode;
  color: BadgeColor;
  crown: CrownType;
  title: string;
}

// Company Functional Roles
export type CompanyFunction =
  | '제조사'
  | '기술사'
  | '품질전문가'
  | '구매전략가'
  | '사업전략가'
  | '연구사'
  | '프로지원사';

export interface HunterUser {
  id: string;
  name: string;
  role: CompanyFunction;
  team: string;
  toolName: string;
  badges: CompanyBadge[];
  avatar: string;
  bragDialogue: string; // The speech bubble line
  achievementSummary: string;
  metrics: string;
  savings: string;
  stageName: string;
  xPercent: number; // Arena coordinate
  yPercent: number;
}

export interface BoastItem {
  id: string;
  author: string;
  team: string;
  role: CompanyFunction;
  badgesCount: number;
  hasGoldCrown: boolean;
  type: 'edu_complete' | 'exam_pass' | 'task_start' | 'task_complete' | 'gold_crown';
  title: string;
  description: string;
  metrics?: string;
  savings?: string;
  stageName: string;
  timestamp: string;
  likes: number;
  commentsCount: number;
  damage: number;
}

// Logged-in user information (지덱수 프로)
const LOGGED_IN_USER = {
  name: '지덱수 프로',
  team: '화학본부 기술팀',
  badges: [
    { code: 'DS' as BadgeCode, color: 'yellow' as BadgeColor, crown: 'gold' as CrownType, title: 'Data Science' },
    { code: 'ML' as BadgeCode, color: 'green' as BadgeColor, crown: 'gold' as CrownType, title: 'Machine Learning' },
    { code: 'SPS' as BadgeCode, color: 'black' as BadgeColor, crown: 'silver' as CrownType, title: 'Smart Production System' },
    { code: 'PE' as BadgeCode, color: 'yellow' as BadgeColor, crown: 'silver' as CrownType, title: 'Process Engineering' },
    { code: 'EDS' as BadgeCode, color: 'green' as BadgeColor, crown: 'none' as CrownType, title: 'Enterprise Data System' }
  ]
};

// 10 Distinct Hunter Users - Adjusted positions so NO character overlaps with center 55억 monster (at 50%, 50%)
const INITIAL_HUNTERS: HunterUser[] = [
  {
    id: 'h-1',
    name: '한지원 프로',
    role: '제조사',
    team: '중합공정혁신팀',
    toolName: '공정 자율제어 Agent 솔루션',
    badges: [
      { code: 'PE', color: 'yellow', crown: 'gold', title: 'Process Engineering' },
      { code: 'SPS', color: 'green', crown: 'gold', title: 'Smart Production System' },
      { code: 'ML', color: 'black', crown: 'silver', title: 'Machine Learning' },
      { code: 'DS', color: 'green', crown: 'silver', title: 'Data Science' },
      { code: 'IS', color: 'yellow', crown: 'silver', title: 'Innovation Strategy' },
      { code: 'VC', color: 'black', crown: 'none', title: 'Value Creation' }
    ],
    avatar: '⚙️',
    bragDialogue: '내 중합공정 최적화 Agent 앱 개발 스킬을 확인해 보겠다구? 반응기 온도 자율제어로 스팀비용 3.8억 절감 일격을 받아라!',
    achievementSummary: '연속 반응기 운전 최적화 Agent 인하우스 앱 런칭 완료! 온도 편차 70% 축소 및 에너지 비용 연간 3.8억원 절감 달성.',
    metrics: '수율 변동폭 4.8% ➔ 0.9% 안정화',
    savings: '연간 스팀/전력비 3억 8,000만원 절감',
    stageName: 'P (Perform)',
    xPercent: 18,
    yPercent: 74
  },
  {
    // 이성훈 프로 shifted to top-right (x: 64, y: 14) so it NEVER overlaps with the diamond monster at (50, 50) or its 55억 badge
    id: 'h-2',
    name: '이성훈 프로',
    role: '사업전략가',
    team: '공정혁신추진팀',
    toolName: 'AXAGE 골드크라운 마스터 지침서',
    badges: [
      { code: 'ML', color: 'yellow', crown: 'gold', title: 'Machine Learning Master' },
      { code: 'DS', color: 'green', crown: 'gold', title: 'Data Science Master' },
      { code: 'IS', color: 'yellow', crown: 'gold', title: 'Innovation Strategy' },
      { code: 'PP', color: 'black', crown: 'gold', title: 'Process Performance' },
      { code: 'EDS', color: 'green', crown: 'silver', title: 'Enterprise Data System' },
      { code: 'AU', color: 'black', crown: 'silver', title: 'Automation Unit' },
      { code: 'CL', color: 'yellow', crown: 'silver', title: 'Core Leadership' }
    ],
    avatar: '👑',
    bragDialogue: '골드크라운의 정밀 지도 버프를 받아라! 180시간 현장 노하우로 공정 비효율을 일도양단한다!',
    achievementSummary: '사내강사 180시간 과제지도 & 수강생 평점 9.9점 달성! 14개 과제 코칭으로 누적 12.5억원 재무성과 견인.',
    metrics: '지도 과제 14건 중 12건 전사 채택',
    savings: '누적 12.5억원 기여 (Gold Crown 수여)',
    stageName: 'P (Perform)',
    xPercent: 64,
    yPercent: 14
  },
  {
    id: 'h-3',
    name: '박소연 프로',
    role: '연구사',
    team: '소재개발Lab',
    toolName: '분자 물성 예측 ML 솔버',
    badges: [
      { code: 'CL', color: 'yellow', crown: 'silver', title: 'Core Lab' },
      { code: 'ML', color: 'green', crown: 'silver', title: 'Machine Learning' },
      { code: 'DS', color: 'black', crown: 'silver', title: 'Data Science' },
      { code: 'VS', color: 'green', crown: 'none', title: 'Vision System' },
      { code: 'IS', color: 'yellow', crown: 'none', title: 'Innovation Strategy' }
    ],
    avatar: '🔬',
    bragDialogue: 'AXAGE 자격시험 98점 통과의 위력! 분자구조 물성예측 머신러닝으로 공정 불순물 원인을 정밀 타격한다!',
    achievementSummary: 'AXAGE 자격 검증시험 98점 통과 (상위 0.5%). 고기능성 신소재 분자 물성 예측 ML 파이프라인 구축으로 연구기간 120일 단축.',
    metrics: '합격 98점 / 스크리닝 4배 가속',
    savings: '개발주기 6개월 단축',
    stageName: 'A (Analyze)',
    xPercent: 82,
    yPercent: 74
  },
  {
    id: 'h-4',
    name: '정우진 프로',
    role: '품질전문가',
    team: '품질보증혁신팀',
    toolName: '실시간 공정 이상감지 프로브',
    badges: [
      { code: 'AU', color: 'green', crown: 'silver', title: 'Automation Unit' },
      { code: 'PP', color: 'yellow', crown: 'silver', title: 'Process Performance' },
      { code: 'IS', color: 'black', crown: 'none', title: 'Innovation Strategy' },
      { code: 'EDS', color: 'green', crown: 'none', title: 'Enterprise Data System' }
    ],
    avatar: '🛡️',
    bragDialogue: '신규 과제 도전 선포! 정제라인 이상물질 사전감지 Agent 퀘스트 착수! 배치당 불량률 제로화에 도전한다!',
    achievementSummary: 'AXAGE D단계 공식 착수! 연속 정제라인 60개 센서 시계열 데이터와 실시간 연동되는 자율 이상판정 Agent 과제 발주.',
    metrics: '목표: 비정상 조업 정지 연 0건화',
    savings: '목표 절감액 연 1.5억원',
    stageName: 'D (Define)',
    xPercent: 12,
    yPercent: 48
  },
  {
    id: 'h-5',
    name: '최민석 프로',
    role: '기술사',
    team: 'DX추진팀',
    toolName: 'Agent 오케스트레이션 파이프라인',
    badges: [
      { code: 'DS', color: 'yellow', crown: 'silver', title: 'Data Science' },
      { code: 'ML', color: 'green', crown: 'silver', title: 'Machine Learning' },
      { code: 'IS', color: 'black', crown: 'none', title: 'Innovation Strategy' },
      { code: 'PE', color: 'green', crown: 'none', title: 'Process Engineering' }
    ],
    avatar: '💻',
    bragDialogue: 'AXAGE V3.0 AI Agent & Tool Calling 풀버프 완료! 공정 데이터 RAG 연동으로 만성 비효율을 광역 소탕한다!',
    achievementSummary: 'AXAGE 심화과정 수료! 공정 도면 및 안전 매뉴얼을 Tool-Calling 멀티 Agent와 연결하는 전사 아키텍처 완성.',
    metrics: 'XP +600 획득 (Gold Specialist)',
    savings: '안전점검 리드타임 85% 단축',
    stageName: 'G (Gather)',
    xPercent: 88,
    yPercent: 48
  },
  {
    id: 'h-6',
    name: '윤지혜 프로',
    role: '품질전문가',
    team: '데이터품질팀',
    toolName: '초정밀 센서 교정 노드',
    badges: [
      { code: 'IS', color: 'yellow', crown: 'silver', title: 'Innovation Strategy' },
      { code: 'DS', color: 'green', crown: 'none', title: 'Data Science' },
      { code: 'ML', color: 'black', crown: 'none', title: 'Machine Learning' },
      { code: 'CL', color: 'yellow', crown: 'none', title: 'Core Lab' }
    ],
    avatar: '✨',
    bragDialogue: '미세 노이즈 하나도 용납하지 않는다! 실시간 데이터 필터링으로 불량 유출 제로화 달성!',
    achievementSummary: '공정 센서 시계열 정제 자동화로 분석 결측치 0% 달성 및 신뢰도 향상.',
    metrics: '데이터 신뢰도 99.8% 확보',
    savings: '연 9,000만원 품질 손실 방지',
    stageName: 'G (Gather)',
    xPercent: 36,
    yPercent: 14
  },
  {
    id: 'h-7',
    name: '강도현 프로',
    role: '기술사',
    team: '스마트팩토리솔루션팀',
    toolName: '엣지 컴퓨팅 추론 엔진',
    badges: [
      { code: 'EDS', color: 'green', crown: 'gold', title: 'Enterprise Data System' },
      { code: 'AU', color: 'yellow', crown: 'silver', title: 'Automation Unit' },
      { code: 'PE', color: 'black', crown: 'silver', title: 'Process Engineering' },
      { code: 'ML', color: 'green', crown: 'none', title: 'Machine Learning' },
      { code: 'DS', color: 'yellow', crown: 'none', title: 'Data Science' }
    ],
    avatar: '🔌',
    bragDialogue: '엣지 디바이스 0.05초 초고속 추론 가동! 설비 멈춤 없는 무중단 자율운전 파이프라인 출격!',
    achievementSummary: '공정 현장 온디바이스 AI 경량화 모델 배포로 실시간 감지 레이턴시 95% 단축.',
    metrics: '추론 속도 50ms 미만 유지',
    savings: '라인 비가동 시간 120시간 감축',
    stageName: 'A (Analyze)',
    xPercent: 66,
    yPercent: 86
  },
  {
    id: 'h-8',
    name: '신유미 프로',
    role: '구매전략가',
    team: '원자재구매혁신팀',
    toolName: '글로벌 시황 예측 Agent',
    badges: [
      { code: 'IS', color: 'yellow', crown: 'silver', title: 'Innovation Strategy' },
      { code: 'PP', color: 'black', crown: 'silver', title: 'Process Performance' },
      { code: 'VC', color: 'green', crown: 'none', title: 'Value Creation' },
      { code: 'DS', color: 'yellow', crown: 'none', title: 'Data Science' }
    ],
    avatar: '📊',
    bragDialogue: '원자재 가격 변동 사전 예측 완료! 최적 발주 타이밍 자율 산출로 구매 원가 18% 전격 절감!',
    achievementSummary: '글로벌 원자재 시황 예측 LLM Agent 도입을 통해 발주 단가 최적화 달성.',
    metrics: '구매 예측 정확도 92%',
    savings: '원자재 구매비용 연 2.2억원 절감',
    stageName: 'A (Analyze)',
    xPercent: 16,
    yPercent: 20
  },
  {
    id: 'h-9',
    name: '오동석 프로',
    role: '프로지원사',
    team: '현장기술지원팀',
    toolName: '현장 노하우 챗봇 RAG 코어',
    badges: [
      { code: 'SPS', color: 'green', crown: 'gold', title: 'Smart Production System' },
      { code: 'PE', color: 'yellow', crown: 'gold', title: 'Process Engineering' },
      { code: 'AU', color: 'black', crown: 'silver', title: 'Automation Unit' },
      { code: 'IS', color: 'yellow', crown: 'silver', title: 'Innovation Strategy' },
      { code: 'ML', color: 'green', crown: 'none', title: 'Machine Learning' },
      { code: 'EDS', color: 'black', crown: 'none', title: 'Enterprise Data System' }
    ],
    avatar: '🤝',
    bragDialogue: '현장 30년 베테랑의 직관을 지식베이스로 완성했다! 모든 엔지니어의 멘토가 되어 55억 달성을 돕는다!',
    achievementSummary: '전사 20개 공정 운전 매뉴얼 및 트러블슈팅 지식 RAG 구축으로 신임 엔지니어 문제해결 3배 가속.',
    metrics: '현장 트러블 해결시간 75% 단축',
    savings: '트러블 조기수습 1.8억원 기여',
    stageName: 'P (Perform)',
    xPercent: 84,
    yPercent: 20
  },
  {
    id: 'h-10',
    name: '김태경 프로',
    role: '연구사',
    team: '첨단소재합성Lab',
    toolName: '합성 반응 경로 시뮬레이터',
    badges: [
      { code: 'ML', color: 'yellow', crown: 'gold', title: 'Machine Learning' },
      { code: 'CL', color: 'green', crown: 'silver', title: 'Core Lab' },
      { code: 'VS', color: 'black', crown: 'silver', title: 'Vision System' },
      { code: 'DS', color: 'green', crown: 'none', title: 'Data Science' },
      { code: 'IS', color: 'yellow', crown: 'none', title: 'Innovation Strategy' }
    ],
    avatar: '🧪',
    bragDialogue: '신규 합성 최적 반응온도 역산출 성공! 실험 횟수를 1/5로 줄인 스마트 연구의 진수를 보라!',
    achievementSummary: '생성형 AI 기반 반응 경로 역설계 알고리즘 구현으로 파일럿 실험 기간 대폭 단축.',
    metrics: '실험 시료 및 횟수 80% 절감',
    savings: '연구개발비 연 1.4억원 절감',
    stageName: 'A (Analyze)',
    xPercent: 34,
    yPercent: 86
  }
];

const ADDITIONAL_HUNTERS: HunterUser[] = [
  {
    id: 'h-11',
    name: '류승호 프로',
    role: '제조사',
    team: '고순도정제운전팀',
    toolName: '분리공정 에너지 회수율 예측기',
    badges: [
      { code: 'PE', color: 'green', crown: 'gold', title: 'Process Engineering' },
      { code: 'SPS', color: 'yellow', crown: 'silver', title: 'Smart Production System' },
      { code: 'DS', color: 'black', crown: 'none', title: 'Data Science' },
      { code: 'IS', color: 'green', crown: 'none', title: 'Innovation Strategy' }
    ],
    avatar: '⚙️',
    bragDialogue: '고순도 정제공정 스팀 사용량 15% 감축 달성! 에너지 회수율 예측 AI로 최적 운전점을 완벽히 사수한다!',
    achievementSummary: '연속 정제공정의 시계열 압력·온도 데이터 연동 최적 환류비 산출 모델 구축. 연간 스팀 에너지 1억 9,000만원 절감.',
    metrics: '스팀 소비량 15% 감축',
    savings: '연간 에너지비 1.9억원 절감',
    stageName: 'P (Perform)',
    xPercent: 22,
    yPercent: 32
  },
  {
    id: 'h-12',
    name: '배서연 프로',
    role: '연구사',
    team: '기능성고분자Lab',
    toolName: '촉매 활성도 사전 예측 ML',
    badges: [
      { code: 'CL', color: 'yellow', crown: 'gold', title: 'Core Lab' },
      { code: 'ML', color: 'green', crown: 'silver', title: 'Machine Learning' },
      { code: 'DS', color: 'black', crown: 'silver', title: 'Data Science' },
      { code: 'VS', color: 'green', crown: 'none', title: 'Vision System' }
    ],
    avatar: '🧪',
    bragDialogue: '촉매 활성도 예측 정확도 96% 달성! 실험실 파일럿 반응 수율 98.4% 돌파로 신소재 개발 기간을 혁신했다!',
    achievementSummary: '고분자 합성 촉매 반응성 데이터 학습을 통한 최적 투입 조건 도출 파이프라인 완성. 파일럿 수율 98.4% 달성.',
    metrics: '수율 98.4% / 예측도 96%',
    savings: '개발 기간 4개월 단축',
    stageName: 'A (Analyze)',
    xPercent: 78,
    yPercent: 32
  },
  {
    id: 'h-13',
    name: '송민재 프로',
    role: '기술사',
    team: '설비예지보전팀',
    toolName: '회전기기 멀티모달 진단 Agent',
    badges: [
      { code: 'EDS', color: 'green', crown: 'gold', title: 'Enterprise Data System' },
      { code: 'AU', color: 'yellow', crown: 'gold', title: 'Automation Unit' },
      { code: 'PE', color: 'black', crown: 'silver', title: 'Process Engineering' },
      { code: 'DS', color: 'yellow', crown: 'none', title: 'Data Science' },
      { code: 'ML', color: 'green', crown: 'none', title: 'Machine Learning' }
    ],
    avatar: '⚡',
    bragDialogue: '진동·초음파 멀티모달 센서로 대형 펌프 고장을 48시간 전에 완벽 포착! 돌발 셧다운 제로화 달성!',
    achievementSummary: '주요 회전설비 42대의 엣지 센서와 결합된 예지보전 AI Agent 운영. 돌발 가동 중단 2건 사전 차단.',
    metrics: '고장 48시간 전 사전 알림',
    savings: '돌발 비가동 손실 2.4억원 방어',
    stageName: 'P (Perform)',
    xPercent: 30,
    yPercent: 40
  },
  {
    id: 'h-14',
    name: '권하늘 프로',
    role: '품질전문가',
    team: '품질기획팀',
    toolName: '로트별 산포 자동 보정 피드백',
    badges: [
      { code: 'PP', color: 'yellow', crown: 'silver', title: 'Process Performance' },
      { code: 'IS', color: 'green', crown: 'silver', title: 'Innovation Strategy' },
      { code: 'AU', color: 'black', crown: 'none', title: 'Automation Unit' },
      { code: 'EDS', color: 'green', crown: 'none', title: 'Enterprise Data System' }
    ],
    avatar: '🛡️',
    bragDialogue: '원료 물성 편차에 따른 실시간 제어로 제품 불량 클레임 0건화 달성! 초격차 품질 신뢰도를 입증한다!',
    achievementSummary: '입고 원료의 수분·점도 변화에 맞춰 공정 운전 파라미터를 자율 미세조정하는 제어 루프 구축.',
    metrics: '불량 클레임 0건화',
    savings: '품질 손실비용 1.3억원 절감',
    stageName: 'P (Perform)',
    xPercent: 70,
    yPercent: 40
  },
  {
    id: 'h-15',
    name: '조현우 프로',
    role: '사업전략가',
    team: '글로벌사업개발팀',
    toolName: '제품 믹스 최적 마진 스케줄러',
    badges: [
      { code: 'VC', color: 'yellow', crown: 'gold', title: 'Value Creation' },
      { code: 'CL', color: 'green', crown: 'gold', title: 'Core Leadership' },
      { code: 'IS', color: 'black', crown: 'silver', title: 'Innovation Strategy' },
      { code: 'DS', color: 'yellow', crown: 'none', title: 'Data Science' }
    ],
    avatar: '👑',
    bragDialogue: '글로벌 시장 수급과 제품 스프레드를 실시간 반영하는 자율 스케줄러로 2분기 영업이익 3.4억원 추가 견인!',
    achievementSummary: '원자재 가격 변동과 완제품 글로벌 판가를 연동한 다이나믹 생산계획 최적화 알고리즘 운영.',
    metrics: '스프레드 최적화 +8.2%',
    savings: '영업이익 3.4억원 기여',
    stageName: 'P (Perform)',
    xPercent: 40,
    yPercent: 24
  },
  {
    id: 'h-16',
    name: '임수빈 프로',
    role: '구매전략가',
    team: '공급망혁신팀',
    toolName: '공급망 리스크 사전 감지 Agent',
    badges: [
      { code: 'IS', color: 'yellow', crown: 'silver', title: 'Innovation Strategy' },
      { code: 'PP', color: 'green', crown: 'silver', title: 'Process Performance' },
      { code: 'VC', color: 'black', crown: 'none', title: 'Value Creation' },
      { code: 'DS', color: 'yellow', crown: 'none', title: 'Data Science' }
    ],
    avatar: '📊',
    bragDialogue: '글로벌 물류 병목과 공급망 리스크를 2주 전에 감지! 전략적 선제 발주로 조달 비용 1.6억원을 사수했다!',
    achievementSummary: '해외 주요 선적 데이터와 원자재 재고 수준을 실시간 분석하는 공급망 조기경보 Agent 배포.',
    metrics: '리스크 사전 감지율 94%',
    savings: '조달 리스크 방어 1.6억원',
    stageName: 'A (Analyze)',
    xPercent: 60,
    yPercent: 24
  },
  {
    id: 'h-17',
    name: '문성민 프로',
    role: '프로지원사',
    team: '기술교육지원팀',
    toolName: '현장 인터랙티브 RAG 가이드',
    badges: [
      { code: 'SPS', color: 'green', crown: 'silver', title: 'Smart Production System' },
      { code: 'PE', color: 'yellow', crown: 'silver', title: 'Process Engineering' },
      { code: 'AU', color: 'black', crown: 'none', title: 'Automation Unit' },
      { code: 'CL', color: 'yellow', crown: 'none', title: 'Core Leadership' }
    ],
    avatar: '🤝',
    bragDialogue: '신규 운전원 현장 적응 기간 50% 단축! 3,000페이지 공정 매뉴얼을 실시간 대화형 Agent로 완전 개편했다!',
    achievementSummary: '현장 운전 매뉴얼 및 인터록 도면을 검색 증강 생성(RAG) 챗봇으로 변환하여 실무 투입 기간 반감.',
    metrics: 'OJT 기간 6주 ➔ 3주 단축',
    savings: '교육비용 및 현장 적응 8,000만원 절감',
    stageName: 'P (Perform)',
    xPercent: 26,
    yPercent: 58
  },
  {
    id: 'h-18',
    name: '황지은 프로',
    role: '연구사',
    team: '친환경소재연구팀',
    toolName: '바이오 모노머 합성 시뮬레이터',
    badges: [
      { code: 'ML', color: 'yellow', crown: 'gold', title: 'Machine Learning' },
      { code: 'CL', color: 'green', crown: 'silver', title: 'Core Lab' },
      { code: 'VS', color: 'black', crown: 'silver', title: 'Vision System' },
      { code: 'DS', color: 'green', crown: 'none', title: 'Data Science' }
    ],
    avatar: '🧪',
    bragDialogue: '바이오 원료 기반 합성 경로 최적화 성공! 탄소배출 연간 420톤 저감과 글로벌 친환경 인증을 동시 획득했다!',
    achievementSummary: '친환경 바이오 모노머 합성 시뮬레이션을 통해 반응 조건 최적화 및 에너지 저감 달성.',
    metrics: '탄소배출 연 420톤 저감',
    savings: '탄소배출권 및 에너지 1.1억원 절감',
    stageName: 'P (Perform)',
    xPercent: 74,
    yPercent: 58
  },
  {
    id: 'h-19',
    name: '서진우 프로',
    role: '제조사',
    team: '반응공정운전팀',
    toolName: '급변 반응 제어 안전 오버라이드',
    badges: [
      { code: 'PE', color: 'green', crown: 'gold', title: 'Process Engineering' },
      { code: 'PP', color: 'yellow', crown: 'silver', title: 'Process Performance' },
      { code: 'AU', color: 'black', crown: 'silver', title: 'Automation Unit' },
      { code: 'IS', color: 'yellow', crown: 'none', title: 'Innovation Strategy' }
    ],
    avatar: '⚙️',
    bragDialogue: '급격한 발열 반응 구간도 AI 지능형 냉각 제어로 완벽 제어! 비정상 정지 연 0건 무결점 운전 달성!',
    achievementSummary: '연속 발열 반응기 온도 폭주 위험을 0.1초 단위로 사전 억제하는 지능형 오버라이드 제어기 적용.',
    metrics: '비정상 트립 연 0건화',
    savings: '원료 폐기 방지 연 1.5억원',
    stageName: 'P (Perform)',
    xPercent: 20,
    yPercent: 82
  },
  {
    id: 'h-20',
    name: '안도경 프로',
    role: '기술사',
    team: '공정AI모델링팀',
    toolName: '전사 디지털 트윈 시뮬레이터',
    badges: [
      { code: 'EDS', color: 'green', crown: 'gold', title: 'Enterprise Data System' },
      { code: 'ML', color: 'yellow', crown: 'gold', title: 'Machine Learning' },
      { code: 'DS', color: 'black', crown: 'silver', title: 'Data Science' },
      { code: 'AU', color: 'green', crown: 'none', title: 'Automation Unit' },
      { code: 'PE', color: 'yellow', crown: 'none', title: 'Process Engineering' }
    ],
    avatar: '⚡',
    bragDialogue: '공정 전체를 디지털 트윈으로 복제했다! 가상 운전 시뮬레이션으로 전력 소비를 1.2억원 전격 절감!',
    achievementSummary: '전 공정의 물질 및 에너지 흐름을 실시간 모사하는 디지털 트윈 플랫폼 구축 및 배포 완료.',
    metrics: '시뮬레이션 오차율 0.8% 이하',
    savings: '연간 전력비 1.2억원 절감',
    stageName: 'P (Perform)',
    xPercent: 80,
    yPercent: 82
  },
  {
    id: 'h-21',
    name: '백승찬 프로',
    role: '품질전문가',
    team: '분석시험센터',
    toolName: '크로마토그래피 피크 자동 판정기',
    badges: [
      { code: 'PP', color: 'yellow', crown: 'silver', title: 'Process Performance' },
      { code: 'DS', color: 'green', crown: 'silver', title: 'Data Science' },
      { code: 'ML', color: 'black', crown: 'none', title: 'Machine Learning' },
      { code: 'CL', color: 'yellow', crown: 'none', title: 'Core Lab' }
    ],
    avatar: '🛡️',
    bragDialogue: '시험 분석 판정 자동화로 출하 대기시간 80% 단축! 고객사 납기 만족도 100%를 달성했다!',
    achievementSummary: '크로마토그래피 스펙트럼 피크 적분 및 순도 분석 판정 딥러닝 모델로 시험 시간 단축.',
    metrics: '분석 시간 120분 ➔ 20분 단축',
    savings: '출하 대기비용 9,500만원 절감',
    stageName: 'P (Perform)',
    xPercent: 32,
    yPercent: 70
  },
  {
    id: 'h-22',
    name: '고은비 프로',
    role: '사업전략가',
    team: '생산전략기획팀',
    toolName: '다품종 믹스 생산 최적화 엔진',
    badges: [
      { code: 'VC', color: 'yellow', crown: 'gold', title: 'Value Creation' },
      { code: 'IS', color: 'green', crown: 'gold', title: 'Innovation Strategy' },
      { code: 'CL', color: 'black', crown: 'silver', title: 'Core Leadership' },
      { code: 'PP', color: 'yellow', crown: 'none', title: 'Process Performance' }
    ],
    avatar: '👑',
    bragDialogue: '다품종 전환 손실을 제로화하는 생산 순서 최적화! 분기 영업이익 5.2억원의 엄청난 성과를 견인했다!',
    achievementSummary: '제품 전환 세정 시간 및 손실 원료를 최소화하는 유전자 알고리즘 기반 생산 순서 최적화 엔진 구축.',
    metrics: '전환 손실 62% 감소',
    savings: '분기 영업이익 5.2억원 기여',
    stageName: 'P (Perform)',
    xPercent: 68,
    yPercent: 70
  },
  {
    id: 'h-23',
    name: '전우현 프로',
    role: '기술사',
    team: '스마트센서기술팀',
    toolName: '무선 IoT 센서 자율 보정 네트워크',
    badges: [
      { code: 'AU', color: 'green', crown: 'silver', title: 'Automation Unit' },
      { code: 'EDS', color: 'yellow', crown: 'silver', title: 'Enterprise Data System' },
      { code: 'PE', color: 'black', crown: 'none', title: 'Process Engineering' },
      { code: 'DS', color: 'green', crown: 'none', title: 'Data Science' }
    ],
    avatar: '⚡',
    bragDialogue: '극한 환경 무선 센서 1,200대 자율 드리프트 보정 완료! 데이터 결측 없는 완벽한 스마트 공장을 완성했다!',
    achievementSummary: '고온·고압 환경 센서의 경년 변화 드리프트를 상호 교차 검증 알고리즘으로 자동 보정하는 네트워크 구축.',
    metrics: '데이터 신뢰도 99.9% 확보',
    savings: '센서 교체 유지보수비 8,500만원 절감',
    stageName: 'A (Analyze)',
    xPercent: 44,
    yPercent: 76
  },
  {
    id: 'h-24',
    name: '노유진 프로',
    role: '구매전략가',
    team: '자원순환구매팀',
    toolName: '순환 원료 품질 등급 자동 판정기',
    badges: [
      { code: 'VC', color: 'yellow', crown: 'silver', title: 'Value Creation' },
      { code: 'IS', color: 'green', crown: 'silver', title: 'Innovation Strategy' },
      { code: 'PP', color: 'black', crown: 'none', title: 'Process Performance' },
      { code: 'DS', color: 'yellow', crown: 'none', title: 'Data Science' }
    ],
    avatar: '📊',
    bragDialogue: '순환 자원 원료의 등급별 가치 평가 자동화! 친환경 원료 구매단가를 14% 추가 절감하는 쾌거!',
    achievementSummary: '재활용 원료 스펙트럼 데이터와 물성 간 상관관계 모델을 활용한 자동 단가 책정 시스템 도입.',
    metrics: '구매단가 14% 절감',
    savings: '원료비 1.7억원 추가 절감',
    stageName: 'P (Perform)',
    xPercent: 56,
    yPercent: 76
  },
  {
    id: 'h-25',
    name: '유태양 프로',
    role: '제조사',
    team: '연속중합생산팀',
    toolName: '스마트 믹싱 파라미터 최적화',
    badges: [
      { code: 'PE', color: 'yellow', crown: 'silver', title: 'Process Engineering' },
      { code: 'PP', color: 'green', crown: 'silver', title: 'Process Performance' },
      { code: 'AU', color: 'black', crown: 'none', title: 'Automation Unit' },
      { code: 'SPS', color: 'yellow', crown: 'none', title: 'Smart Production System' }
    ],
    avatar: '⚙️',
    bragDialogue: '점도 예측 기반 자율 교반 속도 조절로 전력 피크치 18% 저감! 현장 오퍼레이터의 수기 운전을 완전 해방시켰다!',
    achievementSummary: '중합 반응기 내 유체 점도 변화를 실시간 추정하여 모터 교반 속도를 가변 제어하는 알고리즘 적용.',
    metrics: '전력 피크 18% 저감',
    savings: '연간 기본 전력료 9,200만원 절감',
    stageName: 'P (Perform)',
    xPercent: 28,
    yPercent: 92
  },
  {
    id: 'h-26',
    name: '채수진 프로',
    role: '연구사',
    team: '나노복합소재Lab',
    toolName: '나노 분산도 머신러닝 분석기',
    badges: [
      { code: 'CL', color: 'green', crown: 'gold', title: 'Core Lab' },
      { code: 'VS', color: 'yellow', crown: 'silver', title: 'Vision System' },
      { code: 'ML', color: 'black', crown: 'silver', title: 'Machine Learning' },
      { code: 'DS', color: 'green', crown: 'none', title: 'Data Science' }
    ],
    avatar: '🧪',
    bragDialogue: '전자현미경 이미지 딥러닝 분석으로 나노 필러 분산도 35% 개선! 차세대 고강도 복합소재 양산 기반을 닦았다!',
    achievementSummary: '나노 입자 분산 상태를 컴퓨터 비전 모델로 정량 분석하여 컴파운딩 압출 조건을 자율 최적화.',
    metrics: '분산도 균일도 +35% 향상',
    savings: '연구 샘플 제작비 7,800만원 절감',
    stageName: 'A (Analyze)',
    xPercent: 72,
    yPercent: 92
  },
  {
    id: 'h-27',
    name: '홍정호 프로',
    role: '프로지원사',
    team: '안전혁신추진팀',
    toolName: '안전작업허가 자동 검토 Agent',
    badges: [
      { code: 'SPS', color: 'yellow', crown: 'gold', title: 'Smart Production System' },
      { code: 'AU', color: 'green', crown: 'silver', title: 'Automation Unit' },
      { code: 'IS', color: 'black', crown: 'silver', title: 'Innovation Strategy' },
      { code: 'PE', color: 'yellow', crown: 'none', title: 'Process Engineering' }
    ],
    avatar: '🤝',
    bragDialogue: '공정 안전 작업허가서 검토 시간 70% 단축! AI 위험인자 사전 스크리닝으로 무사고 1,000일 달성을 적극 지원한다!',
    achievementSummary: '작업 구역 도면 및 당일 위험 조업 정보를 종합 검토하여 안전조치 누락을 자동 검출하는 Agent 운영.',
    metrics: '승인 대기시간 70% 단축',
    savings: '작업 지연 손실 8,400만원 방지',
    stageName: 'P (Perform)',
    xPercent: 44,
    yPercent: 8
  },
  {
    id: 'h-28',
    name: '지덱수 프로',
    role: '기술사',
    team: '화학본부 기술팀',
    toolName: '공정 이상예측 RAG 코어 Agent',
    badges: [
      { code: 'DS', color: 'yellow', crown: 'gold', title: 'Data Science' },
      { code: 'ML', color: 'green', crown: 'gold', title: 'Machine Learning' },
      { code: 'SPS', color: 'black', crown: 'silver', title: 'Smart Production System' },
      { code: 'PE', color: 'green', crown: 'none', title: 'Process Engineering' },
      { code: 'EDS', color: 'yellow', crown: 'none', title: 'Enterprise Data System' }
    ],
    avatar: '⚡',
    bragDialogue: '실시간 센서 데이터와 도면 지식베이스 결합 완료! 전사 동료들과 함께 재무성과 55억 목표를 반드시 격파한다!',
    achievementSummary: '연속 공정 시계열 이상감지 및 트러블슈팅 가이드 RAG Agent 구축으로 신속 대응 체계 확립.',
    metrics: '이상감지 정확도 95%',
    savings: '트러블 조기 대응 1.1억원 기여',
    stageName: 'P (Perform)',
    xPercent: 56,
    yPercent: 8
  }
];

const EXPANDED_ACTIVITIES: HunterUser[] = [...INITIAL_HUNTERS, ...ADDITIONAL_HUNTERS];

const INITIAL_BOASTS: BoastItem[] = [
  {
    id: 'b-1',
    author: '한지원 프로',
    team: '중합공정혁신팀',
    role: '제조사',
    badgesCount: 6,
    hasGoldCrown: true,
    type: 'task_complete',
    title: '과제 완수 & 연속운전 최적화 Agent 앱 개발',
    description: 'A단계에서 반응기 온도 및 압력 자율제어 Agent 파이프라인 배치! 스팀 에너지 28% 절감 및 사내 인하우스 앱 런칭 성공!',
    metrics: '수율 변동폭 4.8% ➔ 0.9% 극적 안정화',
    savings: '연간 에너지비 3억 8,000만원 비용 절감',
    stageName: 'P (Perform)',
    timestamp: '방금 전',
    likes: 98,
    commentsCount: 26,
    damage: 380000
  },
  {
    id: 'b-2',
    author: '이성훈 프로',
    team: '공정혁신추진팀',
    role: '사업전략가',
    badgesCount: 7,
    hasGoldCrown: true,
    type: 'gold_crown',
    title: 'AXAGE 사내강사 최고 영예 [골드크라운(Gold Crown)] 획득!',
    description: '사내강사로서 180시간 현장 과제 지도 및 전사 AXAGE 수강생 만족도 평점 9.9점 달성! AX Innovation 센터 공인 최고 등급 골드크라운 강사로 등극했습니다!',
    metrics: '지도 과제 14건 중 12건 사업장 채택',
    savings: '누적 12.5억원 기여 (Gold Crown 수여)',
    stageName: 'P (Perform)',
    timestamp: '15분 전',
    likes: 176,
    commentsCount: 48,
    damage: 500000
  },
  {
    id: 'b-3',
    author: '박소연 프로',
    team: '소재개발Lab',
    role: '연구사',
    badgesCount: 5,
    hasGoldCrown: false,
    type: 'exam_pass',
    title: 'AXAGE Master 자격 검증시험 98점 통과!',
    description: 'AXAGE 프레임워크 검증시험에서 최고 득점 달성! 실버크라운 배지 장착하고 사냥터 출격합니다!',
    metrics: '합격 점수 98/100 (상위 0.5%)',
    stageName: 'A (Analyze)',
    timestamp: '30분 전',
    likes: 76,
    commentsCount: 18,
    damage: 120000
  },
  {
    id: 'b-4',
    author: '정우진 프로',
    team: '품질보증혁신팀',
    role: '품질전문가',
    badgesCount: 4,
    hasGoldCrown: false,
    type: 'task_start',
    title: '신규 과제 도전 선포: 연속 정제라인 이상감지 Agent 구축',
    description: 'D단계 클리어! 정제공정의 이상 징후를 사전에 탐지하고 운전조건을 자율 조절하는 AI Agent 과제에 도전합니다!',
    metrics: '목표: 비정상 조업정지 제로화 및 원료 손실 1.5억 방지',
    stageName: 'D (Define)',
    timestamp: '48분 전',
    likes: 58,
    commentsCount: 11,
    damage: 85000
  },
  {
    id: 'b-5',
    author: '최민석 프로',
    team: 'DX추진팀',
    role: '기술사',
    badgesCount: 4,
    hasGoldCrown: false,
    type: 'edu_complete',
    title: 'AXAGE 심화과정: [AI Agent & Tool Calling 실전] 수료!',
    description: '공정센서 시계열 DB와 설비 안전 매뉴얼을 연결하는 최신 AXAGE V3.0 교육 40시간 이수 완료! 현업 낭비 요소를 말끔히 소탕하겠습니다.',
    metrics: 'XP +600 획득 & Gold Specialist 배지 승급',
    stageName: 'G (Gather)',
    timestamp: '1시간 전',
    likes: 64,
    commentsCount: 8,
    damage: 95000
  }
];

function BadgePill({ badge }: { badge: CompanyBadge }) {
  const bgColors = {
    yellow: 'bg-amber-400 text-slate-950 border-amber-300',
    green: 'bg-emerald-600 text-white border-emerald-400',
    black: 'bg-slate-900 text-slate-100 border-slate-600'
  };

  return (
    <span
      title={`${badge.code} - ${badge.title} (${badge.crown !== 'none' ? badge.crown + ' crown' : 'standard'})`}
      className={`inline-flex items-center gap-0.5 px-1 py-0.2 rounded font-hud font-extrabold text-[8px] sm:text-[9px] border shadow-sm ${bgColors[badge.color]}`}
    >
      {badge.crown === 'gold' && <span className="text-[9px]">👑</span>}
      {badge.crown === 'silver' && <span className="text-[9px] text-slate-300">🥈</span>}
      <span>{badge.code}</span>
    </span>
  );
}

const ROLE_AVATARS: Record<CompanyFunction, string> = {
  '제조사': '⚙️',
  '기술사': '⚡',
  '품질전문가': '🛡️',
  '구매전략가': '📊',
  '사업전략가': '👑',
  '연구사': '🧪',
  '프로지원사': '🤝',
};

const ALL_ROLES: CompanyFunction[] = [
  '기술사',
  '품질전문가',
  '구매전략가',
  '사업전략가',
  '연구사',
  '제조사',
  '프로지원사'
];

// ============================================================
// 2등신 (2-Head Ratio Chibi) Game Character Component
// ============================================================
interface ChibiProps {
  hunter: HunterUser;
  isActive?: boolean;
  wanderIndex?: number;
  size?: 'normal' | 'compact';
}

function ChibiHunterCharacter({
  hunter,
  isActive = false,
  wanderIndex = 0,
  size = 'normal'
}: ChibiProps) {
  const role = hunter.role;
  const hasGoldCrown = hunter.badges.some((b) => b.crown === 'gold');
  const hasSilverCrown = !hasGoldCrown && hunter.badges.some((b) => b.crown === 'silver');

  // Role-specific visual attributes for 2등신 character
  const roleThemes: Record<
    CompanyFunction,
    {
      skin: string;
      hair: string;
      jacket: string;
      pants: string;
      shoes: string;
      accent: string;
    }
  > = {
    '제조사': {
      skin: '#fed7aa',
      hair: '#334155',
      jacket: '#1e293b',
      pants: '#0f172a',
      shoes: '#78350f',
      accent: '#f97316'
    },
    '기술사': {
      skin: '#fde68a',
      hair: '#0f172a',
      jacket: '#0f172a',
      pants: '#0284c7',
      shoes: '#0369a1',
      accent: '#06b6d4'
    },
    '품질전문가': {
      skin: '#fef08a',
      hair: '#1e1b4b',
      jacket: '#064e3b',
      pants: '#0f172a',
      shoes: '#1e293b',
      accent: '#34d399'
    },
    '구매전략가': {
      skin: '#fed7aa',
      hair: '#451a03',
      jacket: '#4c1d95',
      pants: '#1e1b4b',
      shoes: '#2e1065',
      accent: '#f59e0b'
    },
    '사업전략가': {
      skin: '#fde68a',
      hair: '#854d0e',
      jacket: '#0f172a',
      pants: '#1e293b',
      shoes: '#000000',
      accent: '#fbbf24'
    },
    '연구사': {
      skin: '#fef9c3',
      hair: '#134e4a',
      jacket: '#f8fafc',
      pants: '#0f766e',
      shoes: '#94a3b8',
      accent: '#10b981'
    },
    '프로지원사': {
      skin: '#fed7aa',
      hair: '#991b1b',
      jacket: '#e11d48',
      pants: '#1e293b',
      shoes: '#f43f5e',
      accent: '#fbbf24'
    }
  };

  const theme = roleThemes[role] || roleThemes['제조사'];
  const width = size === 'compact' ? 36 : 44;
  const height = size === 'compact' ? 48 : 58;

  return (
    <div
      className={`relative flex flex-col items-center select-none transition-all duration-300 ${
        isActive ? 'scale-110' : ''
      }`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* Ground Ring Aura for Active State */}
      {isActive && (
        <div className="absolute -bottom-1.5 w-10 h-3 rounded-full bg-emerald-400/40 blur-[2px] animate-ping pointer-events-none" />
      )}

      {/* Dynamic 2-Head Chibi SVG Body */}
      <div
        className={`w-full h-full relative transition-transform ${
          isActive
            ? 'animate-chibi-cheer drop-shadow-[0_0_12px_rgba(16,185,129,0.95)]'
            : 'animate-chibi-walk hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]'
        }`}
      >
        <svg
          viewBox="0 0 44 56"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground Shadow */}
          <ellipse
            cx="22"
            cy="53"
            rx="13"
            ry="3"
            fill="rgba(0, 0, 0, 0.45)"
            className="chibi-shadow-pulse"
          />

          {/* Left Leg & Shoe (Animated Walk Cycle) */}
          <g className={!isActive ? 'animate-foot-l' : ''} style={{ transformOrigin: '15px 42px' }}>
            <rect x="13" y="40" width="5.5" height="9" rx="2.5" fill={theme.pants} />
            <ellipse cx="15.5" cy="49" rx="3.8" ry="2.2" fill={theme.shoes} />
          </g>

          {/* Right Leg & Shoe (Animated Walk Cycle) */}
          <g className={!isActive ? 'animate-foot-r' : ''} style={{ transformOrigin: '27px 42px' }}>
            <rect x="23.5" y="40" width="5.5" height="9" rx="2.5" fill={theme.pants} />
            <ellipse cx="26.5" cy="49" rx="3.8" ry="2.2" fill={theme.shoes} />
          </g>

          {/* Torso / Body (2등신 Cute Compact Outfit) */}
          <rect x="11" y="27" width="20" height="15" rx="5" fill={theme.jacket} />

          {/* Role-Specific Body Details */}
          {role === '제조사' && (
            <>
              {/* Safety Orange High-Vis Sash */}
              <line x1="12" y1="28" x2="30" y2="40" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
              <rect x="15" y="38" width="12" height="3" rx="1.5" fill="#ea580c" />
            </>
          )}

          {role === '기술사' && (
            <>
              {/* Cyber Circuit Accents */}
              <line x1="21" y1="29" x2="21" y2="40" stroke="#06b6d4" strokeWidth="1.8" />
              <circle cx="21" cy="34" r="1.5" fill="#facc15" />
              <circle cx="15" cy="31" r="1" fill="#06b6d4" />
              <circle cx="27" cy="31" r="1" fill="#06b6d4" />
            </>
          )}

          {role === '품질전문가' && (
            <>
              {/* QA Inspector Vest & Seal */}
              <path d="M 18 27 L 21 34 L 24 27 Z" fill="#ffffff" />
              <circle cx="16" cy="34" r="2" fill="#34d399" />
              <path d="M 15 34 L 16 35 L 17.5 33" stroke="#064e3b" strokeWidth="0.8" fill="none" />
            </>
          )}

          {role === '구매전략가' && (
            <>
              {/* Royal Vest & Gold Tie */}
              <path d="M 18 27 L 21 33 L 24 27 Z" fill="#e0e7ff" />
              <polygon points="20,29 22,29 21.5,37 20.5,37" fill="#f59e0b" />
            </>
          )}

          {role === '사업전략가' && (
            <>
              {/* Executive Gold Lapels */}
              <path d="M 17 27 L 21 35 L 25 27 Z" fill="#1e293b" />
              <line x1="15" y1="27" x2="19" y2="36" stroke="#fbbf24" strokeWidth="1.5" />
              <line x1="27" y1="27" x2="23" y2="36" stroke="#fbbf24" strokeWidth="1.5" />
              <polygon points="20,29 22,29 21.5,38 20.5,38" fill="#eab308" />
            </>
          )}

          {role === '연구사' && (
            <>
              {/* Open White Lab Coat over Turquoise Shirt */}
              <rect x="17" y="27" width="8" height="15" fill="#0d9488" />
              <path d="M 11 27 L 17 27 L 17 42 L 11 40 Z" fill="#f8fafc" />
              <path d="M 31 27 L 25 27 L 25 42 L 31 40 Z" fill="#f8fafc" />
              <line x1="14" y1="32" x2="14" y2="36" stroke="#0284c7" strokeWidth="1" />
            </>
          )}

          {role === '프로지원사' && (
            <>
              {/* Coral Hoodie & Cheer Star */}
              <line x1="21" y1="28" x2="21" y2="41" stroke="#ffffff" strokeWidth="1.2" />
              <circle cx="16" cy="33" r="2" fill="#fbbf24" />
            </>
          )}

          {/* Left Arm & Hand */}
          <rect x="7" y="28" width="5" height="10" rx="2.5" fill={theme.jacket} />
          <circle cx="9.5" cy="38" r="2.5" fill={theme.skin} />

          {/* Right Arm & Hand (Holding Role Prop) */}
          <rect x="30" y="28" width="5" height="10" rx="2.5" fill={theme.jacket} />
          <circle cx="32.5" cy="38" r="2.5" fill={theme.skin} />

          {/* Role-Specific Held Props in Right Hand */}
          {role === '제조사' && (
            /* Cyber Wrench */
            <g transform="translate(32, 33) rotate(25)">
              <rect x="-1.5" y="-6" width="3" height="8" rx="1" fill="#94a3b8" />
              <circle cx="0" cy="-6" r="3.2" fill="#64748b" />
              <circle cx="0" cy="-6" r="1.5" fill="#0f172a" />
            </g>
          )}

          {role === '기술사' && (
            /* Glowing Cyber Data Probe */
            <g transform="translate(33, 33) rotate(20)">
              <rect x="-1" y="-8" width="2.5" height="9" rx="1" fill="#0284c7" />
              <circle cx="0.2" cy="-9" r="2.5" fill="#22d3ee" className="animate-pulse" />
              <line x1="0.2" y1="-12" x2="0.2" y2="-9" stroke="#facc15" strokeWidth="1.2" />
            </g>
          )}

          {role === '품질전문가' && (
            /* QA Checklist Datapad */
            <g transform="translate(32, 32)">
              <rect x="-2" y="-7" width="8" height="10" rx="1.5" fill="#064e3b" stroke="#34d399" strokeWidth="0.8" />
              <line x1="0" y1="-4" x2="4" y2="-4" stroke="#a7f3d0" strokeWidth="0.8" />
              <line x1="0" y1="-2" x2="4" y2="-2" stroke="#a7f3d0" strokeWidth="0.8" />
              <path d="M 0 1 L 1.5 2.5 L 4 0" stroke="#34d399" strokeWidth="1" fill="none" />
            </g>
          )}

          {role === '구매전략가' && (
            /* Gold Chip Ledger */
            <g transform="translate(33, 33)">
              <circle cx="2" cy="-3" r="4" fill="#eab308" stroke="#fef08a" strokeWidth="0.8" />
              <text x="2" y="-1" fontSize="4.5" textAnchor="middle" fill="#78350f" fontWeight="bold">$</text>
            </g>
          )}

          {role === '사업전략가' && (
            /* Executive Glass Hologram Tablet */
            <g transform="translate(32, 31)">
              <rect x="-2" y="-7" width="9" height="11" rx="1.5" fill="#0f172a" stroke="#fbbf24" strokeWidth="0.8" />
              <polyline points="0,-1 2,-3 4,-2 6,-6" fill="none" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          )}

          {role === '연구사' && (
            /* Conical Flask with Glowing Green Chemical Solution */
            <g transform="translate(32, 32)">
              <path d="M 1 -7 L 3 -7 L 3 -4 L 6 1 A 2 2 0 0 1 4.5 3.5 L -0.5 3.5 A 2 2 0 0 1 -2 1 L 1 -4 Z" fill="#0d9488" stroke="#38bdf8" strokeWidth="0.8" />
              <path d="M 0.5 -1 L 5 1 A 2 2 0 0 1 4.5 3.5 L -0.5 3.5 A 2 2 0 0 1 -2 1 Z" fill="#10b981" />
              <circle cx="1" cy="1" r="0.7" fill="#ffffff" />
              <circle cx="3" cy="2" r="0.5" fill="#ffffff" />
            </g>
          )}

          {role === '프로지원사' && (
            /* Cheering Thumbs-up / Star */
            <g transform="translate(33, 31)">
              <polygon points="2,-7 3.5,-3 7.5,-3 4.2,-0.5 5.5,3.5 2,1 -1.5,3.5 -0.2,-0.5 -3.5,-3 0.5,-3" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.6" />
            </g>
          )}

          {/* ---------------------------------------------------- */}
          {/* BIG 2-HEAD CHIBI HEAD (Signature 50% Height Ratio)   */}
          {/* ---------------------------------------------------- */}
          {/* Ears */}
          <circle cx="7.5" cy="17" r="2.8" fill={theme.skin} />
          <circle cx="34.5" cy="17" r="2.8" fill={theme.skin} />

          {/* Round Chibi Face Base */}
          <rect x="8" y="5" width="26" height="24" rx="12" fill={theme.skin} />

          {/* Role-Specific Hair Back & Style */}
          {role === '제조사' && (
            <>
              {/* Rugged Short Spiky Hair */}
              <path d="M 8 13 C 8 4 14 3 21 3 C 28 3 34 4 34 13 C 34 8 28 5 21 5 C 14 5 8 8 8 13 Z" fill={theme.hair} />
              <polygon points="12,5 15,1 18,5" fill={theme.hair} />
              <polygon points="19,5 22,0.5 25,5" fill={theme.hair} />
              <polygon points="26,5 29,1 32,5" fill={theme.hair} />
              {/* Orange Safety Headband */}
              <path d="M 8 10 C 14 8 28 8 34 10 L 34 12 C 28 10 14 10 8 12 Z" fill="#ea580c" />
            </>
          )}

          {role === '기술사' && (
            <>
              {/* Cyber Cut with Cyan Streak */}
              <path d="M 8 13 C 8 3 14 3 21 3 C 28 3 34 3 34 13 C 34 7 28 4 21 4 C 14 4 8 7 8 13 Z" fill={theme.hair} />
              <path d="M 12 7 Q 15 3 20 6" stroke="#22d3ee" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              {/* Cyan Cyber Visor Over Forehead */}
              <rect x="10" y="9" width="22" height="4" rx="2" fill="rgba(6, 182, 212, 0.75)" stroke="#67e8f9" strokeWidth="0.8" />
              <circle cx="30" cy="11" r="1.2" fill="#facc15" />
            </>
          )}

          {role === '품질전문가' && (
            <>
              {/* Neat Side-Parted Hair */}
              <path d="M 7.5 14 C 7.5 3 14 3 21 3 C 28 3 34.5 3 34.5 14 C 33 8 27 5 21 5 C 15 5 9 8 7.5 14 Z" fill={theme.hair} />
              <path d="M 13 4 Q 18 3 22 7 Q 16 7 13 4 Z" fill={theme.hair} />
            </>
          )}

          {role === '구매전략가' && (
            <>
              {/* Stylish Wavy Brown Hair */}
              <path d="M 7.5 14 C 7.5 3 14 2 21 2 C 28 2 34.5 3 34.5 14 C 32 7 26 4 21 4 C 15 4 10 7 7.5 14 Z" fill={theme.hair} />
              <ellipse cx="14" cy="5" rx="4" ry="2.5" fill={theme.hair} />
              <ellipse cx="28" cy="5" rx="4" ry="2.5" fill={theme.hair} />
            </>
          )}

          {role === '사업전략가' && (
            <>
              {/* Charismatic Golden-Brown Layered Hair */}
              <path d="M 7.5 14 C 7.5 2 14 2 21 2 C 28 2 34.5 2 34.5 14 C 32 6 26 4 21 4 C 15 4 10 6 7.5 14 Z" fill={theme.hair} />
              <polygon points="10,6 14,2 17,6" fill={theme.hair} />
              <polygon points="17,6 21,1 25,6" fill={theme.hair} />
              <polygon points="25,6 29,2 32,6" fill={theme.hair} />
              {/* Golden Star Hairpin */}
              <circle cx="28" cy="7" r="2.2" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.6" />
            </>
          )}

          {role === '연구사' && (
            <>
              {/* Fluffy Scientist Hair */}
              <path d="M 7.5 14 C 7.5 3 13 2 21 2 C 29 2 34.5 3 34.5 14 C 33 7 27 4 21 4 C 14 4 9 7 7.5 14 Z" fill={theme.hair} />
              <circle cx="12" cy="4" r="3.5" fill={theme.hair} />
              <circle cx="21" cy="2.5" r="3.5" fill={theme.hair} />
              <circle cx="30" cy="4" r="3.5" fill={theme.hair} />
            </>
          )}

          {role === '프로지원사' && (
            <>
              {/* Energetic Red Bangs + Headset */}
              <path d="M 7.5 14 C 7.5 3 14 2.5 21 2.5 C 28 2.5 34.5 3 34.5 14 C 32 7 26 5 21 5 C 15 5 10 7 7.5 14 Z" fill={theme.hair} />
              <polygon points="13,6 17,3 21,7" fill={theme.hair} />
              <polygon points="21,7 25,3 29,6" fill={theme.hair} />
              {/* Gaming / Comm Headset with Mic */}
              <path d="M 6.5 16 A 15 15 0 0 1 35.5 16" fill="none" stroke="#f43f5e" strokeWidth="2.2" strokeLinecap="round" />
              <rect x="5" y="14" width="3" height="6" rx="1.5" fill="#e11d48" />
              <rect x="34" y="14" width="3" height="6" rx="1.5" fill="#e11d48" />
              <path d="M 35 18 L 30 22 L 26 22" fill="none" stroke="#f43f5e" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="25" cy="22" r="1.2" fill="#fbbf24" />
            </>
          )}

          {/* Big Shiny Chibi Eyes */}
          {/* Left Eye */}
          <ellipse cx="15.5" cy="17" rx="2.8" ry="3.5" fill="#0f172a" />
          <circle cx="14.8" cy="15.5" r="1.3" fill="#ffffff" />
          <circle cx="16.5" cy="18.5" r="0.7" fill="#ffffff" />

          {/* Right Eye */}
          <ellipse cx="26.5" cy="17" rx="2.8" ry="3.5" fill="#0f172a" />
          <circle cx="25.8" cy="15.5" r="1.3" fill="#ffffff" />
          <circle cx="27.5" cy="18.5" r="0.7" fill="#ffffff" />

          {/* Cute Eyebrows */}
          <path d="M 13 12.5 Q 15.5 11 18 12.5" fill="none" stroke={theme.hair} strokeWidth="1.1" strokeLinecap="round" />
          <path d="M 24 12.5 Q 26.5 11 29 12.5" fill="none" stroke={theme.hair} strokeWidth="1.1" strokeLinecap="round" />

          {/* Rosy Cheek Blush */}
          <ellipse cx="12" cy="20.5" rx="2.5" ry="1.2" fill="#fb7185" opacity="0.55" />
          <ellipse cx="30" cy="20.5" rx="2.5" ry="1.2" fill="#fb7185" opacity="0.55" />

          {/* Cute Smile */}
          <path d="M 19 22.5 Q 21 24.8 23 22.5" fill="none" stroke="#be123c" strokeWidth="1.2" strokeLinecap="round" />

          {/* Role Eyewear Over Eyes */}
          {role === '품질전문가' && (
            /* Chic Rectangular Glasses */
            <g stroke="#94a3b8" strokeWidth="0.9" fill="none">
              <rect x="12.5" y="14" width="6.5" height="5.5" rx="1.2" />
              <rect x="23" y="14" width="6.5" height="5.5" rx="1.2" />
              <line x1="19" y1="16.5" x2="23" y2="16.5" />
            </g>
          )}

          {role === '연구사' && (
            /* Round Scientist Glasses */
            <g stroke="#38bdf8" strokeWidth="0.9" fill="none">
              <circle cx="15.5" cy="17" r="3.8" />
              <circle cx="26.5" cy="17" r="3.8" />
              <line x1="19.3" y1="17" x2="22.7" y2="17" />
            </g>
          )}

          {/* Floating Crown above Head if hunter holds gold/silver crown */}
          {hasGoldCrown && (
            <g transform="translate(14, -6)">
              <polygon points="0,5 2,1 4,4 6,0.5 8,4 10,1 12,5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.6" />
              <circle cx="2" cy="1" r="0.8" fill="#ef4444" />
              <circle cx="6" cy="0.5" r="0.8" fill="#3b82f6" />
              <circle cx="10" cy="1" r="0.8" fill="#10b981" />
            </g>
          )}

          {hasSilverCrown && (
            <g transform="translate(15, -5)">
              <polygon points="0,4 2,1 4,3 6,0.5 8,3 10,1 12,4" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.6" />
            </g>
          )}

          {/* Active Reaction Emote (Bubble / Cheer Sparkle) */}
          {isActive && (
            <g transform="translate(32, 2)">
              <circle cx="3" cy="3" r="4.5" fill="#065f46" stroke="#34d399" strokeWidth="0.9" />
              <text x="3" y="5.2" fontSize="5.5" textAnchor="middle">✨</text>
            </g>
          )}
        </svg>
      </div>

      {/* Role Tag Below Feet */}
      <div className="absolute -bottom-1 text-[8px] font-hud font-extrabold bg-slate-900/90 text-amber-300 px-1.5 py-0.2 rounded-full border border-slate-700 whitespace-nowrap shadow pointer-events-none">
        {role}
      </div>
    </div>
  );
}

export default function App() {
  const [hunters, setHunters] = useState<HunterUser[]>(INITIAL_HUNTERS);
  const [activeHunterId, setActiveHunterId] = useState<string | null>('h-1');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [boasts] = useState<BoastItem[]>(INITIAL_BOASTS);
  const [selectedBoast, setSelectedBoast] = useState<BoastItem | null>(null);

  // Requirement: 목표 55억, 현재 달성 29억, 잔여 26억
  const targetGoal = 55;
  const currentAchieved = 29;
  const remaining = 26;
  const progressPercent = Math.round((currentAchieved / targetGoal) * 100);

  // Modals
  const [isJoinBattleModalOpen, setIsJoinBattleModalOpen] = useState<boolean>(false);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState<boolean>(false);
  const [isAcademyModalOpen, setIsAcademyModalOpen] = useState<boolean>(false);
  const [isWebtoonModalOpen, setIsWebtoonModalOpen] = useState<boolean>(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState<boolean>(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState<boolean>(false);
  const [isPatchModalOpen, setIsPatchModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);

  // Expanded Battle Ground popup modal states (전체 인원 활동 내역 보기)
  const [isExpandedBattleModalOpen, setIsExpandedBattleModalOpen] = useState<boolean>(false);
  const [expandedSearchTerm, setExpandedSearchTerm] = useState('');
  const [expandedRoleFilter, setExpandedRoleFilter] = useState<string>('ALL');
  const [expandedStageFilter, setExpandedStageFilter] = useState<string>('ALL');
  const [expandedActiveHunterId, setExpandedActiveHunterId] = useState<string | null>('h-1');
  const [expandedViewMode, setExpandedViewMode] = useState<'cards' | 'arena'>('arena');
  const [expandedList, setExpandedList] = useState<HunterUser[]>(EXPANDED_ACTIVITIES);
  const [expandedLikes, setExpandedLikes] = useState<Record<string, number>>({});

  const handleLikeHunter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sfx.playClick();
    setExpandedLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  // Battle ground join form state
  const [joinName, setJoinName] = useState('지덱수 프로');
  const [joinRole, setJoinRole] = useState<CompanyFunction>('기술사');
  const [joinTeam, setJoinTeam] = useState('화학본부 기술팀');
  const [joinOpinion, setJoinOpinion] = useState('');

  // SOS Comment state
  const [sosComments, setSosComments] = useState<string[]>([
    '공정혁신추진팀 이성훈 프로: "반응기 온도 급변 구간은 LangGraph Agent에 지연 보상 알고리즘(Dead-time compensation)을 추가하면 안정화됩니다. 도면 공유해주세요!"',
    '소재개발Lab 박소연 프로: "센서 노이즈가 클 때는 칼만 필터 노드를 전처리 파이프라인에 배치하는 방식을 권장합니다."'
  ]);
  const [mySosComment, setMySosComment] = useState('');

  const toggleSound = () => {
    sfx.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  const handleHunterClick = (hunter: HunterUser) => {
    sfx.playClick();
    setActiveHunterId(hunter.id);
  };

  const handleAddSosComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mySosComment.trim()) return;
    sfx.playClick();
    setSosComments([...sosComments, `지원군 [나]: "${mySosComment.trim()}"`]);
    setMySosComment('');
  };

  // Submit new participant: delete 1 of 10 hunters, upload new participant, and pop up speech bubble
  const handleJoinBattleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinOpinion.trim()) return;

    sfx.playFanfare();

    // Replace 1 of the 10 hunters (slot 10, index 9, retaining coordinate)
    const replaceIndex = hunters.length > 0 ? hunters.length - 1 : 0;
    const targetSlot = hunters[replaceIndex];

    const newHunterId = `hunter-user-${Date.now()}`;
    const newHunter: HunterUser = {
      id: newHunterId,
      name: joinName.trim() || '지덱수 프로',
      role: joinRole,
      team: joinTeam.trim() || '화학본부 기술팀',
      toolName: '배틀 그라운드 실시간 의견',
      badges: [
        { code: 'DS', color: 'green', crown: 'gold', title: 'Data Science' },
        { code: 'ML', color: 'yellow', crown: 'silver', title: 'Machine Learning' },
        { code: 'SPS', color: 'black', crown: 'silver', title: 'Smart Production System' },
        { code: 'PE', color: 'green', crown: 'none', title: 'Process Engineering' },
        { code: 'EDS', color: 'yellow', crown: 'none', title: 'Enterprise Data System' }
      ],
      avatar: ROLE_AVATARS[joinRole] || '🌟',
      bragDialogue: joinOpinion.trim(),
      achievementSummary: `${joinName.trim() || '지덱수 프로'}의 배틀 그라운드 참여 의견이 등록되었습니다.`,
      metrics: '배틀 그라운드 실시간 등록',
      savings: '참여 의견 등록 완료',
      stageName: 'D (Define)',
      xPercent: targetSlot ? targetSlot.xPercent : 34,
      yPercent: targetSlot ? targetSlot.yPercent : 86
    };

    const nextHunters = [...hunters];
    if (nextHunters.length >= 10) {
      nextHunters.splice(replaceIndex, 1, newHunter);
    } else {
      nextHunters.push(newHunter);
    }

    setHunters(nextHunters);
    setExpandedList((prev) => [newHunter, ...prev]);
    setActiveHunterId(newHunterId);
    setIsJoinBattleModalOpen(false);
    setJoinOpinion('');
  };

  const activeHunter = hunters.find((h) => h.id === activeHunterId);

  // Filtered list for the expanded Battle Ground popup
  const filteredExpandedHunters = expandedList.filter((hunter) => {
    const term = expandedSearchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      hunter.name.toLowerCase().includes(term) ||
      hunter.team.toLowerCase().includes(term) ||
      hunter.role.toLowerCase().includes(term) ||
      hunter.toolName.toLowerCase().includes(term) ||
      hunter.bragDialogue.toLowerCase().includes(term) ||
      hunter.achievementSummary.toLowerCase().includes(term) ||
      hunter.savings.toLowerCase().includes(term);

    const matchesRole = expandedRoleFilter === 'ALL' || hunter.role === expandedRoleFilter;
    const matchesStage =
      expandedStageFilter === 'ALL' || hunter.stageName.startsWith(expandedStageFilter);

    return matchesSearch && matchesRole && matchesStage;
  });

  // Smart speech bubble positioning
  // If hunter is in top half (yPercent < 48), display bubble BELOW the hunter;
  // If hunter is in bottom half, display bubble ABOVE the hunter.
  // Horizontally clamped between 22% and 78% so left/right are never cropped.
  let bubbleStyle: React.CSSProperties = {};
  let isBubbleBelow = false;
  if (activeHunter) {
    isBubbleBelow = activeHunter.yPercent < 48;
    const clampedX = Math.max(22, Math.min(78, activeHunter.xPercent));
    const targetY = isBubbleBelow ? activeHunter.yPercent + 7 : activeHunter.yPercent - 7;
    bubbleStyle = {
      left: `${clampedX}%`,
      top: `${targetY}%`,
      transform: isBubbleBelow ? 'translate(-50%, 0)' : 'translate(-50%, -100%)'
    };
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[750px] bg-emerald-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-cyan-600/10 rounded-full blur-[130px]" />
        <div className="absolute top-20 right-10 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[140px]" />
      </div>

      {/* ============================================================== */}
      {/* 1. TOP HUD HEADER BAR                                          */}
      {/* Tightened font sizes & whitespace-nowrap to avoid line break   */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 border-b border-cyan-500/30 bg-[#050b1a]/95 backdrop-blur-md px-3 sm:px-4 py-2 shadow-[0_4px_25px_rgba(0,0,0,0.7)]">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
          
          {/* Logo & Logged-in User Information */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-emerald-500 via-cyan-600 to-indigo-600 p-[1px] shadow-[0_0_15px_rgba(16,185,129,0.5)] shrink-0">
              <div className="w-full h-full bg-[#050b1a] rounded-lg flex items-center justify-center">
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 animate-pulse" />
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-hud font-extrabold text-xl sm:text-2xl tracking-wider bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent leading-none">
                  AXAGE
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-hud uppercase">
                  Arena V3.0
                </span>
              </div>
              
              {/* Logged-in User Info: 지덱수, 화학본부 기술팀, 배지 DS, ML, SPS, PE, EDS */}
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                <div className="flex items-center gap-1 text-[11px] text-slate-200 font-semibold bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700 whitespace-nowrap">
                  <UserCheck className="w-3 h-3 text-cyan-400" />
                  <span className="text-cyan-300 font-bold">{LOGGED_IN_USER.name}</span>
                  <span className="text-slate-400 text-[10px]">({LOGGED_IN_USER.team})</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {LOGGED_IN_USER.badges.map((b, i) => (
                    <BadgePill key={i} badge={b} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Button: '배틀 그라운드 참여하기' (Replaces HOT NEWS) */}
          <button
            onClick={() => {
              sfx.playClick();
              setIsJoinBattleModalOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/25 via-emerald-500/25 to-cyan-500/25 hover:from-amber-500/40 hover:via-emerald-500/40 hover:to-cyan-500/40 border border-amber-400/60 hover:border-amber-300 text-amber-300 hover:text-white font-hud text-xs font-bold transition shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_22px_rgba(245,158,11,0.5)] shrink-0 active:scale-95 cursor-pointer"
            title="AXAGE 배틀 그라운드 참여하기"
          >
            <Swords className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="whitespace-nowrap font-extrabold tracking-wide">배틀 그라운드 참여하기</span>
            <Sparkles className="w-3 h-3 text-cyan-300" />
          </button>

          {/* Controls & Direct Link Action Button: Font sizes tightened to NEVER wrap */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition whitespace-nowrap shrink-0"
              title="AXAGE 방법론 안내"
            >
              <Compass className="w-3 h-3 shrink-0" />
              <span className="whitespace-nowrap">AXAGE 가이드</span>
            </button>

            <button
              onClick={toggleSound}
              className={`p-1 rounded-md border text-[10px] transition flex items-center justify-center shrink-0 ${
                soundEnabled
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
                  : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}
              title={soundEnabled ? '사운드 켜짐' : '사운드 음소거'}
            >
              {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
            </button>

            {/* '성과 자랑 참전': Text size tightened, whitespace-nowrap to avoid breaking line */}
            <a
              href="https://test35-rho.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded-md bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] transition transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3 h-3 shrink-0" />
              <span className="whitespace-nowrap">성과 자랑 참전</span>
              <ExternalLink className="w-2.5 h-2.5 ml-0.5 shrink-0" />
            </a>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. MAIN VIEWPORT                                               */}
      {/* ============================================================== */}
      <main className="flex-1 max-w-[1750px] w-full mx-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* ------------------------------------------------------------ */}
        {/* LEFT COLUMN: 교육, 시험 통과, 신규 과제 도전                */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-3 space-y-4 flex flex-col">
          {/* Card 1: AI Agent 교육과정 최신화 */}
          <div className="cyber-panel rounded-xl p-3.5 border-l-4 border-l-emerald-400 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/90 border border-emerald-500/40 text-[10px] font-hud font-bold text-emerald-300">
                <Bot className="w-3 h-3 text-emerald-400" /> V3.0 패치노트
              </span>
              <span className="text-[10px] text-emerald-400 font-hud">PATCH LIVE</span>
            </div>
            <h3 className="font-hud font-bold text-sm text-emerald-200 group-hover:text-emerald-100 transition">
              AXAGE 교육모듈 AI Agent 전면 최신화!
            </h3>
            <p className="text-xs text-slate-300 mt-1 line-clamp-2">
              단순 프롬프트를 넘어 자율 도구 실행(Tool-Calling)과 멀티 Agent 협업 기반의 자율운전 커리큘럼으로 대개편되었습니다.
            </p>
            <a
              href="https://test14-wyc8.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sfx.playClick()}
              className="mt-2.5 w-full py-1 text-center text-xs font-semibold rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-1 transition"
            >
              <span>Agent 커리큘럼 보기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: 교육 이수 & 시험 통과 명단 */}
          <div className="cyber-panel rounded-xl p-3.5 flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <h3 className="font-hud font-bold text-xs uppercase tracking-wide text-slate-200">
                  교육이수 & 시험합격 현황
                </h3>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                LIVE PASS
              </span>
            </div>

            <div className="mt-3 space-y-2.5 overflow-y-auto max-h-[300px] custom-scrollbar pr-1">
              <div className="bg-slate-900/90 rounded-lg p-2.5 border border-emerald-500/30 hover:border-emerald-500/60 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 박소연 프로 (소재개발Lab)
                  </span>
                  <span className="text-[10px] font-hud text-amber-300 font-extrabold bg-amber-950/60 px-1 rounded">
                    98점 PASS
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  AXAGE Master 검증 통과! <span className="text-cyan-400 font-semibold">[CL, ML, DS 배지 보유]</span>
                </p>
                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                  <span>자격인증: AX Innovation 센터</span>
                  <span>15분 전</span>
                </div>
              </div>

              <div className="bg-slate-900/90 rounded-lg p-2.5 border border-cyan-500/30 hover:border-cyan-500/60 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-cyan-400" /> 최민석 프로 (DX추진팀)
                  </span>
                  <span className="text-[10px] font-hud text-cyan-300 bg-cyan-950/60 px-1 rounded">
                    이수 완료
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  AI Agent & Tool Calling 실전 (40시간) 수료
                </p>
                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="text-amber-400 font-hud">XP +600 Boost</span>
                  <span>1시간 전</span>
                </div>
              </div>

              <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-700/60 hover:border-slate-600 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-teal-400" /> 윤지혜 프로 (데이터품질팀)
                  </span>
                  <span className="text-[10px] font-hud text-slate-300 bg-slate-800 px-1 rounded">
                    이수 완료
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  AXAGE 기초: 머신러닝 데이터 정제 & AI 활용 입문
                </p>
                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="text-slate-400">IS 기본 배지 획득</span>
                  <span>2시간 전</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: 신규 과제 도전 선포 */}
          <div className="cyber-panel rounded-xl p-3.5 flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" />
                <h3 className="font-hud font-bold text-xs uppercase tracking-wide text-slate-200">
                  신규 과제 도전 선포
                </h3>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30">
                NEW QUEST
              </span>
            </div>

            <div className="mt-3 space-y-2.5 overflow-y-auto max-h-[280px] custom-scrollbar pr-1">
              <div className="bg-slate-900/90 rounded-lg p-2.5 border border-amber-500/30 hover:border-amber-500/60 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">정우진 프로 품질전문가</span>
                  <span className="text-[10px] font-hud px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    STAGE: D
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-200 mt-1">
                  연속 정제라인 불순물 이상감지 및 자율제어 Agent
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  공정의 실시간 센서 변동을 사전에 감지해 손실 발생을 원천 차단하는 과제 착수!
                </p>
                <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-800 text-[10px]">
                  <span className="text-emerald-400 font-semibold">목표: 원료손실 1.5억 절감</span>
                  <button
                    onClick={() => {
                      sfx.playClick();
                      const h = hunters.find((u) => u.name.includes('정우진'));
                      if (h) handleHunterClick(h);
                    }}
                    className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/30"
                  >
                    말풍선 확인
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 hover:border-slate-700 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">오동석 프로 프로지원사</span>
                  <span className="text-[10px] font-hud px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    STAGE: G
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-200 mt-1">
                  생산라인 위험요소 실시간 비전 & 센서 Agent
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  센서 및 설비 데이터 RAG 통합으로 안전사고 0건화 달성 퀘스트!
                </p>
                <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-800 text-[10px]">
                  <span className="text-cyan-400 font-semibold">목표: 무재해 1,000일</span>
                  <span className="text-slate-500 font-hud">진행도 30%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* CENTER COLUMN: AXAGE 배틀 그라운드                           */}
        {/* Cleaned: No overlap with monster, No corner text badges      */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="cyber-panel rounded-2xl p-3 sm:p-4 relative overflow-hidden border border-emerald-500/40 shadow-[0_0_35px_rgba(16,185,129,0.15)] flex flex-col">
            
            {/* Arena Top Info Bar: 'AXAGE 배틀 그라운드' + 팝업 버튼 */}
            <div className="flex items-center justify-between text-xs mb-2 pb-2 border-b border-slate-800 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-hud font-bold flex items-center gap-1.5 text-xs">
                  <Swords className="w-4 h-4 text-emerald-400" />
                  AXAGE 배틀 그라운드
                </span>
                <span className="font-hud text-slate-400 text-[11px] hidden sm:inline">
                  유저를 클릭하여 도전성과를 확인하세요
                </span>
              </div>

              {/* 배틀그라운드 창 팝업하기 버튼 */}
              <button
                onClick={() => {
                  sfx.playClick();
                  setExpandedViewMode('arena');
                  setIsExpandedBattleModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/60 hover:border-emerald-400 text-emerald-300 hover:text-white font-hud text-[11px] font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0 active:scale-95 cursor-pointer"
                title="배틀그라운드 창 팝업하기 (와이드 사냥터 & 전체 인원 활동 내역)"
              >
                <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="whitespace-nowrap font-extrabold">배틀그라운드 창 팝업하기</span>
              </button>
            </div>

            {/* Target Monster Status: 목표 55억, 현재 달성 29억, 잔여 26억 */}
            <div className="mb-2 bg-slate-950/85 p-2.5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-red-950/90 border border-amber-500/60 flex items-center justify-center text-xl shadow">
                  💎
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-extrabold text-amber-300 font-hud tracking-wide">
                      재무성과 몬스터 : 목표 {targetGoal}억
                    </span>
                    <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/70 px-2 py-0.2 rounded border border-emerald-600/40">
                      현재 달성 {currentAchieved}억
                    </span>
                    <span className="text-[11px] text-rose-400 font-bold bg-rose-950/70 px-2 py-0.2 rounded border border-rose-600/40">
                      잔여 {remaining}억
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-36 sm:w-48 flex flex-col gap-0.5">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-hud">
                  <span>달성률</span>
                  <span className="text-amber-400 font-bold">{progressPercent}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-amber-500/40">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------- */}
            {/* BATTLE GROUND GRAPHIC CANVAS                            */}
            {/* -------------------------------------------------------- */}
            <div className="relative w-full h-[430px] sm:h-[470px] rounded-xl overflow-hidden bg-gradient-to-b from-[#0a1122] via-[#09152a] to-[#040814] border border-slate-700/80 shadow-inner">
              
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-emerald-500/20 animate-spin" style={{ animationDuration: '40s' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full border border-dashed border-cyan-500/20" />

              {/* CENTER MONSTER: Text & Title '재무성과 몬스터에 도전하시겠습니까?' */}
              <div
                onClick={() => {
                  sfx.playClick();
                  setIsChallengeModalOpen(true);
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transition transform z-10 hover:scale-105"
                title="재무성과 몬스터에 도전하시겠습니까?"
              >
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-red-950 via-slate-900 to-amber-950 border-2 border-amber-500/80 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                    <div className="text-4xl sm:text-5xl animate-bounce">
                      💎
                    </div>
                  </div>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-900 text-amber-200 border border-amber-500 text-[10px] font-hud font-black px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-lg">
                    재무성과 몬스터 : 목표 55억
                  </div>
                </div>
                <span className="text-[10px] font-hud text-amber-300 mt-1 font-bold animate-pulse text-center whitespace-nowrap">
                  재무성과 몬스터에 도전하시겠습니까?
                </span>
              </div>

              {/* 10 HUNTER CHARACTERS ON FIELD (Z-INDEX 20) */}
              {/* Arranged in open ring so center monster and Lee Seong-hun never overlap */}
              {hunters.map((hunter, index) => {
                const isActive = activeHunterId === hunter.id;
                const wanderClass = `animate-wander-${index % 4}`;
                return (
                  <div
                    key={hunter.id}
                    onClick={() => handleHunterClick(hunter)}
                    className="absolute cursor-pointer transition-all duration-300 z-20 group"
                    style={{
                      left: `${hunter.xPercent}%`,
                      top: `${hunter.yPercent}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {/* Dynamic 4-Direction Walking Patrol Container */}
                    <div
                      className={`flex flex-col items-center transition-transform ${
                        isActive
                          ? 'z-30 scale-105'
                          : `${wanderClass} group-hover:[animation-play-state:paused]`
                      }`}
                    >
                      {/* Name Tag without brackets [*] */}
                      <div className="flex items-center gap-1.5 bg-black/85 px-2 py-0.5 rounded text-[10px] font-hud border border-slate-700 whitespace-nowrap mb-0.5 shadow">
                        <span className="text-amber-300 font-extrabold">{hunter.name}</span>
                        <span className="text-slate-300 font-medium">{hunter.role}</span>
                      </div>

                      {/* Badges Bar (3~7 badges) */}
                      <div className="flex items-center gap-0.5 mb-1 max-w-[110px] flex-wrap justify-center">
                        {hunter.badges.map((b, i) => (
                          <BadgePill key={i} badge={b} />
                        ))}
                      </div>

                      {/* 2등신 Chibi Hunter Character (상하좌우 동적 보행 & 발걸음 애니메이션) */}
                      <ChibiHunterCharacter
                        hunter={hunter}
                        isActive={isActive}
                        wanderIndex={index % 4}
                        size="normal"
                      />

                      {/* Health / Activity Bar */}
                      <div className="w-10 h-1 bg-slate-900 rounded-full mt-1.5 overflow-hidden border border-slate-700">
                        <div className="h-full bg-emerald-500 w-full" />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* SCREEN-CLAMPED, CUTOFF-FREE SPEECH BUBBLE (Z-50) */}
              {activeHunter && (
                <div
                  className="absolute z-50 transition-all duration-300 pointer-events-auto"
                  style={bubbleStyle}
                >
                  <div className="relative w-64 sm:w-72 p-3 rounded-2xl bg-[#061126]/95 border-2 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.75)] backdrop-blur-md text-left">
                    {/* Header */}
                    <div className="flex items-center justify-between text-[11px] text-amber-300 font-hud font-bold mb-1.5 border-b border-emerald-500/30 pb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{activeHunter.avatar}</span>
                        <span>{activeHunter.name} {activeHunter.role}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveHunterId(null);
                        }}
                        className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-slate-800"
                        title="닫기"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Speech statement */}
                    <p className="text-xs text-white font-semibold leading-relaxed">
                      "{activeHunter.bragDialogue}"
                    </p>

                    {/* Footer */}
                    <div className="mt-2 flex items-center justify-between text-[10px] text-emerald-300 pt-1 border-t border-slate-800/80">
                      <span className="text-slate-400 font-hud truncate max-w-[140px]">{activeHunter.toolName}</span>
                      <span className="font-hud font-bold text-amber-400">배지 {activeHunter.badges.length}개 보유</span>
                    </div>

                    {/* Dynamic Pointer Tail */}
                    {isBubbleBelow ? (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[10px] border-b-emerald-400 drop-shadow" />
                    ) : (
                      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-emerald-400 drop-shadow" />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Currently Active Hunter Summary Bar */}
            {activeHunter && (
              <div className="mt-3 p-3 bg-slate-950/90 rounded-xl border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/60 flex items-center justify-center text-2xl shadow">
                    {activeHunter.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-hud font-bold text-sm text-emerald-300">
                        {activeHunter.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {activeHunter.team} • {activeHunter.role}
                      </span>
                      <div className="flex items-center gap-1">
                        {activeHunter.badges.map((b, i) => (
                          <BadgePill key={i} badge={b} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                      🎯 {activeHunter.achievementSummary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sfx.playAction();
                      alert(`[${activeHunter.name}] 님의 성과: ${activeHunter.achievementSummary}`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-hud font-bold text-xs border border-slate-700 transition"
                  >
                    상세 프로필
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* REAL-TIME BOAST & ACHIEVEMENT STREAM */}
          <div className="cyber-panel rounded-2xl p-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Swords className="w-5 h-5 text-emerald-400" />
                <h3 className="font-hud font-bold text-sm tracking-wide text-emerald-200">
                  아레나 성과 자랑 피드 (Boast & Achievement Feed)
                </h3>
              </div>
              <a
                href="https://test35-rho.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-600/40"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>내 성과도 자랑하기</span>
              </a>
            </div>

            <div className="mt-3 space-y-3 overflow-y-auto max-h-[460px] custom-scrollbar pr-1">
              {boasts.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBoast(b)}
                  className="group relative bg-[#091228]/85 hover:bg-[#0c1835] border border-slate-800 hover:border-emerald-500/60 rounded-xl p-3.5 transition cursor-pointer shadow-md hover:shadow-emerald-950/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sm shadow">
                        {b.role === '제조사' ? '⚙️' : b.role === '연구사' ? '🔬' : b.role === '품질전문가' ? '🛡️' : '💻'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-200">{b.author}</span>
                          <span className="text-[11px] text-slate-400">({b.team} • {b.role})</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-hud font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                        {b.stageName}
                      </span>
                      <span
                        className={`text-[10px] font-hud font-bold px-1.5 py-0.5 rounded border ${
                          b.hasGoldCrown
                            ? 'bg-amber-950 text-amber-300 border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                            : 'bg-slate-800 text-slate-300 border-slate-600'
                        }`}
                      >
                        배지 {b.badgesCount}개 보유 {b.hasGoldCrown ? '👑' : ''}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition">
                    {b.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {b.description}
                  </p>

                  {(b.metrics || b.savings) && (
                    <div className="mt-2.5 p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                      {b.metrics && (
                        <div className="flex items-center gap-1 text-emerald-300 font-semibold text-[11px]">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{b.metrics}</span>
                        </div>
                      )}
                      {b.savings && (
                        <div className="flex items-center gap-1 text-amber-300 font-bold text-[11px]">
                          <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{b.savings}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] font-hud text-rose-400 font-semibold flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-rose-400" />
                      재무성과 기여: -₩{b.damage.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sfx.playAction();
                        }}
                        className="flex items-center gap-1 hover:text-rose-400 transition"
                      >
                        <span>🔥</span>
                        <span className="font-hud font-bold">{b.likes}</span>
                      </button>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{b.commentsCount}</span>
                      </span>
                      <span className="text-[10px] text-slate-500">{b.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* RIGHT COLUMN: 사내강사, 골드크라운, 공식 RMI 특급 보상       */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-3 space-y-4 flex flex-col">
          
          {/* Card 1: 골드크라운 획득자 쇼케이스 */}
          <div className="cyber-gold-panel rounded-xl p-3.5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-950/90 border border-amber-500/60 text-[10px] font-hud font-bold text-amber-300">
                <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> 명예의 전당
              </span>
              <span className="text-[10px] text-amber-400 font-hud tracking-wider animate-pulse">
                GOLD CROWN
              </span>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 p-[2px] shadow-[0_0_15px_rgba(245,158,11,0.6)]">
                <div className="w-full h-full bg-[#181005] rounded-xl flex items-center justify-center text-2xl">
                  👑
                </div>
              </div>
              <div>
                <h4 className="font-hud font-bold text-sm text-amber-200">
                  이성훈 프로 사업전략가
                </h4>
                <p className="text-[11px] text-amber-300/80 font-medium">
                  사내강사 최고 등급 [골드크라운] 수여
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-bold">ML</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-600 text-white font-bold">DS</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-slate-900 text-slate-100 border border-slate-600 font-bold">PP</span>
                  <span className="text-[10px] text-amber-300 font-bold ml-1">외 4개 (총 7개)</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
              누적 180시간 과제 지도, 사내강사 강의 평점 9.9점! 지도한 14개 과제 중 12건이 전사 핵심 과제로 채택되어 최고 영예 골드크라운을 획득하셨습니다.
            </p>

            <div className="mt-3 p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 flex items-center justify-between text-xs">
              <span className="text-amber-400 font-hud text-[11px]">누적 수강생: 420명</span>
              <span className="text-amber-300 font-bold text-[11px]">만족도 9.9 / 10.0</span>
            </div>
          </div>

          {/* Card 2: 공식 RMI (Roll Model Incentive) 보상 (Realistic 50만~200만원) */}
          <div className="cyber-panel rounded-xl p-3.5 border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-[10px] font-hud font-bold text-purple-300">
                <Gift className="w-3.5 h-3.5 text-purple-400" /> 공식 RMI 보상 발표
              </span>
              <span className="text-[10px] text-purple-400 font-hud">2026 RMI</span>
            </div>

            <h4 className="font-hud font-bold text-sm text-purple-200">
              2026 상반기 RMI (Roll Model Incentive)
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              회사의 공식 보상 정책인 RMI(Roll Model Incentive)에 따라, 자율제어 최적화 과제로 성과를 창출한 팀에게 성과급(50만~200만원)을 수여했습니다.
            </p>

            <div className="mt-2.5 space-y-1.5 text-xs">
              <div className="p-2 rounded bg-slate-900/90 border border-purple-500/20 flex items-center justify-between">
                <span className="text-slate-300 font-medium">대상: 한지원 프로 팀 (제조사)</span>
                <span className="text-purple-300 font-bold font-hud">RMI 인센티브 200만원</span>
              </div>
              <div className="p-2 rounded bg-slate-900/90 border border-purple-500/20 flex items-center justify-between">
                <span className="text-slate-300 font-medium">우수: 신소재 연구팀 & 정제라인팀</span>
                <span className="text-purple-300 font-bold font-hud">각 100만원</span>
              </div>
              <div className="p-2 rounded bg-slate-900/90 border border-purple-500/20 flex items-center justify-between">
                <span className="text-slate-300 font-medium">사내강사 특별 RMI: 이성훈 프로</span>
                <span className="text-purple-300 font-bold font-hud">50만원 + 골드패</span>
              </div>
            </div>

            <button
              onClick={() => {
                sfx.playClick();
                setIsRewardModalOpen(true);
              }}
              className="mt-3 w-full py-1 text-xs font-semibold rounded bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-500/30 transition flex items-center justify-center gap-1"
            >
              <span>전체 RMI 보상 내역 보기</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: 사내강사 긴급 모집공고 */}
          <div className="cyber-panel rounded-xl p-3.5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-[10px] font-hud font-bold text-rose-300">
                  <Users className="w-3.5 h-3.5 text-rose-400" /> RE-CRUIT
                </span>
                <span className="text-[10px] text-rose-400 font-hud animate-pulse">
                  모집 마감 D-5
                </span>
              </div>

              <h4 className="font-hud font-bold text-sm text-slate-100">
                [모집] 'AI Agent 실무' 사내강사 초빙
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                AX Innovation 센터에서는 하반기 공정 자율운전 확산을 이끌 신임 사내강사를 긴급 초빙합니다!
              </p>

              <div className="mt-2.5 p-2 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1 text-xs text-slate-300">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">강의 모듈:</span>
                  <span className="text-emerald-300 font-semibold">AXAGE 모듈 4 (Agent 실습)</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">강사 특전:</span>
                  <span className="text-amber-300 font-bold">강사료 200% 우대 & 골드크라운 가점</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                sfx.playClick();
                setIsAcademyModalOpen(true);
              }}
              className="mt-3 w-full py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white transition shadow-md flex items-center justify-center gap-1.5"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>사내강사 지원하기</span>
            </button>
          </div>
        </div>
      </main>

      {/* ============================================================== */}
      {/* 3. BOTTOM FLOATING INTERACTIVE ACTION DOCK                     */}
      {/* ============================================================== */}
      <footer className="sticky bottom-0 z-40 border-t border-emerald-500/30 bg-[#040816]/95 backdrop-blur-md px-4 py-2.5 shadow-[0_-4px_25px_rgba(0,0,0,0.8)]">
        <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Webtoon Promo Button */}
          <button
            onClick={() => {
              sfx.playClick();
              setIsWebtoonModalOpen(true);
            }}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 hover:from-amber-500/30 hover:to-red-500/30 border border-amber-500/50 text-amber-200 transition group shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-500/30 flex items-center justify-center text-base group-hover:scale-110 transition">
              🎨
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-hud font-bold px-1 rounded bg-amber-400 text-slate-950">
                  NEW WEBTOON
                </span>
                <span className="text-xs font-bold text-amber-300">
                  웹툰 '덱수의 와이낫' Ep.14 업데이트!
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                "AXAGE로 하자니까 수기 엑셀 매크로 주신 라떼 팀장님 편"
              </p>
            </div>
          </button>

          {/* Center: SOS Help Beacon */}
          <button
            onClick={() => {
              sfx.playClick();
              setIsSosModalOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 border border-rose-500/50 text-rose-200 transition group animate-pulse"
          >
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
            <div className="text-left">
              <span className="text-xs font-bold text-rose-300 flex items-center gap-1">
                [S.O.S 공정 과제 지원요청]
              </span>
              <span className="text-[10px] text-slate-300 hidden md:inline">
                "반응기 온도 급변 구간에서 Agent 제어 발산 문제 도와주실 프로님 급구!"
              </span>
            </div>
            <span className="text-[10px] font-hud font-bold px-1.5 py-0.5 rounded bg-rose-500 text-white ml-1">
              지원 {sosComments.length}건
            </span>
          </button>

          {/* Right: '내성과 등록, 사냥터 참전' -> https://test35-rho.vercel.app/ */}
          <a
            href="https://test35-rho.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-hud font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.5)] transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Swords className="w-4 h-4" />
            <span>내성과 등록, 사냥터 참전</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>
      </footer>

      {/* ============================================================== */}
      {/* 4. MODALS & POPUPS                                             */}
      {/* ============================================================== */}

      {/* 과제 도전 팝업 (https://test35-rho.vercel.app/) */}
      {isChallengeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="cyber-panel rounded-2xl w-full max-w-md p-6 border-2 border-amber-500/80 shadow-[0_0_40px_rgba(245,158,11,0.4)] text-center relative">
            <button
              onClick={() => setIsChallengeModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg">
              💎
            </div>

            <h3 className="font-hud font-extrabold text-xl text-amber-300 mb-1">
              재무성과 몬스터 : 목표 55억
            </h3>
            <p className="text-base font-bold text-slate-100 my-3">
              과제에 도전하시겠습니까?
            </p>
            <p className="text-xs text-slate-400 mb-6">
              AI 혁신 과제 시스템으로 연결되어 신규 과제를 등록하고 55억 재무성과 달성에 출격합니다.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsChallengeModalOpen(false)}
                className="flex-1 py-2.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                아니오
              </button>
              <a
                href="https://test35-rho.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsChallengeModalOpen(false)}
                className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg flex items-center justify-center gap-1.5 transition transform hover:scale-105"
              >
                <span>예 (과제 도전하기)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 사내강사 아카데미 출격 팝업 (https://test14-wyc8.vercel.app/) */}
      {isAcademyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="cyber-panel rounded-2xl w-full max-w-md p-6 border-2 border-emerald-500/80 shadow-[0_0_40px_rgba(16,185,129,0.4)] text-center relative">
            <button
              onClick={() => setIsAcademyModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-400 to-cyan-500 flex items-center justify-center text-3xl shadow-lg">
              🎓
            </div>

            <h3 className="font-hud font-extrabold text-xl text-emerald-300 mb-1">
              AXAGE 아카데미 사내강사
            </h3>
            <p className="text-base font-bold text-slate-100 my-3">
              AXAGE 아카데미로 출격하시겠습니까?
            </p>
            <p className="text-xs text-slate-400 mb-6">
              사내강사 양성 및 인증 시스템으로 이동하여 강의 신청 및 골드크라운 마스터 트랙에 참여합니다.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsAcademyModalOpen(false)}
                className="flex-1 py-2.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                아니오
              </button>
              <a
                href="https://test14-wyc8.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsAcademyModalOpen(false)}
                className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg flex items-center justify-center gap-1.5 transition transform hover:scale-105"
              >
                <span>예 (출격하기)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 웹툰 '덱수의 와이낫' 뷰어 모달 */}
      {isWebtoonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="cyber-panel rounded-2xl w-full max-w-2xl p-5 border border-amber-500/50 shadow-2xl relative max-h-[92vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setIsWebtoonModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-amber-500/30">
              <span className="text-3xl">🎨</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-hud font-extrabold text-lg text-amber-300">
                    AXAGE 공감 웹툰 : '덱수의 와이낫'
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500 font-hud">
                    EPISODE 14 최신화
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  "AXAGE로 하자니까 수기 엑셀 매크로 주신 라떼 팀장님 편"
                </p>
              </div>
            </div>

            {/* Webtoon Panels */}
            <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="bg-[#12182b] p-3.5 rounded-xl border border-slate-700 relative">
                <div className="text-[10px] font-hud text-cyan-400 mb-1">#CUT 1 : 야근의 늪</div>
                <div className="flex items-center gap-3">
                  <div className="text-4xl">😵‍💫</div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-700 text-xs text-slate-200 flex-1">
                    <p className="font-bold text-amber-300 mb-0.5">덱수 (입사 2년차 엔지니어):</p>
                    "선배님, 우리 이번 공정 센서 데이터 50만 행 수기 피벗 돌리다가 엑셀 4번째 튕겼는데요...?"
                  </div>
                </div>
              </div>

              <div className="bg-[#12182b] p-3.5 rounded-xl border border-slate-700 relative">
                <div className="text-[10px] font-hud text-amber-400 mb-1">#CUT 2 : 팀장님의 솔루션(?)</div>
                <div className="flex items-center gap-3">
                  <div className="text-4xl">👴🏻</div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-700 text-xs text-slate-200 flex-1">
                    <p className="font-bold text-rose-300 mb-0.5">라떼 팀장님:</p>
                    "어이 덱수군! 내가 2005년에 쓰던 '수기데이터_피벗_진짜최종.xlsm' 매크로 파일 줄 테니까 수식 복붙해서 아침까지 돌려봐!"
                  </div>
                </div>
              </div>

              <div className="bg-[#12182b] p-3.5 rounded-xl border border-slate-700 relative">
                <div className="text-[10px] font-hud text-emerald-400 mb-1">#CUT 3 : AXAGE의 강림!</div>
                <div className="flex items-center gap-3">
                  <div className="text-4xl">👑</div>
                  <div className="bg-gradient-to-r from-emerald-950 to-teal-950 p-3 rounded-lg border border-emerald-500/50 text-xs text-emerald-100 flex-1">
                    <p className="font-bold text-emerald-300 mb-0.5">골드크라운 이성훈 프로 등장:</p>
                    "멈추세요! 이제 수기 엑셀 노가다는 끝났습니다. <br/>
                    <span className="text-amber-300 font-bold">AXAGE 방법론</span>과 AI Agent를 연결하면 50만 건 센서 시계열 분석 및 최적 운전 조건 도출이 3초 만에 끝납니다!"
                  </div>
                </div>
              </div>

              <div className="bg-[#12182b] p-3.5 rounded-xl border border-slate-700 relative">
                <div className="text-[10px] font-hud text-purple-400 mb-1">#CUT 4 : 기적의 정시 퇴근</div>
                <div className="flex items-center gap-3">
                  <div className="text-4xl">😎🍹</div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-700 text-xs text-slate-200 flex-1">
                    <p className="font-bold text-cyan-300 mb-0.5">덱수:</p>
                    "와... Agent 앱으로 만들었더니 연간 3.8억 절감하고 오후 5시 30분 칼퇴! 이게 바로 AXAGE 혁신의 맛이구나!"
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span className="text-amber-400 font-hud">조회수 14,200회 • 좋아요 2,140개</span>
              <button
                onClick={() => {
                  sfx.playFanfare();
                  alert('🎨 덱수의 와이낫 공감 투표 완료!');
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1"
              >
                <span>👍 극공감 투표</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* S.O.S 과제 지원 요청 */}
      {isSosModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="cyber-panel rounded-2xl w-full max-w-xl p-5 border border-rose-500/50 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setIsSosModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-rose-500/30">
              <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-500 flex items-center justify-center text-xl text-rose-400 animate-pulse">
                🚨
              </div>
              <div>
                <h3 className="font-hud font-bold text-lg text-rose-300">
                  S.O.S 긴급 과제 지원 요청
                </h3>
                <p className="text-xs text-slate-400">
                  공정 과제 수행 중 막히는 난제나 AXAGE 적용 애로사항을 동료들과 함께 해결하세요!
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/30 mb-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span className="font-bold text-rose-300">요청자: 강선우 프로 (공정기술팀)</span>
                <span className="text-[10px] font-hud text-slate-500">2시간 전 등록</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">
                "반응기 온도 급변 구간에서 자율제어 Agent 제어 신호가 발산합니다. 도와주세요!"
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Analyze 단계에서 시뮬레이션 모델과 LangGraph Agent를 연동했는데, 외기 온도가 변할 때 냉각수 밸브 오버슈트 현상이 발생합니다. 시계열 제어 경험자 프로님들의 지혜를 구합니다!
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                  과제: 반응기 연속 최적제어 Agent
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  기술스택: DCS 센서, Python, LangGraph
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4 max-h-[180px] overflow-y-auto custom-scrollbar">
              <h5 className="text-xs font-bold text-slate-300">동료 프로님들의 조언 ({sosComments.length})</h5>
              {sosComments.map((comment, idx) => (
                <div key={idx} className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-200">
                  {comment}
                </div>
              ))}
            </div>

            <form onSubmit={handleAddSosComment} className="flex gap-2">
              <input
                type="text"
                placeholder="공정 노하우나 기술 조언을 작성해주세요"
                value={mySosComment}
                onChange={(e) => setMySosComment(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>답변</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RMI 공식 보상 내역 모달 */}
      {isRewardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="cyber-panel rounded-2xl w-full max-w-xl p-5 border border-purple-500/50 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setIsRewardModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🎁</span>
              <div>
                <h3 className="font-hud font-bold text-lg text-purple-200">
                  회사 공식 RMI (Roll Model Incentive) 보상 체계
                </h3>
                <p className="text-xs text-slate-400">
                  RMI(Roll Model Incentive)는 실질적 재무성과와 프로세스 혁신을 이끈 프로님들을 위한 우리 회사의 공식 보상 정책입니다.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/40">
                <div className="flex items-center justify-between text-xs font-bold text-purple-300 mb-1">
                  <span>🏆 전사 RMI 대상 (1팀)</span>
                  <span className="font-hud text-amber-300 font-extrabold">RMI 200만원 포상</span>
                </div>
                <p className="text-xs text-slate-300">
                  운전 최적화 Agent 앱 개발팀 (한지원 프로 팀)
                </p>
                <div className="text-[11px] text-slate-400 mt-1">
                  부상: 글로벌 AI 콘퍼런스 참가권 & 최우수 혁신 롤모델 인증
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-300 mb-1">
                  <span>🥈 최우수 혁신상 (2팀)</span>
                  <span className="font-hud text-emerald-300 font-bold">인센티브 각 100만원</span>
                </div>
                <p className="text-xs text-slate-300">
                  신소재 분자예측 머신러닝 연구팀, 정제라인 안전자율제어팀
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300 mb-1">
                  <span>👑 최고 사내강사 명예 전당 (1명)</span>
                  <span className="font-hud text-amber-300 font-bold">골드크라운 RMI 50만원 & 포상패</span>
                </div>
                <p className="text-xs text-slate-300">
                  이성훈 프로 (누적 180시간 지도, 전사 최고 평점 9.9점)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Agent 패치노트 */}
      {isPatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="cyber-panel rounded-2xl w-full max-w-xl p-5 border border-emerald-500/50 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setIsPatchModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-2xl text-emerald-400">
                🤖
              </div>
              <div>
                <h3 className="font-hud font-bold text-lg text-emerald-200">
                  AXAGE AI Agent 교육 V3.0 패치노트
                </h3>
                <p className="text-xs text-slate-400">
                  실시간 설비 센서와 도면 데이터를 자율 실행하는 신규 교육 트랙
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-900 rounded-lg border border-emerald-500/30">
                <h4 className="font-bold text-emerald-300 mb-1">
                  1. 공정 도면 및 센서 시계열 Tool-Calling 연결
                </h4>
                <p className="text-slate-400">
                  단순 질의응답을 넘어, DCS 실시간 반응 센서 및 제어 밸브 API를 Agent가 직접 호출하는 실습 환경을 제공합니다.
                </p>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-emerald-500/30">
                <h4 className="font-bold text-emerald-300 mb-1">
                  2. AXAGE 4단계 실전 템플릿 코드 배포
                </h4>
                <p className="text-slate-400">
                  단위공정 정의 ➔ 센서 RAG 지식베이스 ➔ 수율 예측 ML Agent ➔ 조업 인하우스 앱 런칭 전 과정의 파이프라인이 탑재되어 있습니다.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  sfx.playFanfare();
                  alert('V3.0 AI Agent 교육 수강신청이 완료되었습니다!');
                  setIsPatchModalOpen(false);
                }}
                className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition"
              >
                지금 수강 신청하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AXAGE 방법론 가이드 */}
      {isGuideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="cyber-panel rounded-2xl w-full max-w-2xl p-5 border border-emerald-500/50 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setIsGuideModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-xl text-emerald-400">
                📐
              </div>
              <div>
                <h3 className="font-hud font-bold text-lg text-emerald-200">
                  AXAGE 방법론 개요 & 배지 체계
                </h3>
                <p className="text-xs text-slate-400">
                  머신러닝과 AI Agent를 결합한 차세대 구조적 문제해결 프로세스
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-4">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="font-hud font-bold text-slate-400 block mb-1">
                  과거 수기 관리 방식
                </span>
                <ul className="space-y-1.5 text-slate-400 text-[11px]">
                  <li>• 수동 결함서 작성 및 엑셀 취합</li>
                  <li>• 단편적 샘플링 측정에 의존</li>
                  <li>• 사후 수기 분석 및 조치 지연</li>
                </ul>
              </div>

              <div className="p-3 bg-gradient-to-br from-emerald-950/70 to-slate-900 rounded-xl border border-emerald-500/40">
                <span className="font-hud font-bold text-emerald-300 block mb-1">
                  AXAGE 자율운전 체계
                </span>
                <ul className="space-y-1.5 text-emerald-100 text-[11px]">
                  <li>• 단위공정 정의 & AI 적용 지점 발굴</li>
                  <li>• 실시간 시계열 센서 & 도면 RAG 구축</li>
                  <li>• 멀티 Agent 수율 예측 & 파라미터 자동 도출</li>
                  <li>• 인하우스 자율운전 앱 배포 & 지속적 절감</li>
                </ul>
              </div>
            </div>

            <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-500/40 text-xs">
              <span className="font-bold text-amber-300">🏅 공식 배지 체계:</span>
              <p className="text-slate-300 text-[11px] mt-1">
                IS, DS, ML, SPS, PP, EDS, VS, AU, PE, VC, CL 등 11개 분야 배지(노랑, 녹색, 블랙)를 획득하며, 실버크라운 및 골드크라운을 수여받아 사내 최고 마스터로 성장합니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 상세 성과 보기 모달 */}
      {selectedBoast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="cyber-panel rounded-2xl w-full max-w-lg p-5 border border-emerald-500/50 shadow-2xl relative">
            <button
              onClick={() => setSelectedBoast(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl">
                {selectedBoast.role === '제조사' ? '⚙️' : selectedBoast.role === '연구사' ? '🔬' : selectedBoast.role === '품질전문가' ? '🛡️' : '💻'}
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-100">
                  {selectedBoast.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedBoast.author} • {selectedBoast.team} {selectedBoast.role} • {selectedBoast.timestamp}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-200 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="leading-relaxed">{selectedBoast.description}</p>
              {selectedBoast.metrics && (
                <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-semibold">
                  📊 {selectedBoast.metrics}
                </div>
              )}
              {selectedBoast.savings && (
                <div className="p-2 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300 font-bold">
                  💰 {selectedBoast.savings}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-rose-400 font-hud">
                기여 데미지: -₩{selectedBoast.damage.toLocaleString()}
              </span>
              <button
                onClick={() => {
                  sfx.playClick();
                  const hunter = hunters.find((h) => h.name.includes(selectedBoast.author.split(' ')[0]));
                  if (hunter) handleHunterClick(hunter);
                  setSelectedBoast(null);
                }}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5"
              >
                <Swords className="w-4 h-4" />
                <span>배틀 그라운드에서 말풍선 보기</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 배틀 그라운드 참여하기 모달 */}
      {isJoinBattleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="cyber-panel rounded-2xl w-full max-w-xl p-5 border border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.3)] relative max-h-[92vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setIsJoinBattleModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-[2px] shadow-[0_0_15px_rgba(245,158,11,0.5)] shrink-0">
                <div className="w-full h-full bg-[#0a1224] rounded-[10px] flex items-center justify-center text-xl">
                  ⚔️
                </div>
              </div>
              <div>
                <h3 className="font-hud font-bold text-lg text-amber-200">
                  배틀 그라운드 참여하기
                </h3>
                <p className="text-xs text-slate-400">
                  AXAGE 필드에 직접 내 의견·지원요청을 등록하고 참전하세요
                </p>
              </div>
            </div>

            {/* 1. 참여 안내 */}
            <div className="p-3.5 bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/50 rounded-xl border border-amber-500/40 mb-4">
              <div className="flex items-center gap-2 mb-1.5 text-amber-300 font-hud font-bold text-xs">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>참여 안내</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                AXAGE에 대한 <strong className="text-amber-300 font-bold">궁금함, 의견, 지원요청</strong> 등 무엇이든 자유롭게 입력해도 좋습니다.
              </p>
              <div className="mt-2 pt-2 border-t border-amber-500/20 text-[11px] text-emerald-300 flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400 mt-0.5" />
                <span>
                  입력완료 시 배틀 그라운드에 글이 즉시 업로드되며, 캐릭터를 클릭하면 작성하신 의견이 말풍선으로 모두에게 표시됩니다.
                </span>
              </div>
            </div>

            {/* 2. 입력 필드 폼 */}
            <form onSubmit={handleJoinBattleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-hud font-semibold text-slate-300 mb-1">
                    참여자 성명 (프로)
                  </label>
                  <input
                    type="text"
                    value={joinName}
                    onChange={(e) => setJoinName(e.target.value)}
                    placeholder="예: 지덱수 프로"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-hud font-semibold text-slate-300 mb-1">
                    소속 부서 / 팀
                  </label>
                  <input
                    type="text"
                    value={joinTeam}
                    onChange={(e) => setJoinTeam(e.target.value)}
                    placeholder="예: 화학본부 기술팀"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400 transition"
                    required
                  />
                </div>
              </div>

              {/* 직무 기능 선택 */}
              <div>
                <label className="block text-xs font-hud font-semibold text-slate-300 mb-1.5">
                  직무 기능 선택
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_ROLES.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setJoinRole(role)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-hud transition flex items-center gap-1 border ${
                        joinRole === role
                          ? 'bg-amber-500/25 border-amber-400 text-amber-300 font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{ROLE_AVATARS[role]}</span>
                      <span>{role}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 내용 입력 필드 */}
              <div>
                <label className="block text-xs font-hud font-semibold text-slate-300 mb-1">
                  참여 내용 (궁금함 / 의견 / 지원요청 / 성과 자랑 등)
                </label>
                <textarea
                  rows={4}
                  value={joinOpinion}
                  onChange={(e) => setJoinOpinion(e.target.value)}
                  placeholder="AXAGE에 대한 궁금함, 의견, 현장 지원요청, 도전 성과 등을 자유롭게 입력하세요..."
                  className="w-full px-3 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-amber-400 transition custom-scrollbar leading-relaxed"
                  required
                />
              </div>

              {/* 3. 하단 입력완료 버튼 */}
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-800">
                <span className="text-[11px] text-slate-400">
                  * 10인 중 1인을 교체하여 배틀 그라운드에 즉시 실시간 업로드됩니다.
                </span>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-hud shadow-[0_0_20px_rgba(245,158,11,0.4)] transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <Swords className="w-3.5 h-3.5 text-slate-950" />
                  <span>입력완료</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 배틀그라운드 창 팝업하기 모달 (더 많은 인원들의 활동 내역 보기) */}
      {isExpandedBattleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="cyber-panel rounded-2xl w-full max-w-6xl max-h-[94vh] flex flex-col border border-emerald-500/60 shadow-[0_0_60px_rgba(16,185,129,0.35)] relative overflow-hidden bg-[#060c1c]/95">
            
            {/* Modal Header Bar */}
            <div className="p-3.5 sm:p-4 border-b border-emerald-500/30 flex items-center justify-between flex-wrap gap-2.5 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-[#071329]">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-[2px] shadow-[0_0_15px_rgba(16,185,129,0.6)] shrink-0">
                  <div className="w-full h-full bg-[#071329] rounded-[10px] flex items-center justify-center text-xl">
                    ⚔️
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-hud font-extrabold text-base sm:text-lg text-emerald-200 tracking-wide">
                      AXAGE 배틀 그라운드 전사 통합 현황판
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] font-hud font-bold rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow">
                      총 {expandedList.length}인 참전 중
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-hud font-bold rounded-full bg-amber-950 text-amber-300 border border-amber-500/50">
                      재무성과 몬스터 : 55억 중 29억 달성
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    10인을 넘어 전사 인원들의 AI 과제 도전, 배지 획득 및 성과 자랑 활동 내역을 확인하세요
                  </p>
                </div>
              </div>

              {/* View Switcher & Close Button */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-700 text-xs">
                  <button
                    onClick={() => {
                      sfx.playClick();
                      setExpandedViewMode('arena');
                    }}
                    className={`px-2.5 py-1 rounded-md font-hud font-semibold transition flex items-center gap-1 ${
                      expandedViewMode === 'arena'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Swords className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">와이드 사냥터</span>
                    <span className="sm:hidden">사냥터</span>
                  </button>
                  <button
                    onClick={() => {
                      sfx.playClick();
                      setExpandedViewMode('cards');
                    }}
                    className={`px-2.5 py-1 rounded-md font-hud font-semibold transition flex items-center gap-1 ${
                      expandedViewMode === 'cards'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">활동 내역 피드</span>
                    <span className="sm:hidden">피드</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsExpandedBattleModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
                  title="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-3 bg-[#0a152e]/90 border-b border-slate-800 flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between shrink-0">
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={expandedSearchTerm}
                  onChange={(e) => setExpandedSearchTerm(e.target.value)}
                  placeholder="참여자 성명, 부서, 직무, 성과 키워드 검색..."
                  className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-400 transition"
                />
                {expandedSearchTerm && (
                  <button
                    onClick={() => setExpandedSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Role filter buttons */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                <button
                  onClick={() => {
                    sfx.playClick();
                    setExpandedRoleFilter('ALL');
                  }}
                  className={`px-2 py-1 text-[11px] rounded-md font-hud whitespace-nowrap transition border ${
                    expandedRoleFilter === 'ALL'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                      : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  전체 ({expandedList.length})
                </button>
                {ALL_ROLES.map((role) => {
                  const count = expandedList.filter((h) => h.role === role).length;
                  return (
                    <button
                      key={role}
                      onClick={() => {
                        sfx.playClick();
                        setExpandedRoleFilter(role);
                      }}
                      className={`px-2 py-1 text-[11px] rounded-md font-hud whitespace-nowrap transition border flex items-center gap-1 ${
                        expandedRoleFilter === role
                          ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 font-bold'
                          : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{ROLE_AVATARS[role]}</span>
                      <span>{role} ({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Stage Filter */}
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[10px] text-slate-400 font-hud">단계:</span>
                {['ALL', 'D', 'G', 'A', 'P'].map((stage) => (
                  <button
                    key={stage}
                    onClick={() => {
                      sfx.playClick();
                      setExpandedStageFilter(stage);
                    }}
                    className={`px-1.5 py-0.5 text-[10px] rounded font-hud font-bold border transition ${
                      expandedStageFilter === stage
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {stage === 'ALL' ? '전체' : stage}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-4 bg-gradient-to-b from-[#060c1c] via-[#050b18] to-[#040814]">
              
              {/* VIEW 1: Cards View (Default) */}
              {expandedViewMode === 'cards' && (
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-1 border-b border-slate-800">
                    <span>
                      검색 및 필터 결과: <strong className="text-emerald-300 font-bold">{filteredExpandedHunters.length}명</strong>의 활동 내역
                    </span>
                    <span className="text-[11px] text-amber-300">
                      💡 각 카드의 말풍선과 상세 활동 내역을 확인하고 응원하세요
                    </span>
                  </div>

                  {filteredExpandedHunters.length === 0 ? (
                    <div className="py-16 text-center text-slate-500 text-sm">
                      검색 조건에 맞는 참전 인원이 없습니다.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {filteredExpandedHunters.map((hunter) => {
                        const likes = expandedLikes[hunter.id] || 0;
                        return (
                          <div
                            key={hunter.id}
                            className="cyber-panel rounded-xl p-3.5 border border-slate-700/80 hover:border-emerald-500/60 transition group relative flex flex-col justify-between shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] bg-[#091326]/90"
                          >
                            <div>
                              {/* Card Header: Avatar + Name + Role + Team + Stage */}
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-10 h-10 rounded-xl bg-[#0e1c38] border border-emerald-500/40 flex items-center justify-center text-xl shrink-0 shadow">
                                    {hunter.avatar}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <h4 className="font-hud font-bold text-sm text-slate-100 group-hover:text-emerald-300 transition">
                                        {hunter.name}
                                      </h4>
                                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-hud font-bold">
                                        {hunter.role}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-medium">
                                      {hunter.team}
                                    </p>
                                  </div>
                                </div>

                                <span className="px-1.5 py-0.5 rounded text-[10px] font-hud font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shrink-0">
                                  {hunter.stageName}
                                </span>
                              </div>

                              {/* Badges Collection */}
                              <div className="flex items-center gap-1 mb-2.5 flex-wrap">
                                {hunter.badges.map((b, idx) => (
                                  <BadgePill key={idx} badge={b} />
                                ))}
                              </div>

                              {/* Speech Bubble Quote */}
                              <div className="p-2.5 rounded-lg bg-emerald-950/35 border border-emerald-500/40 mb-2 relative">
                                <span className="text-[10px] font-hud text-amber-300 font-bold block mb-0.5">
                                  💬 도전 및 성과 자랑 한마디
                                </span>
                                <p className="text-xs text-emerald-100 font-semibold leading-relaxed">
                                  "{hunter.bragDialogue}"
                                </p>
                              </div>

                              {/* Detailed Activity Summary (활동 내역) */}
                              <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 mb-2">
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-hud">
                                  <Cpu className="w-3 h-3 text-cyan-400 shrink-0" />
                                  <span className="truncate">{hunter.toolName}</span>
                                </div>
                                <p className="text-[11px] text-slate-300 leading-normal">
                                  {hunter.achievementSummary}
                                </p>
                              </div>
                            </div>

                            {/* Card Footer: Metrics & Like button */}
                            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs mt-1">
                              <div className="flex flex-col text-[10px]">
                                <span className="text-cyan-300 font-semibold">{hunter.metrics}</span>
                                <span className="text-amber-300 font-bold">{hunter.savings}</span>
                              </div>

                              <button
                                onClick={(e) => handleLikeHunter(hunter.id, e)}
                                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 hover:text-rose-200 border border-slate-700 text-xs font-hud flex items-center gap-1 transition active:scale-95 shrink-0"
                                title="동료 응원하기"
                              >
                                <span>❤️</span>
                                <span>{likes > 0 ? `+${likes}` : '응원'}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* VIEW 2: Wide Panoramic Battlefield Arena View (28 Players) */}
              {expandedViewMode === 'arena' && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>
                      와이드 사냥터 배치도: <strong className="text-emerald-300 font-bold">{filteredExpandedHunters.length}인</strong> 배치
                    </span>
                    <span className="text-[11px] text-amber-300">
                      💡 유저 아이콘을 누르면 말풍선이 팝업됩니다
                    </span>
                  </div>

                  <div className="relative w-full h-[480px] sm:h-[540px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#071124] via-[#050f20] to-[#030612] border border-emerald-500/50 shadow-inner">
                    <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-emerald-500/20 animate-spin" style={{ animationDuration: '60s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-dashed border-cyan-500/25" />

                    {/* Central 55-billion goal diamond */}
                    <div
                      onClick={() => {
                        sfx.playClick();
                        setIsChallengeModalOpen(true);
                      }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transition transform z-10 hover:scale-105"
                      title="재무성과 몬스터에 도전하시겠습니까?"
                    >
                      <div className="relative">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-red-950 via-slate-900 to-amber-950 border-2 border-amber-500/80 flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.6)]">
                          <div className="text-4xl sm:text-5xl animate-bounce">
                            💎
                          </div>
                        </div>
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-900 text-amber-200 border border-amber-500 text-[10px] font-hud font-black px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-lg">
                          재무성과 몬스터 : 목표 55억
                        </div>
                      </div>
                      <span className="text-[10px] font-hud text-amber-300 mt-1 font-bold animate-pulse text-center whitespace-nowrap">
                        재무성과 몬스터에 도전하시겠습니까?
                      </span>
                    </div>

                    {/* All filtered participants on battlefield with 2-head chibi characters */}
                    {filteredExpandedHunters.map((hunter, index) => {
                      const isActive = expandedActiveHunterId === hunter.id;
                      const wanderClass = `animate-wander-${(index + 1) % 4}`;
                      return (
                        <div
                          key={hunter.id}
                          onClick={() => {
                            sfx.playClick();
                            setExpandedActiveHunterId(hunter.id);
                          }}
                          className="absolute cursor-pointer transition-all duration-300 z-20 group"
                          style={{
                            left: `${hunter.xPercent}%`,
                            top: `${hunter.yPercent}%`,
                            transform: 'translate(-50%, -50%)'
                          }}
                        >
                          <div
                            className={`flex flex-col items-center transition-transform ${
                              isActive
                                ? 'z-30 scale-105'
                                : `${wanderClass} group-hover:[animation-play-state:paused]`
                            }`}
                          >
                            <div className="flex items-center gap-1 bg-black/85 px-1.5 py-0.2 rounded text-[9px] font-hud border border-slate-700 whitespace-nowrap mb-0.5 shadow">
                              <span className="text-amber-300 font-extrabold">{hunter.name}</span>
                              <span className="text-slate-300">{hunter.role}</span>
                            </div>

                            {/* 2등신 Chibi Hunter Character in Wide Arena */}
                            <ChibiHunterCharacter
                              hunter={hunter}
                              isActive={isActive}
                              wanderIndex={(index + 1) % 4}
                              size="compact"
                            />
                          </div>
                        </div>
                      );
                    })}

                    {/* Active speech bubble on wide arena */}
                    {(() => {
                      const activeItem = filteredExpandedHunters.find((h) => h.id === expandedActiveHunterId);
                      if (!activeItem) return null;
                      const isBelow = activeItem.yPercent < 48;
                      const clampedX = Math.max(20, Math.min(80, activeItem.xPercent));
                      const targetY = isBelow ? activeItem.yPercent + 10 : activeItem.yPercent - 10;
                      return (
                        <div
                          className="absolute z-50 transition-all pointer-events-auto"
                          style={{
                            left: `${clampedX}%`,
                            top: `${targetY}%`,
                            transform: isBelow ? 'translate(-50%, 0)' : 'translate(-50%, -100%)'
                          }}
                        >
                          <div className="relative w-64 sm:w-72 p-3 rounded-2xl bg-[#061126]/95 border-2 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.8)] backdrop-blur-md text-left">
                            <div className="flex items-center justify-between text-[11px] text-amber-300 font-hud font-bold mb-1 border-b border-emerald-500/30 pb-1">
                              <div className="flex items-center gap-1.5">
                                <span>{activeItem.avatar}</span>
                                <span>{activeItem.name} {activeItem.role}</span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedActiveHunterId(null);
                                }}
                                className="text-slate-400 hover:text-white"
                              >
                                ✕
                              </button>
                            </div>
                            <p className="text-xs text-white font-semibold leading-relaxed">
                              "{activeItem.bragDialogue}"
                            </p>
                            <div className="mt-2 text-[10px] text-emerald-300 pt-1 border-t border-slate-800 flex items-center justify-between">
                              <span className="truncate max-w-[140px] text-slate-400">{activeItem.team}</span>
                              <span className="text-amber-400 font-bold">{activeItem.savings}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Status Bar */}
            <div className="p-3 bg-[#071329] border-t border-slate-800 flex items-center justify-between text-xs flex-wrap gap-2 text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-hud text-emerald-300 font-bold">
                  전사 참전 인원: {expandedList.length}명
                </span>
                <span>•</span>
                <span className="text-slate-300 font-medium">
                  누적 과제 지도 및 절감액: 29.8억원
                </span>
              </div>
              <button
                onClick={() => setIsExpandedBattleModalOpen(false)}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-hud transition"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
