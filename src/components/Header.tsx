import React, { useState } from 'react';
import { Volume2, VolumeX, ShieldAlert, GraduationCap, Award, User, RefreshCw } from 'lucide-react';
import { sound, toArabicNumerals } from '../utils/numerals.ts';
import type { Student, SiteSettings } from '../types/index.ts';

interface HeaderProps {
  settings: SiteSettings;
  student: Student | null;
  onOpenTeacherModal: () => void;
  onResetStudent?: () => void;
  onNavigateHome?: () => void;
  onNavigateMap?: () => void;
  onNavigateNational?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  student,
  onOpenTeacherModal,
  onResetStudent,
  onNavigateHome,
  onNavigateMap,
  onNavigateNational,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(sound.enabled);

  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setSoundEnabled(sound.enabled);
    if (sound.enabled) {
      sound.playClick();
    }
  };

  return (
    <header className="relative z-30 w-full bg-white/90 backdrop-blur-md border-b border-teal-100 shadow-xs px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Right Section: Official Ministry Identity in Arabic RTL */}
        <div className="flex items-center gap-3 text-right">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shadow-inner shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="text-xs md:text-sm leading-tight text-slate-700 font-semibold">
            <div className="text-teal-900 font-extrabold">المملكة العربية السعودية</div>
            <div className="text-slate-600">وزارة التعليم</div>
            <div className="text-slate-500">إدارة تعليم منطقة الرياض</div>
            <div className="text-teal-700 font-bold">{settings.schoolName || 'المدرسة الابتدائية ٣١١'}</div>
          </div>
        </div>

        {/* Center: App Title & Subtitle */}
        <div
          onClick={onNavigateHome}
          className="text-center cursor-pointer group transition-transform hover:scale-[1.01]"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl animate-pulse">❤️</span>
            <h1 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-800 via-teal-600 to-cyan-600 tracking-tight">
              أبطال الصحة
            </h1>
          </div>
          <p className="text-xs md:text-sm font-bold text-teal-800/80">
            رحلة الوعي والوقاية من السكري
          </p>
        </div>

        {/* Left Section: Student status or Official Logo & Controls */}
        <div className="flex items-center gap-2.5">
          {/* Active Student Pill if registered */}
          {student && (
            <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 px-3 py-1.5 rounded-full text-xs shadow-xs">
              <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
                <User className="w-3.5 h-3.5" />
              </span>
              <div className="text-right">
                <span className="font-bold text-teal-900 block truncate max-w-[110px]">{student.fullName}</span>
                <span className="text-teal-600 text-[10px] font-bold">
                  {toArabicNumerals(student.totalPoints)} نقطة 🌟
                </span>
              </div>
              {onNavigateMap && (
                <button
                  onClick={onNavigateMap}
                  title="العودة لخريطة المغامرة"
                  className="mr-1 text-teal-700 hover:text-teal-900 font-bold bg-white/80 hover:bg-white px-2 py-0.5 rounded-md border border-teal-200 transition"
                >
                  الخريطة
                </button>
              )}
              {onNavigateNational && (
                <button
                  onClick={onNavigateNational}
                  title="الانتقال للقسم الوطني: وطني يهتم بصحتي"
                  className="mr-1 text-emerald-800 hover:text-emerald-950 font-bold bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300 transition flex items-center gap-1"
                >
                  <span>🇸🇦</span>
                  <span>وطني</span>
                </button>
              )}
            </div>
          )}

          {/* Ministry Logo Display (Official placeholder or uploaded by teacher) */}
          <div className="h-10 w-24 md:w-28 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg p-1 overflow-hidden" title="شعار وزارة التعليم">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="شعار وزارة التعليم" className="max-h-full max-w-full object-contain" />
            ) : (
              <div className="flex flex-col items-center justify-center text-[10px] font-bold text-teal-800 leading-none">
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 inline-block"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 inline-block"></span>
                </div>
                <span>وزارة التعليم</span>
                <span className="text-[8px] text-slate-500 font-normal">Ministry of Education</span>
              </div>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100'
                : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
            }`}
            title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Teacher Dashboard Trigger */}
          <button
            onClick={onOpenTeacherModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition active:scale-95"
            title="لوحة المعلمة – إدارة أبطال الصحة"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
            <span>لوحة المعلمة</span>
          </button>
        </div>
      </div>
    </header>
  );
};
