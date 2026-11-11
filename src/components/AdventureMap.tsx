import React from 'react';
import { NabdhMascot } from './NabdhMascot.tsx';
import { Award, CheckCircle, Star, Sparkles, ArrowLeft, Trophy, Heart, Activity, Utensils, Search, Home, Calculator } from 'lucide-react';
import { toArabicNumerals } from '../utils/numerals.ts';
import type { Student, StationMeta } from '../types/index.ts';

interface AdventureMapProps {
  student: Student;
  onSelectStation: (stationId: number) => void;
  onGoToCertificate: () => void;
  onGoToNational?: () => void;
}

export const STATIONS_DATA: StationMeta[] = [
  {
    id: 1,
    title: 'المحطة الأولى: محققة الصحة',
    shortName: 'محققة الصحة',
    badgeName: 'محققة الصحة',
    badgeDescription: 'كشف أسرار السكري ودحض الخرافات الشائعة',
    color: 'from-cyan-500 to-teal-600',
    bgColor: 'bg-teal-50',
    iconName: 'Search',
    goal: 'التعرف إلى السكري ودور البنكرياس والإنسولين',
  },
  {
    id: 2,
    title: 'المحطة الثانية: مصممة الطبق الصحي',
    shortName: 'مصممة الطبق الصحي',
    badgeName: 'خبيرة الغذاء',
    badgeDescription: 'تصميم وجبة متوازنة بالخضار والبروتين والماء',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    iconName: 'Utensils',
    goal: 'التعرف إلى التنوع الغذائي وتكوين وجبة متوازنة',
  },
  {
    id: 3,
    title: 'المحطة الثالثة: سفيرة الكشف المبكر',
    shortName: 'سفيرة الكشف المبكر',
    badgeName: 'سفيرة الوعي',
    badgeDescription: 'أهمية الفحص الطبي والمتابعة الموثوقة',
    color: 'from-sky-500 to-blue-600',
    bgColor: 'bg-sky-50',
    iconName: 'Heart',
    goal: 'التعرف إلى أهمية الفحوصات والمتابعة الصحية',
  },
  {
    id: 4,
    title: 'المحطة الرابعة: بطلة النشاط',
    shortName: 'بطلة النشاط',
    badgeName: 'بطلة النشاط',
    badgeDescription: 'الحركة والرياضة لمحاربة الخمول',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    iconName: 'Activity',
    goal: 'تعزيز النشاط البدني واللعب الآمن',
  },
  {
    id: 5,
    title: 'المحطة الخامسة: سفيرة الصحة في منزلي',
    shortName: 'سفيرة الصحة في منزلي',
    badgeName: 'سفيرة الأسرة',
    badgeDescription: 'نشر العادات الصحية ومساندة الآخرين بلطف',
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-50',
    iconName: 'Home',
    goal: 'نقل السلوكيات الصحية ومساندة الزميلات',
  },
  {
    id: 6,
    title: 'المحطة السادسة: صحتي بالأرقام',
    shortName: 'صحتي بالأرقام',
    badgeName: 'عبقرية الرياضيات والصحة',
    badgeDescription: 'تحدي الحساب والنسب والمعدلات في الصحة',
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-50',
    iconName: 'Calculator',
    goal: 'تطبيق المفاهيم الرياضية على الصحة والوقاية',
  },
];

