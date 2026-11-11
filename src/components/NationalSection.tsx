import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { NabdhMascot } from './NabdhMascot.tsx';
import {
  Award,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Shield,
  Heart,
  Landmark,
  Activity,
  Laptop,
  Users,
  Send,
  ExternalLink,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Trophy,
} from 'lucide-react';
import { sound, toArabicNumerals } from '../utils/numerals.ts';
import type { Student } from '../types/index.ts';

interface NationalSectionProps {
  student: Student;
  onUpdateStudent: (updatedStudent: Student) => void;
  onBackToMap: () => void;
  onGoToCertificate: () => void;
}

interface NationalQuestion {
  id: number;
  question: string;
  options: { id: string; text: string }[];
  correctId: string;
  explanationCorrect: string;
  explanationWrong: string;
}

const NATIONAL_CARDS = [
  {
    id: 1,
    title: 'وطننا يهتم بصحتنا',
    tag: 'رؤية السعودية ٢٠٣٠',
    icon: Landmark,
    accent: 'from-emerald-600 to-teal-700',
    bgBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    summary:
      'تولي المملكة العربية السعودية اهتمامًا كبيرًا بصحة الإنسان، وتعمل على تطوير الخدمات الصحية وتعزيز الوقاية والتوعية، وتسهيل الوصول إلى الفحوصات والرعاية الصحية.',
    details:
      'وتأتي هذه الجهود الوطنية المتواصلة ضمن مستهدفات برنامج تحول القطاع الصحي في رؤية السعودية ٢٠٣٠ لبناء مجتمع حيوي يتمتع أفراده بالصحة وجودة الحياة وخدمات وقائية متكاملة.',
    stat: 'برنامج التحول الصحي • رؤية ٢٠٣٠',
  },
  {
    id: 2,
    title: 'الكشف المبكر.. خطوة نحو صحة أفضل',
    tag: 'مبادرة تأكد لصحتك',
    icon: Activity,
    accent: 'from-teal-600 to-emerald-700',
    bgBadge: 'bg-teal-50 text-teal-800 border-teal-200',
    summary:
      'تدعم الجهات الصحية في المملكة الفحوصات الوقائية والكشف المبكر عن الأمراض، ومنها السكري، لمساعدة الأشخاص على معرفة حالتهم الصحية والحصول على الرعاية المناسبة.',
    details:
      'ومن أبرز الأمثلة مبادرة «تأكد لصحتك» التي تشجع المواطنين والمقيمين على إجراء الفحوصات الدورية في مراكز الرعاية الأولية لاكتشاف مؤشرات السكري مبكرًا والوقاية من مضاعفاته.',
    stat: 'فحوصات مجانية ومراكز رعاية أولية متطورة',
  },
  {
    id: 3,
    title: 'التقنية في خدمة مرضى السكري',
    tag: 'مركز القيادة والتحكم',
    icon: Laptop,
    accent: 'from-cyan-600 to-teal-700',
    bgBadge: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    summary:
      'توظف المملكة التقنيات الحديثة في تطوير الرعاية الصحية، ومن أمثلتها مركز القيادة والتحكم للسكري، الذي يدعم متابعة المؤشرات الصحية وتقديم الدعم الطبي للمصابين.',
    details:
      'تستخدم المنظومة الصحية منصات رقمية ذكية مثل تطبيق «صحتي» والملف الصحي الموحد، ما يمكن الأطباء والمصابين من متابعة قراءات السكر وتلقي الإرشادات الطبية بدقة وسرعة فائقة.',
    stat: 'تطبيق صحتي • المتابعة الرقمية الذكية',
  },
  {
    id: 4,
    title: 'رعاية ضيوف الرحمن',
    tag: 'الحج الصحي الذكي',
    icon: Shield,
    accent: 'from-amber-600 to-emerald-700',
    bgBadge: 'bg-amber-50 text-amber-800 border-amber-200',
    summary:
      'تهتم المملكة بصحة الحجاج، وتعمل على توفير الخدمات الصحية لهم، ومن ذلك استخدام التقنيات الذكية لمساندة الحجاج المصابين بالسكري ومتابعة حالتهم خلال أداء مناسك الحج.',
    details:
      'تُسخر المملكة مستشفيات ميدانية ومراكز طوارئ متقدمة في المشاعر المقدسة، وتوفر إسوارات ذكية وأجهزة مراقبة حيوية لضمان سلامة الحجاج المصابين بالسكري ليؤدوا مناسكهم بكل يسر وطمأنينة.',
    stat: 'رعاية صحية شاملة لضيوف الرحمن على مدار الساعة',
  },
  {
    id: 5,
    title: 'التوعية مسؤوليتنا جميعًا',
    tag: 'سفراء المجتمع والمدارس',
    icon: Users,
    accent: 'from-emerald-700 to-green-800',
    bgBadge: 'bg-emerald-50 text-emerald-900 border-emerald-300',
    summary:
      'لا تقتصر جهود الوعي الصحي على المؤسسات الصحية، بل تبدأ من الأسرة والمدرسة والمجتمع.',
    details:
      'ونحن في مدارسنا نسهم في نشر هذه الثقافة الصحية من خلال مبادرات الطالبات الرائدات، لنكون جزءًا فعالًا من مجتمع صحي وواعٍ يساند كل مصاب ويبني مستقبلًا خاليًا من مضاعفات السكري.',
    stat: 'دور المدرسة والأسرة في ترسيخ نمط الحياة الصحي',
  },
];

