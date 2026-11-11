import React, { useRef, useState } from 'react';
import { NabdhMascot } from './NabdhMascot.tsx';
import { Sparkles, ArrowLeft, Heart, Shield, Apple, Droplets, Play, Video, Volume2, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/numerals.ts';
import type { SiteSettings } from '../types/index.ts';

interface WelcomeViewProps {
  settings: SiteSettings;
  onStart: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ settings, onStart }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoSource = settings.videoPath || '/assets/aistudio/VID-20261110-WA0092_76b55817.mp4';

  const handleStart = () => {
    sound.playClick();
    onStart();
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      sound.playClick();
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 md:py-10 flex flex-col items-center">
      {/* Upper Badges Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-full text-teal-800 text-xs md:text-sm font-bold shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span>مرحبًا بكن في رحلة بطلات الصحة الابتدائية</span>
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
          <span>الابتدائية ٣١١ – إدارة تعليم منطقة الرياض</span>
        </div>
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 px-3.5 py-1.5 rounded-full text-emerald-900 text-xs font-black shadow-xs">
          <span>🇸🇦</span>
          <span>قسم وطني جديد: وطني يهتم بصحتي</span>
        </div>
      </div>

      {/* Main Distinctive 3D Rounded Hero Box */}
      <div className="relative w-full bg-gradient-to-br from-white via-cyan-50/40 to-teal-50/50 rounded-3xl p-6 md:p-10 border-3 border-teal-400 shadow-[0_20px_50px_rgba(8,127,140,0.12)] ring-4 ring-amber-300/40 overflow-visible transition-all mb-8">
        {/* Subtle decorative golden corner accents */}
        <div className="absolute top-3 right-3 w-8 h-8 border-t-3 border-r-3 border-amber-400/80 rounded-tr-xl pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-3 border-l-3 border-amber-400/80 rounded-bl-xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text & Motivational Statements (7 cols) */}
          <div className="lg:col-span-7 text-right space-y-5">
            <div>
              <div className="text-amber-600 font-extrabold text-xs md:text-sm mb-1 tracking-wide">
                ✦ رحلة الوعي والوقاية من السكري ✦
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-teal-900 leading-tight">
                أبطال الصحة
              </h2>
            </div>

            {/* Featured Quote Highlight */}
            <div className="bg-white/90 border-r-4 border-teal-500 p-4 md:p-5 rounded-2xl shadow-xs space-y-2">
              <p className="text-xl md:text-2xl font-black text-teal-800 leading-snug">
                «صحتكِ كنز.. فاحفظيها بالوعي»
              </p>
              <p className="text-base md:text-lg font-bold text-slate-700">
                «كل اختيار صحي اليوم، يصنع حياة أجمل غدًا»
              </p>
            </div>

            {/* Mission Statements */}
            <div className="space-y-2 text-slate-700 font-medium text-xs md:text-sm leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="text-teal-600 shrink-0 text-base">🌸</span>
                <span>
                  «كوني بطلة الوعي الصحي، وانشري المعرفة والوقاية بين أسرتكِ ومجتمعكِ»
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-500 shrink-0 text-base">⭐</span>
                <span className="font-bold text-teal-900">
                  «أهلًا بكِ يا بطلة الصحة! شاهدي المقطع التوعوي أدناه ثم انطلقي في مغامرة التحديات والشارات الذهبية!»
                </span>
              </div>
            </div>

            {/* 4 Health Pillars Icons preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="bg-white border border-teal-100 rounded-xl p-2.5 text-center shadow-2xs flex flex-col items-center">
                <Heart className="w-5 h-5 text-rose-500 mb-1 animate-pulse" />
                <span className="text-xs font-bold text-slate-700">وعي بالسكري</span>
              </div>
              <div className="bg-white border border-teal-100 rounded-xl p-2.5 text-center shadow-2xs flex flex-col items-center">
                <Apple className="w-5 h-5 text-emerald-500 mb-1" />
                <span className="text-xs font-bold text-slate-700">غذاء متوازن</span>
              </div>
              <div className="bg-white border border-teal-100 rounded-xl p-2.5 text-center shadow-2xs flex flex-col items-center">
                <Droplets className="w-5 h-5 text-cyan-500 mb-1" />
                <span className="text-xs font-bold text-slate-700">شرب الماء</span>
              </div>
              <div className="bg-white border border-teal-100 rounded-xl p-2.5 text-center shadow-2xs flex flex-col items-center">
                <Shield className="w-5 h-5 text-teal-600 mb-1" />
                <span className="text-xs font-bold text-slate-700">فحص دوري</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                onClick={handleStart}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white font-extrabold text-base md:text-lg rounded-2xl shadow-lg shadow-teal-500/25 border-2 border-white/40 flex items-center justify-center gap-3 transform transition hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>ابدئي رحلة الوعي الصحي والمغامرة</span>
                <ArrowLeft className="w-5 h-5 animate-pulse" />
              </button>
            </div>
          </div>

          {/* 3D Mascot Nabdh (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <NabdhMascot
              size="xl"
              message="شاهدي المقطع التوعوي الرائع بالأسفل لتكتشفي أسرار الصحة والوقاية!"
              showShield={true}
            />
          </div>
        </div>
      </div>

      {/* Prominent Awareness Video Section on First Page */}
      <div className="w-full bg-white rounded-3xl p-6 md:p-8 border-2 border-teal-300 shadow-xl space-y-6 text-right">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-teal-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-900 px-3 py-1 rounded-full text-xs font-bold mb-1">
              <Video className="w-3.5 h-3.5 text-teal-700" />
              <span>المقطع التوعوي المعتمد</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-teal-950">
              {settings.videoTitle || 'اليوم العالمي للسكري ١٤ نوفمبر — الوقاية تبدأ من البيت والمدرسة'}
            </h3>
            <p className="text-slate-600 text-xs md:text-sm mt-0.5">
              «الصحة تاج على رؤوس الأصحاء لا يراه إلا المرضى.. رسالة إلى أولياء الأمور والمعلمين والمعلمات»
            </p>
          </div>

          <span className="text-xs font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl shrink-0">
            إعداد: أ. خلود الحريصي 🌸
          </span>
        </div>

        {/* Video Player Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Video Player Display (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-900 relative aspect-video flex items-center justify-center group">
            <video
              ref={videoRef}
              src={videoSource}
              controls
              playsInline
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Key Insights & Bullet Points (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-extrabold text-teal-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>أهم الرسائل التوعوية في هذا المقطع:</span>
            </div>

            <div className="space-y-2 text-xs font-semibold text-slate-700">
              <div className="p-2.5 bg-teal-50/70 rounded-xl border border-teal-100 flex items-start gap-2">
                <span className="text-base shrink-0">🩺</span>
                <div>
                  <span className="font-extrabold text-teal-900 block">ما هو السكري؟</span>
                  البنكرياس يفرز الإنسولين فيدخل السكر للخلايا لتصنع منه الطاقة.
                </div>
              </div>

              <div className="p-2.5 bg-cyan-50/70 rounded-xl border border-cyan-100 flex items-start gap-2">
                <span className="text-base shrink-0">💧</span>
                <div>
                  <span className="font-extrabold text-cyan-900 block">الوقاية تبدأ من البيت:</span>
                  ٦٠ دقيقة حركة يومياً، الماء بدل المشروبات المحلاة، ونوم كاف.
                </div>
              </div>

              <div className="p-2.5 bg-rose-50/70 rounded-xl border border-rose-100 flex items-start gap-2">
                <span className="text-base shrink-0">⚠️</span>
                <div>
                  <span className="font-extrabold text-rose-900 block">علامات تستدعي الانتباه:</span>
                  العطش الشديد، كثرة التبول، التعب المستمر ونقص الوزن (نراجع الطبيب).
                </div>
              </div>

              <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-100 flex items-start gap-2">
                <span className="text-base shrink-0">🤝</span>
                <div>
                  <span className="font-extrabold text-amber-900 block">دور المدرسة والمعلمين:</span>
                  رعاية ومحبة، تواصل مستمر مع الأسرة.. لا عزل ولا حرج، هم مثل زملائهم!
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleStart}
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-black text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>الانتقال للمغامرة والتحديات الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