export const AdventureMap: React.FC<AdventureMapProps> = ({
  student,
  onSelectStation,
  onGoToCertificate,
  onGoToNational,
}) => {
  const hasNationalBadge = student.badges.includes('سفيرة الصحة الوطنية');
  const completedCount = student.completedStations.length;
  const allCompleted = completedCount >= 6;
  const progressPercent = Math.round((completedCount / 6) * 100);

  const getStationIcon = (iconName: string) => {
    switch (iconName) {
      case 'Search':
        return <Search className="w-6 h-6" />;
      case 'Utensils':
        return <Utensils className="w-6 h-6" />;
      case 'Heart':
        return <Heart className="w-6 h-6" />;
      case 'Activity':
        return <Activity className="w-6 h-6" />;
      case 'Home':
        return <Home className="w-6 h-6" />;
      case 'Calculator':
        return <Calculator className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
      {/* Student Banner & Progress Summary */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-cyan-900 rounded-3xl p-6 md:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-right space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-teal-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>خريطة المغامرة الصحية</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black">
              أهلًا بكِ يا بطلة الصحة: <span className="text-amber-300">{student.fullName}</span>
            </h2>
            <p className="text-teal-100 text-xs md:text-sm">
              أكملي المحطات الست لتجمعي شارات الشرف وتتوجي سفيرة معتمدة للوعي الصحي!
            </p>
          </div>

          {/* Points & Stats Badges */}
          <div className="flex items-center gap-4">
            {/* Points pill */}
            <div className="bg-white/15 backdrop-blur-md border border-white/20 px-5 py-3 rounded-2xl text-center shadow-inner">
              <span className="block text-2xl md:text-3xl font-black text-amber-300">
                {toArabicNumerals(student.totalPoints)}
              </span>
              <span className="text-[11px] font-bold text-teal-100">نقطة تميز 🌟</span>
            </div>

            {/* Badges count */}
            <div className="bg-white/15 backdrop-blur-md border border-white/20 px-5 py-3 rounded-2xl text-center shadow-inner">
              <span className="block text-2xl md:text-3xl font-black text-cyan-200">
                {toArabicNumerals(student.badges.length)}
              </span>
              <span className="text-[11px] font-bold text-teal-100">شارات مكتسبة 🎖️</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-6 border-t border-white/15">
          <div className="flex items-center justify-between text-xs md:text-sm font-bold mb-2">
            <span>
              إنجاز المغامرة: {toArabicNumerals(completedCount)} من {toArabicNumerals(6)} محطات مكتملة
            </span>
            <span className="text-amber-300">{toArabicNumerals(progressPercent)}٪</span>
          </div>
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grand Completion Banner if all 6 stations completed */}
      {allCompleted && (
        <div className="mb-8 p-6 bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 border-2 border-amber-400 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right animate-gentle-bounce">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-teal-950 flex items-center justify-center text-3xl shadow-md shrink-0">
              🏆
            </div>
            <div>
              <h3 className="text-xl font-black text-amber-950">
                مبارك يا بطلة الصحة! أكملتِ جميع محطات المغامرة الست بنجاح!
              </h3>
              <p className="text-amber-900 text-xs md:text-sm font-medium mt-1">
                الآن يمكنكِ كتابة رسالتكِ الصحية الملهمة للعالم وتحميل شهادة الإنجاز الرسمية.
              </p>
            </div>
          </div>

          <button
            onClick={onGoToCertificate}
            className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold rounded-2xl shadow-md flex items-center gap-2 transform transition hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            <span>استلمي بطاقة الإنجاز والشهادة</span>
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* 6 Stations 3D Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STATIONS_DATA.map((station, index) => {
          const isDone = student.completedStations.includes(station.id);
          const hasBadge = student.badges.includes(station.badgeName);

          return (
            <div
              key={station.id}
              onClick={() => onSelectStation(station.id)}
              className={`group relative bg-white rounded-3xl p-6 border-2 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl cursor-pointer ${
                isDone
                  ? 'border-emerald-300 shadow-md ring-2 ring-emerald-100'
                  : 'border-slate-200 hover:border-teal-400 shadow-xs'
              }`}
            >
              {/* Station Number Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-black text-lg">
                  {toArabicNumerals(index + 1)}
                </span>

                {isDone ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>مكتملة ✨</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                    <span>جاهزة للاستكشاف</span>
                  </span>
                )}
              </div>

              {/* Station Icon & Title */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${station.color} text-white flex items-center justify-center shadow-md transform group-hover:scale-110 transition`}
                >
                  {getStationIcon(station.iconName)}
                </div>
                <div className="text-right">
                  <h3 className="font-black text-slate-800 text-lg group-hover:text-teal-700 transition">
                    {station.shortName}
                  </h3>
                  <span className="text-xs font-bold text-teal-600 block">
                    شارة: {station.badgeName}
                  </span>
                </div>
              </div>

              <p className="text-slate-600 text-xs md:text-sm line-clamp-2 text-right leading-relaxed mb-4">
                {station.goal}
              </p>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <span className="text-teal-700 group-hover:underline flex items-center gap-1">
                  <span>{isDone ? 'إعادة التحدي ↺' : 'ابدئي المحطة'}</span>
                  <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition" />
                </span>

                {hasBadge && (
                  <span className="text-amber-500 flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span>تم كسب الشارة</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Special Saudi National Section Milestone (Post 6 Stations & Pre Certificate) */}
      <div className="mt-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#006C35] via-emerald-800 to-teal-900 text-white p-6 md:p-8 shadow-xl border-2 border-emerald-400/50">
        {/* Glow & Backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-right">
            <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center text-3xl shadow-inner shrink-0">
              🇸🇦
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-black text-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>محطة وطنية مميزة ومستقلة</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white">
                وطني يهتم بصحتي 🇸🇦
              </h3>
              <p className="text-emerald-100 text-xs md:text-sm font-medium leading-relaxed max-w-xl">
                جهود المملكة العربية السعودية في الوقاية من السكري ورعاية المصابين، وتتويجكِ بوسام «سفيرة الصحة الوطنية».
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            {hasNationalBadge ? (
              <span className="bg-emerald-900/80 border border-emerald-300/60 text-emerald-100 px-4 py-3 rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-xs">
                <span>🎖️ تم كسب وسام سفيرة الصحة الوطنية</span>
              </span>
            ) : null}

            {onGoToNational && (
              <button
                onClick={onGoToNational}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-emerald-950 font-black rounded-2xl shadow-lg flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 transition cursor-pointer"
              >
                <span>{hasNationalBadge ? 'زيارة القسم الوطني ↺' : 'اكتشفي جهود وطني 🇸🇦'}</span>
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
      {completedCount > 0 && !allCompleted && (
        <div className="mt-8 text-center">
          <button
            onClick={onGoToCertificate}
            className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-5 py-2.5 rounded-full transition"
          >
            <span>عرض بطاقة الإنجاز الحالية والرسالة الصحية</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