const NATIONAL_QUESTIONS: NationalQuestion[] = [
  {
    id: 1,
    question: 'كيف تهتم المملكة العربية السعودية بصحة أفراد المجتمع؟',
    options: [
      { id: 'a', text: 'بالتركيز على العلاج فقط بعد حدوث المرض.' },
      { id: 'b', text: 'بتطوير الخدمات الصحية والتوعية والفحوصات الوقائية.' },
      { id: 'c', text: 'بالاكتفاء بتقديم النصائح دون مبادرات عملية.' },
      { id: 'd', text: 'بترك المسؤولية بالكامل على الأفراد دون دعم صحي.' },
    ],
    correctId: 'b',
    explanationCorrect:
      'أحسنتِ يا بطلة! تهتم المملكة بصحتنا من خلال منظومة متكاملة تشمل الوقاية، الفحوصات، والرعاية المتطورة.',
    explanationWrong:
      'حاولي مرة أخرى يا بطلة.. وطننا يحرص على توفير الرعاية المتكاملة والوقاية والتوعية للجميع.',
  },
  {
    id: 2,
    question: 'كيف أكون سفيرة للصحة في وطني؟',
    options: [
      { id: 'a', text: 'بالاحتفاظ بالمعلومات الصحية لنفسي فقط.' },
      { id: 'b', text: 'بنشر الشائعات والنصائح غير المؤكدة.' },
      { id: 'c', text: 'بنشر المعلومات الصحية الموثوقة ومساندة المصابين وتشجيع العادات الصحية.' },
      { id: 'd', text: 'بتجاهل المبادرات الصحية المدرسية.' },
    ],
    correctId: 'c',
    explanationCorrect:
      'رائع جدًا! هكذا تكون سفيرة الصحة الحقيقية، تنشر الوعي وتبني أثرًا إيجابيًا في وطنها.',
    explanationWrong:
      'تذكري يا بطلة أن سفيرة الصحة تنشر المعرفة الموثوقة وتساعد أسرتها وزميلاتها دائمًا.',
  },
];

const OFFICIAL_SOURCES = [
  { name: 'وزارة الصحة السعودية (MOH)', url: 'https://www.moh.gov.sa' },
  { name: 'رؤية السعودية ٢٠٣٠', url: 'https://www.vision2030.gov.sa' },
  { name: 'المركز الوطني للوقاية من الأمراض (وقاية)', url: 'https://covid19.cdc.gov.sa' },
  { name: 'هيئة الصحة العامة (PHA)', url: 'https://pha.gov.sa' },
];

export const NationalSection: React.FC<NationalSectionProps> = ({
  student,
  onUpdateStudent,
  onBackToMap,
  onGoToCertificate,
}) => {
  // Navigation / Tabs within the section
  const [activeTab, setActiveTab] = useState<'welcome' | 'cards' | 'challenge' | 'mission'>('welcome');
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Challenge State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Mission / Pledge State
  const defaultMissionText =
    'أخدم وطني وأنشر الوعي الصحي من خلال تشجيع أسرتي وزميلاتي على الغذاء الصحي، ممارسة الرياضة، وشرب الماء، ودعم المصابين بالسكري بكل حب واعتزاز.';
  const [missionText, setMissionText] = useState(() => {
    return localStorage.getItem(`national_mission_${student.id}`) || defaultMissionText;
  });
  const [missionSaved, setMissionSaved] = useState(false);

  // Badge Status
  const BADGE_NAME = 'سفيرة الصحة الوطنية';
  const hasBadge = student.badges.includes(BADGE_NAME);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

  // Auto-scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const triggerCelebrationConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#006C35', '#10b981', '#facc15', '#ffffff'],
    });
  };

  // Handle Question Answer
  const handleSelectOption = (optionId: string) => {
    if (answerSubmitted) return;
    setSelectedAnswer(optionId);
    setAnswerSubmitted(true);

    const currentQ = NATIONAL_QUESTIONS[currentQuestionIndex];
    if (optionId === currentQ.correctId) {
      sound.playCorrect();
      triggerCelebrationConfetti();
      setQuizScore((prev) => prev + 1);
    } else {
      sound.playClick();
    }
  };

  const handleNextQuestion = () => {
    sound.playClick();
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
    if (currentQuestionIndex + 1 < NATIONAL_QUESTIONS.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleResetQuiz = () => {
    sound.playClick();
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  // Handle Saving National Mission
  const handleSaveMission = () => {
    if (!missionText.trim()) return;
    localStorage.setItem(`national_mission_${student.id}`, missionText.trim());
    localStorage.setItem(`national_completed_${student.id}`, 'true');
    sound.playCorrect();
    setMissionSaved(true);
    triggerCelebrationConfetti();

    // Award badge if not already awarded
    if (!hasBadge) {
      awardNationalBadge();
    } else {
      setTimeout(() => setMissionSaved(false), 3000);
    }
  };

  // Award Exclusive National Badge
  const awardNationalBadge = () => {
    const updatedBadges = hasBadge ? student.badges : [...student.badges, BADGE_NAME];
    const bonusPoints = hasBadge ? 0 : 25;
    const updatedStudent: Student = {
      ...student,
      badges: updatedBadges,
      totalPoints: student.totalPoints + bonusPoints,
    };

    onUpdateStudent(updatedStudent);
    localStorage.setItem('active_student', JSON.stringify(updatedStudent));
    setShowCelebrationModal(true);
    sound.playBadge();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#006C35', '#047857', '#f59e0b', '#ffffff'],
    });
  };

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 select-none">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white/95 backdrop-blur-md p-4 rounded-3xl border-2 border-emerald-200 shadow-sm no-print">
        <button
          onClick={onBackToMap}
          className="flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-black text-xs md:text-sm bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-2xl border border-emerald-300 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rotate-180" />
          <span>العودة لخريطة المغامرة</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-black">
            <span>🇸🇦</span>
            <span>القسم الوطني التفاعلي</span>
          </div>
          {hasBadge && (
            <div className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-full text-xs font-black animate-pulse">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>سفيرة الصحة الوطنية 🎖️</span>
            </div>
          )}
        </div>
      </div>

      {/* Main National Header Card */}
      <div className="relative bg-gradient-to-br from-[#006C35] via-emerald-800 to-teal-900 text-white rounded-3xl p-6 md:p-10 shadow-2xl mb-8 overflow-hidden border-2 border-emerald-400/40">
        {/* Decorative Golden & Green Radial Ambient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/15 rounded-full blur-2xl pointer-events-none" />

        {/* Traditional Palm & Crossed Swords Watermark Pattern */}
        <div className="absolute top-4 left-4 text-white/5 text-8xl font-serif pointer-events-none select-none">
          🇸🇦
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-right space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-extrabold text-emerald-100 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>رؤية المملكة ٢٠٣٠ • جودة الحياة والصحة أولًا</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-white tracking-wide flex items-center gap-3">
              <span>وطني يهتم بصحتي</span>
              <span className="text-3xl md:text-4xl">🇸🇦</span>
            </h1>

            <p className="text-emerald-100 text-sm md:text-base font-bold leading-relaxed">
              جهود المملكة العربية السعودية في الوقاية من السكري ورعاية المصابين.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-black">
              <span className="bg-white/10 px-3 py-1 rounded-xl border border-white/10">
                ٥ بطاقات معرفية 📖
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-xl border border-white/10">
                تحدي سفيرة الوعي 🎯
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-xl border border-white/10">
                وسام الشرف الوطني 🎖️
              </span>
            </div>
          </div>

          {/* Nabdh Mascot Proudly Holding Saudi Flag */}
          <div className="shrink-0 flex flex-col items-center">
            <NabdhMascot
              message="نفخر بوطننا الغالي الذي يجعل صحة الإنسان أولوية! 🇸🇦"
              size="lg"
              showSaudiFlag={true}
            />
          </div>
        </div>

        {/* Navigation Tabs Pill inside the Header */}
        <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-center md:justify-start gap-2 relative z-10">
          {[
            { id: 'welcome', label: 'الترحيب بالقسم 💚', icon: Heart },
            { id: 'cards', label: 'جهود وطني (٥ بطاقات) 🇸🇦', icon: BookOpen },
            { id: 'challenge', label: 'تحدي سفيرة الوطن 🎯', icon: HelpCircle },
            { id: 'mission', label: 'مهمتي الوطنية والوسام 🎖️', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-extrabold transition cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-emerald-950 shadow-md scale-105'
                    : 'bg-white/15 text-white hover:bg-white/25 border border-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: WELCOME SCREEN */}
      {activeTab === 'welcome' && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-10 border-2 border-emerald-200 shadow-xl text-right space-y-6 relative overflow-hidden">
            {/* Top decorative badge */}
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-emerald-700 flex items-center justify-center text-3xl shadow-sm">
              🇸🇦
            </div>

            <div className="space-y-3">
              <span className="text-xs md:text-sm font-black text-emerald-700 tracking-wider">
                رسالة الترحيب والاعتزاز
              </span>
              <h2 className="text-xl md:text-3xl font-black text-slate-800 leading-snug">
                في وطننا الغالي، صحة الإنسان أولوية دائمة ✨
              </h2>
            </div>

            {/* Quoted Welcome Text */}
            <div className="bg-emerald-50/70 border-r-4 border-emerald-600 p-5 md:p-6 rounded-2xl">
              <p className="text-slate-700 text-sm md:text-base font-bold leading-relaxed">
                «في وطننا الغالي، صحة الإنسان أولوية، وتبذل المملكة العربية السعودية جهودًا متواصلة
                لتعزيز الوعي الصحي، والوقاية من الأمراض، وتطوير الخدمات الصحية، ورعاية المصابين
                بالسكري.
                <br />
                <br />
                هيا نتعرف على بعض هذه الجهود، ونكتشف كيف نكون سفيرات للوعي الصحي في وطننا».
              </p>
            </div>

            {/* 3 Highlight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-50 border border-emerald-100 rounded-2xl text-center space-y-1">
                <span className="text-2xl">🛡️</span>
                <h4 className="text-sm font-black text-emerald-900">وقاية شاملة</h4>
                <p className="text-xs text-slate-600">فحوصات مبكرة وبرامج تحول صحي متقدمة</p>
              </div>

              <div className="p-4 bg-slate-50 border border-emerald-100 rounded-2xl text-center space-y-1">
                <span className="text-2xl">💻</span>
                <h4 className="text-sm font-black text-teal-900">تقنيات ذكية</h4>
                <p className="text-xs text-slate-600">متابعة إلكترونية ومركز قيادة وتحكم للسكري</p>
              </div>

              <div className="p-4 bg-slate-50 border border-emerald-100 rounded-2xl text-center space-y-1">
                <span className="text-2xl">🌟</span>
                <h4 className="text-sm font-black text-amber-900">سفيرات الوعي</h4>
                <p className="text-xs text-slate-600">طالباتنا يشاركن في بناء مجتمع صحي واعد</p>
              </div>
            </div>

            {/* Action Button: اكتشفي جهود وطني */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('cards');
                }}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#006C35] to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black text-base rounded-2xl shadow-lg flex items-center justify-center gap-3 transform hover:scale-105 active:scale-95 transition cursor-pointer"
              >
                <span>اكتشفي جهود وطني</span>
                <ArrowLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('challenge');
                }}
                className="w-full sm:w-auto px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>الانتقال المباشر للتحدي الوطني</span>
                <HelpCircle className="w-4 h-4 text-emerald-700" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 5 EDUCATIONAL INTERACTIVE CARDS */}
      {activeTab === 'cards' && (
        <div className="space-y-8 animate-fade-in">
          {/* Card Navigation Pills */}
          <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-emerald-200 shadow-xs">
            <span className="text-xs font-black text-emerald-900">
              البطاقة {toArabicNumerals(activeCardIndex + 1)} من {toArabicNumerals(5)}
            </span>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {NATIONAL_CARDS.map((card, idx) => (
                <button
                  key={card.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveCardIndex(idx);
                  }}
                  className={`w-8 h-8 rounded-xl font-black text-xs transition cursor-pointer ${
                    activeCardIndex === idx
                      ? 'bg-emerald-700 text-white shadow-xs scale-110'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  {toArabicNumerals(idx + 1)}
                </button>
              ))}
            </div>
          </div>

          {/* Active Featured Card */}
          {(() => {
            const card = NATIONAL_CARDS[activeCardIndex];
            const CardIcon = card.icon;

            return (
              <div className="bg-white rounded-3xl p-6 md:p-10 border-2 border-emerald-200 shadow-xl relative overflow-hidden text-right space-y-6">
                {/* Visual Top Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black border ${card.bgBadge}`}
                  >
                    <span>🇸🇦</span>
                    <span>{card.tag}</span>
                  </span>

                  <span className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-black text-sm">
                    {toArabicNumerals(card.id)}
                  </span>
                </div>

                {/* Card Title & Graphic */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <span className="text-xs font-extrabold text-amber-600 block">
                      جهود وطنية ملموسة ومستمرة
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-800">
                      {card.title}
                    </h3>
                  </div>

                  <div
                    className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${card.accent} text-white flex items-center justify-center shadow-lg shrink-0`}
                  >
                    <CardIcon className="w-8 h-8" />
                  </div>
                </div>

                {/* Text Summaries */}
                <div className="space-y-4">
                  <p className="text-base md:text-lg text-slate-800 font-bold leading-relaxed">
                    {card.summary}
                  </p>

                  <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-100">
                    <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed">
                      {card.details}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-600">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{card.stat}</span>
                  </div>
                </div>

                {/* Next / Prev Controls */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    disabled={activeCardIndex === 0}
                    onClick={() => {
                      sound.playClick();
                      setActiveCardIndex((prev) => Math.max(0, prev - 1));
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                      activeCardIndex === 0
                        ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
                    }`}
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>البطاقة السابقة</span>
                  </button>

                  {activeCardIndex < NATIONAL_CARDS.length - 1 ? (
                    <button
                      onClick={() => {
                        sound.playClick();
                        setActiveCardIndex((prev) => prev + 1);
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-black text-xs md:text-sm shadow-xs transition cursor-pointer"
                    >
                      <span>البطاقة التالية</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        sound.playClick();
                        setActiveTab('challenge');
                      }}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-teal-950 font-black text-xs md:text-sm rounded-xl shadow-md transition cursor-pointer"
                    >
                      <span>الانتقال إلى تحدي سفيرة الوطن</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Quick Grid of all 5 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-4">
            {NATIONAL_CARDS.map((card, idx) => {
              const Icon = card.icon;
              const isSelected = activeCardIndex === idx;
              return (
                <div
                  key={card.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveCardIndex(idx);
                  }}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer text-right flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 shadow-md ring-2 ring-emerald-200'
                      : 'border-slate-200 bg-white hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-emerald-800">
                      {toArabicNumerals(card.id)}
                    </span>
                    <Icon className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h4 className="font-black text-xs text-slate-800 line-clamp-1">{card.title}</h4>
                  <span className="text-[10px] text-slate-500 font-bold block mt-1">{card.tag}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: NATIONAL CHALLENGE (2 QUESTIONS) */}
      {activeTab === 'challenge' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-10 border-2 border-emerald-200 shadow-xl text-right space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-black">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                  <span>تحدي الوعي الوطني</span>
                </span>
                <h3 className="text-xl md:text-2xl font-black text-slate-800">
                  هل أنتِ سفيرة الصحة في وطنكِ؟ 🇸🇦
                </h3>
              </div>

              {!quizCompleted && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2 rounded-2xl text-xs font-black">
                  السؤال {toArabicNumerals(currentQuestionIndex + 1)} من {toArabicNumerals(2)}
                </div>
              )}
            </div>

            {/* Quiz In Progress */}
            {!quizCompleted ? (
              (() => {
                const q = NATIONAL_QUESTIONS[currentQuestionIndex];
                const isCorrect = selectedAnswer === q.correctId;

                return (
                  <div className="space-y-6">
                    <h4 className="text-lg md:text-xl font-black text-emerald-950 leading-relaxed">
                      {q.question}
                    </h4>

                    {/* 4 Choices */}
                    <div className="grid grid-cols-1 gap-3">
                      {q.options.map((opt) => {
                        let btnStyle =
                          'border-slate-200 bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-300 text-slate-800';

                        if (answerSubmitted) {
                          if (opt.id === q.correctId) {
                            btnStyle =
                              'border-emerald-500 bg-emerald-100 text-emerald-950 font-black ring-2 ring-emerald-300';
                          } else if (opt.id === selectedAnswer) {
                            btnStyle =
                              'border-rose-400 bg-rose-50 text-rose-900 opacity-90';
                          } else {
                            btnStyle = 'border-slate-200 bg-slate-50 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={opt.id}
                            disabled={answerSubmitted}
                            onClick={() => handleSelectOption(opt.id)}
                            className={`p-4 rounded-2xl border-2 text-right font-bold text-xs md:text-sm transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                          >
                            <span className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-xl bg-white border border-slate-300 flex items-center justify-center font-black text-xs shrink-0">
                                {opt.id.toUpperCase()}
                              </span>
                              <span>{opt.text}</span>
                            </span>

                            {answerSubmitted && opt.id === q.correctId && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Instant Feedback Message */}
                    {answerSubmitted && (
                      <div
                        className={`p-5 rounded-2xl border-2 animate-fade-in ${
                          isCorrect
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                            : 'bg-amber-50 border-amber-300 text-amber-950'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-black text-sm mb-1">
                          {isCorrect ? (
                            <>
                              <span>🎉</span>
                              <span>إجابة صحيحة ومتميزة!</span>
                            </>
                          ) : (
                            <>
                              <span>💡</span>
                              <span>توضيح توعوي رائع:</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs md:text-sm font-medium leading-relaxed">
                          {isCorrect ? q.explanationCorrect : q.explanationWrong}
                        </p>
                      </div>
                    )}

                    {/* Next Question / Finish Button */}
                    {answerSubmitted && (
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={handleNextQuestion}
                          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 text-white font-black text-sm rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
                        >
                          <span>
                            {currentQuestionIndex + 1 < NATIONAL_QUESTIONS.length
                              ? 'السؤال التالي'
                              : 'عرض نتيجة التحدي'}
                          </span>
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              /* Quiz Finished Summary */
              <div className="text-center py-6 space-y-6 animate-fade-in">
                <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-4xl mx-auto shadow-md">
                  🇸🇦
                </div>

                <div className="space-y-2">
                  <h4 className="text-2xl font-black text-slate-800">
                    أحسنتِ يا بطلة الوطن! لقد أتممتِ التحدي الصحي الوطني
                  </h4>
                  <p className="text-slate-600 text-xs md:text-sm max-w-lg mx-auto font-medium">
                    لديكِ الآن فهم راسخ لجهود المملكة في رعاية صحة الإنسان، وكيف تسهمين كسفيرة واعية في
                    مدرستكِ وأسرتكِ.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveTab('mission');
                    }}
                    className="px-8 py-3.5 bg-gradient-to-r from-[#006C35] to-emerald-700 hover:from-emerald-700 text-white font-black text-sm rounded-2xl shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <span>كتابة مهمتي الوطنية واستلام الوسام</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleResetQuiz}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>إعادة التحدي ↺</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: NATIONAL MISSION & PLEDGE & BADGE */}
      {activeTab === 'mission' && (
        <div className="space-y-8 animate-fade-in">
          {/* Mission Card */}
          <div className="bg-white rounded-3xl p-6 md:p-10 border-2 border-emerald-200 shadow-xl text-right space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 px-3.5 py-1 rounded-full text-xs font-black">
                  <span>🇸🇦</span>
                  <span>أنا سفيرة الصحة في وطني</span>
                </span>
                <h3 className="text-xl md:text-2xl font-black text-slate-800">
                  مهمتي الوطنية لنشر الوعي الصحي
                </h3>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-teal-950 flex items-center justify-center text-2xl shadow-md">
                🎖️
              </div>
            </div>

            <p className="text-xs md:text-sm text-slate-600 font-bold leading-relaxed">
              بصفتكِ بطلة وسفيرة صحية، كيف ستخدمين وطنكِ الغالي وتسهمين في نشر الوعي والوقاية من
              السكري؟
            </p>

            {/* Quick Inspiration Templates */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">
                عبارات مقترحة يمكنكِ الاختيار منها أو التعديل عليها:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'أخدم وطني وأنشر الوعي الصحي من خلال تشجيع أسرتي على المشي واختيار الغذاء الصحي.',
                  'أخدم وطني بنشر المعلومات الطبية الموثوقة الصادرة من وزارة الصحة ودعم زميلاتي.',
                  'أخدم وطني بأن أكون قدوة في تقليل السكريات وشرب الماء والمحافظة على النشاط.',
                ].map((template, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playClick();
                      setMissionText(template);
                    }}
                    className="p-2.5 rounded-xl text-[11px] font-bold bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 transition cursor-pointer text-right"
                  >
                    «{template}»
                  </button>
                ))}
              </div>
            </div>

            {/* Mission Text Area */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                نص مهمتكِ وتعهدكِ الوطني:
              </label>
              <textarea
                rows={4}
                value={missionText}
                onChange={(e) => setMissionText(e.target.value)}
                placeholder="أخدم وطني وأنشر الوعي الصحي من خلال..."
                className="w-full p-4 text-xs md:text-sm font-medium bg-slate-50 border-2 border-emerald-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:bg-white transition leading-relaxed"
              />
            </div>

            {/* Save Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleSaveMission}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#006C35] to-emerald-700 hover:from-emerald-700 text-white font-black text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>اعتماد مهمتي الوطنية واستلام الوسام 🇸🇦</span>
              </button>

              {missionSaved && (
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-fade-in flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>تم حفظ مهمتكِ الوطنية بنجاح في ملفكِ الصحي!</span>
                </span>
              )}
            </div>
          </div>

          {/* Exclusive 3D National Badge Display */}
          <div className="bg-gradient-to-br from-emerald-50 via-white to-amber-50 rounded-3xl p-6 md:p-8 border-2 border-amber-300 shadow-xl relative overflow-hidden text-right">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-black">
                  <Award className="w-4 h-4 text-amber-700" />
                  <span>وسام الشرف الحصري</span>
                </div>

                <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                  <span>شارة: سفيرة الصحة الوطنية</span>
                  <span>🇸🇦</span>
                </h3>

                <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed">
                  وسام فخري يُمنح للبطلة التي استكشفت جهود المملكة العربية السعودية في رعاية المصابين
                  بالسكري، واجتازت التحدي وكتبت مهمتها الوطنية للمساهمة في بناء مجتمع صحي متكامل.
                </p>

                <div className="pt-2 flex items-center gap-2">
                  {hasBadge ? (
                    <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 shadow-2xs">
                      <span>✓</span>
                      <span>تم كسب هذا الوسام رسميًا! يُعرض الآن في شهادتكِ</span>
                    </span>
                  ) : (
                    <button
                      onClick={awardNationalBadge}
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-teal-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer"
                    >
                      <span>استلام الوسام الآن ✨</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 3D Shield Badge Artwork */}
              <div className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center shrink-0">
                <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl animate-pulse" />
                <div className="relative z-10 w-full h-full bg-gradient-to-br from-[#006C35] via-emerald-700 to-teal-800 rounded-3xl p-4 border-4 border-amber-400 shadow-2xl flex flex-col items-center justify-center text-white text-center transform hover:rotate-2 transition">
                  <span className="text-3xl md:text-4xl mb-1">🇸🇦</span>
                  <span className="text-xs md:text-sm font-black text-amber-300">سفيرة الصحة</span>
                  <span className="text-[10px] md:text-xs font-bold text-emerald-100">الوطنية</span>
                  <div className="mt-1 flex gap-1 text-amber-300 text-xs">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Closing Banner with Golden Quote & Official Sources */}
      <div className="mt-12 bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-200 shadow-lg text-right space-y-6">
        {/* Quote */}
        <div className="bg-gradient-to-r from-emerald-50 via-amber-50/50 to-emerald-50 p-6 rounded-2xl border border-emerald-200 text-center">
          <p className="text-base md:text-xl font-black text-emerald-950 leading-relaxed">
            «نفخر بوطنٍ يجعل صحة الإنسان أولوية.. وأنا جزء من رحلة الوعي»
          </p>
          <span className="text-xs font-extrabold text-emerald-700 mt-2 block">
            — طالبات وأبطال الصحة بالمدرسة الابتدائية ٣١١ 🇸🇦
          </span>
        </div>

        {/* Official Sources List */}
        <div>
          <h4 className="text-xs md:text-sm font-black text-slate-700 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>المصادر الرسمية المعتمدة للمعلومات الصحية بالمملكة:</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {OFFICIAL_SOURCES.map((source, idx) => (
              <a
                key={idx}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-right transition flex items-center justify-between text-xs font-bold text-slate-700 hover:text-emerald-900 group"
              >
                <span>{source.name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* Return & Certificate Navigation Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onBackToMap}
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs md:text-sm rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لخريطة المغامرة</span>
          </button>

          <button
            onClick={onGoToCertificate}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-teal-950 font-black text-xs md:text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>استعراض بطاقة الإنجاز والشهادة الرسمية</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CELEBRATION MODAL WHEN BADGE IS AWARDED */}
      {showCelebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 border-4 border-amber-400 shadow-2xl text-center space-y-6 relative overflow-hidden">
            {/* Top Glow */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-600" />

            <div className="flex justify-center">
              <NabdhMascot
                message="مبارك يا بطلة الوطن! تُوّجتِ بوسام سفيرة الصحة الوطنية! 🇸🇦"
                size="md"
                showSaudiFlag={true}
              />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-black">
                وسام شرف جديد مكتسب 🎖️
              </span>
              <h3 className="text-2xl font-black text-emerald-950">
                سفيرة الصحة الوطنية 🇸🇦
              </h3>
              <p className="text-xs md:text-sm text-slate-600 font-bold leading-relaxed">
                تقديرًا لوعيكِ وإدراككِ لجهود وطننا الغالي في رعاية المصابين بالسكري والوقاية منه،
                أُضيفت الشارة رسميًا إلى سجلكِ وشهادتكِ!
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs font-black text-emerald-900">
              +٢٥ نقطة تميز إضافية في رصيدكِ 🌟
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowCelebrationModal(false);
                  onGoToCertificate();
                }}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-teal-950 font-black text-sm rounded-2xl shadow-md transition cursor-pointer"
              >
                عرض الشهادة وبطاقة الإنجاز بالوسام الجديد 🏆
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setShowCelebrationModal(false);
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                مواصلة التصفح في القسم الوطني
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
