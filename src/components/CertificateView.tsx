import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { NabdhMascot } from './NabdhMascot.tsx';
import { Award, Share2, Printer, Download, Copy, Check, Sparkles, Heart, ArrowLeft, Send } from 'lucide-react';
import { sound, toArabicNumerals, getGradeLabel } from '../utils/numerals.ts';
import { DataService } from '../services/dataService.ts';
import type { Student, SiteSettings } from '../types/index.ts';

interface CertificateViewProps {
  student: Student;
  settings: SiteSettings;
  onBackToMap: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  student,
  settings,
  onBackToMap,
}) => {
  const [message, setMessage] = useState(
    'الصحة تاج على رؤوسنا نحفظها بالوعي والغذاء المتوازن وشرب الماء وممارسة الرياضة كل يوم! شكرًا لمعلمتنا الغالية أ. خلود الحريصي.'
  );
  const [nationalMission] = useState<string | null>(() => {
    return localStorage.getItem(`national_mission_${student.id}`);
  });
  const [selectedTheme, setSelectedTheme] = useState<'turquoise' | 'golden' | 'emerald' | 'royal'>('turquoise');
  const [copied, setCopied] = useState(false);
  const [savingMessage, setSavingMessage] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);

  const certRef = useRef<HTMLDivElement | null>(null);

  const themeStyles = {
    turquoise: {
      border: 'border-teal-400',
      bg: 'bg-gradient-to-br from-teal-50 via-white to-cyan-50',
      headerBg: 'bg-gradient-to-r from-teal-800 to-cyan-800',
      accent: 'text-teal-800',
      ribbon: 'from-teal-600 to-cyan-600',
    },
    golden: {
      border: 'border-amber-400',
      bg: 'bg-gradient-to-br from-amber-50 via-white to-yellow-50',
      headerBg: 'bg-gradient-to-r from-amber-700 to-yellow-800',
      accent: 'text-amber-900',
      ribbon: 'from-amber-500 to-yellow-600',
    },
    emerald: {
      border: 'border-emerald-400',
      bg: 'bg-gradient-to-br from-emerald-50 via-white to-teal-50',
      headerBg: 'bg-gradient-to-r from-emerald-800 to-teal-800',
      accent: 'text-emerald-900',
      ribbon: 'from-emerald-600 to-teal-600',
    },
    royal: {
      border: 'border-indigo-400',
      bg: 'bg-gradient-to-br from-indigo-50 via-white to-purple-50',
      headerBg: 'bg-gradient-to-r from-indigo-900 to-purple-900',
      accent: 'text-indigo-950',
      ribbon: 'from-indigo-600 to-purple-600',
    },
  }[selectedTheme];

  const handleSaveMessage = async () => {
    setSavingMessage(true);
    try {
      await DataService.saveMessage(student, message, selectedTheme);
      sound.playCorrect();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingMessage(false);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(
        `رسالة بطلة الصحة: ${student.fullName} (${getGradeLabel(student.grade)}):\n"${message}"\nمبادرة أبطال الصحة - المدرسة الابتدائية ٣١١`
      );
      sound.playClick();
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    const shareData = {
      title: 'بطاقة إنجاز سفيرة الصحة',
      text: `أنا الطالبة ${student.fullName} حققت ${toArabicNumerals(student.totalPoints)} نقطة في مبادرة أبطال الصحة للوعي والوقاية من السكري!\n"${message}"`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or unsupported
      }
    } else {
      handleCopyText();
    }
  };

  const handleDownloadPng = async () => {
    if (!certRef.current) return;
    setIsExportingImage(true);
    sound.playClick();
    try {
      const dataUrl = await toPng(certRef.current, {
        quality: 0.95,
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = `شهادة_أبطال_الصحة_${student.fullName.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export certificate image:', err);
    } finally {
      setIsExportingImage(false);
    }
  };

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-teal-200 shadow-xs no-print">
        <button
          onClick={onBackToMap}
          className="flex items-center gap-2 text-teal-700 hover:text-teal-900 font-bold text-sm bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 transition"
        >
          <ArrowLeft className="w-4 h-4 rotate-180" />
          <span>العودة لخريطة المغامرة</span>
        </button>

        <div className="flex items-center gap-2 text-right">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-teal-950 flex items-center justify-center font-black">
            🏆
          </div>
          <div>
            <h2 className="text-base md:text-lg font-black text-slate-800">الرسالة الصحية وبطاقة الإنجاز</h2>
            <span className="text-xs text-amber-600 font-bold">شهادة سفيرة الوعي والوقاية الرسمية</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Controls (4 cols) - Hidden in Print */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border-2 border-teal-200 shadow-lg space-y-5 text-right no-print">
          <div>
            <h3 className="text-base md:text-lg font-black text-teal-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>رسالتكِ قد تصنع فرقًا</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              ماذا تودين أن تقولي لأسرتكِ وزميلاتكِ وللعالم عن الوعي الصحي والوقاية من السكري؟
            </p>
          </div>

          {/* Student Info Recap */}
          <div className="bg-teal-50/70 p-3 rounded-2xl border border-teal-100 text-xs font-bold space-y-1">
            <div className="text-teal-900">{student.fullName}</div>
            <div className="text-teal-700">
              {getGradeLabel(student.grade)} • فصل {student.className}
            </div>
            <div className="text-amber-700">{toArabicNumerals(student.totalPoints)} نقطة تميز 🌟</div>
          </div>

          {/* Message Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              نص رسالتكِ الصحية:
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتبي رسالتكِ الملهمة هنا..."
              className="w-full p-3 text-xs md:text-sm font-medium bg-slate-50 border-2 border-teal-200 rounded-2xl focus:outline-none focus:border-teal-500 focus:bg-white transition"
            />
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              اختاري النمط اللوني للشهادة:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'turquoise', name: 'فيروزي صحي', color: 'bg-teal-500' },
                { id: 'golden', name: 'ذهبي متميز', color: 'bg-amber-400' },
                { id: 'emerald', name: 'أخضر واعد', color: 'bg-emerald-500' },
                { id: 'royal', name: 'بنفسجي ملكي', color: 'bg-indigo-600' },
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedTheme(theme.id as any);
                  }}
                  className={`p-2 rounded-xl text-xs font-extrabold border flex items-center gap-2 cursor-pointer transition ${
                    selectedTheme === theme.id
                      ? 'border-teal-700 bg-teal-50 text-teal-900 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${theme.color}`} />
                  <span>{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Save message button */}
          <button
            onClick={handleSaveMessage}
            disabled={savingMessage}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs md:text-sm rounded-2xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>تم حفظ الرسالة في سجلكِ!</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{savingMessage ? 'جاري الحفظ...' : 'حفظ الرسالة رسميًا'}</span>
              </>
            )}
          </button>

          {/* Actions & Sharing */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              onClick={handleDownloadPng}
              disabled={isExportingImage}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-teal-950 font-black text-xs md:text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingImage ? 'جاري تجهيز الصورة...' : 'حفظ الشهادة بصيغة PNG عالية الجودة'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>طباعة الشهادة / حفظ كملف PDF</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleNativeShare}
                className="py-2.5 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>مشاركة الإنجاز</span>
              </button>

              <button
                onClick={handleCopyText}
                className="py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ النص'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview Certificate (8 cols) */}
        <div className="lg:col-span-8 w-full flex flex-col items-center">
          <div
            ref={certRef}
            className={`w-full max-w-[760px] ${themeStyles.bg} border-4 ${themeStyles.border} rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden certificate-sheet text-right`}
          >
            {/* Corner Filigrees */}
            <div className="absolute top-2 right-2 w-10 h-10 border-t-4 border-r-4 border-amber-400/90 rounded-tr-2xl pointer-events-none" />
            <div className="absolute top-2 left-2 w-10 h-10 border-t-4 border-l-4 border-amber-400/90 rounded-tl-2xl pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-10 h-10 border-b-4 border-r-4 border-amber-400/90 rounded-br-2xl pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-10 h-10 border-b-4 border-l-4 border-amber-400/90 rounded-bl-2xl pointer-events-none" />

            {/* Header: Official Credentials */}
            <div className="flex items-center justify-between border-b-2 border-slate-200/80 pb-4 mb-6">
              <div className="text-right text-[11px] md:text-xs font-black text-slate-700 leading-tight">
                <div>المملكة العربية السعودية</div>
                <div>وزارة التعليم</div>
                <div>إدارة تعليم منطقة الرياض</div>
                <div className="text-teal-800">{settings.schoolName || 'المدرسة الابتدائية ٣١١'}</div>
              </div>

              {/* Center Emblem */}
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-teal-950 flex items-center justify-center text-2xl shadow-md mx-auto mb-1">
                  🏆
                </div>
                <div className="text-[10px] font-extrabold text-teal-900 tracking-wider">
                  مبادرة أبطال الصحة
                </div>
              </div>

              {/* Logo slot */}
              <div className="w-20 md:w-24 h-12 flex items-center justify-center">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="شعار الوزارة" className="max-h-full max-w-full object-contain" />
                ) : (
                  <div className="text-center text-[9px] font-bold text-teal-900 border border-teal-200 rounded-lg p-1 bg-white/70">
                    <div>وزارة التعليم</div>
                    <div className="text-[7px] text-slate-500">Ministry of Education</div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Title */}
            <div className="text-center space-y-2 mb-6">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900">
                شهادة سفيرة الوعي والوقاية من السكري
              </h3>
              <p className="text-xs md:text-sm font-bold text-teal-800">
                «أبطال الصحة | رحلة الوعي والوقاية من السكري»
              </p>
            </div>

            {/* Certificate Body Text */}
            <div className="space-y-4 text-center my-6">
              <p className="text-sm md:text-base text-slate-700 font-medium leading-relaxed">
                تَشهد إدارة المدرسة الابتدائية ٣١١ بمنطقة الرياض بأن الطالبة البطلة:
              </p>

              <div className="inline-block bg-white/90 border-2 border-teal-400 px-8 py-3 rounded-2xl shadow-sm">
                <span className="text-xl md:text-2xl font-black text-teal-900 tracking-wide">
                  {student.fullName}
                </span>
              </div>

              <div className="text-xs md:text-sm font-bold text-slate-600">
                <span>{getGradeLabel(student.grade)}</span>
                <span className="mx-2">•</span>
                <span>فصل {student.className}</span>
              </div>

              <p className="text-xs md:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed">
                قد أتمّت بنجاح متألق محطات الرحلة التعليمية التفاعلية للوعي الصحي والوقاية من مرض السكري، واستحقت لقب <span className="font-extrabold text-teal-800">«سفيرة الوعي الصحي»</span> بجدارة واقتدار.
              </p>
            </div>

            {/* Badges Shelf on Certificate */}
            <div className="bg-white/80 border border-slate-200 rounded-2xl p-4 my-5">
              <div className="text-[11px] font-extrabold text-teal-900 mb-2 flex items-center justify-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>
                  الشارات المكتسبة ({toArabicNumerals(student.badges.length)} شارة):
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {student.badges.length > 0 ? (
                  student.badges.map((bName) => {
                    const isNational = bName.includes('الوطنية') || bName.includes('سفيرة الصحة الوطنية');
                    return (
                      <span
                        key={bName}
                        className={`px-3 py-1 rounded-full text-[11px] font-black shadow-2xs flex items-center gap-1 ${
                          isNational
                            ? 'bg-[#006C35] text-white border-2 border-amber-400 ring-2 ring-emerald-200'
                            : 'bg-amber-100 text-amber-950 border border-amber-300'
                        }`}
                      >
                        <span>{isNational ? '🇸🇦' : '⭐'}</span>
                        <span>{bName}</span>
                      </span>
                    );
                  })
                ) : (
                  <span className="text-xs text-slate-400">بطلة الصحة في طريق إكمال الشارات</span>
                )}
              </div>
            </div>

            {/* Health Message Card */}
            {message && (
              <div className="bg-teal-50/70 border-r-4 border-teal-600 p-4 rounded-2xl my-3 text-right">
                <div className="text-[10px] font-extrabold text-teal-800 mb-1">
                  «رسالة بطلة الصحة للعالم»:
                </div>
                <p className="text-xs md:text-sm font-bold text-slate-800 italic leading-relaxed">
                  "{message}"
                </p>
              </div>
            )}

            {/* National Mission / Pledge Card */}
            {nationalMission && (
              <div className="bg-emerald-50/90 border-r-4 border-emerald-600 p-3.5 rounded-2xl my-3 text-right">
                <div className="text-[10px] font-extrabold text-emerald-900 mb-0.5 flex items-center gap-1">
                  <span>🇸🇦</span>
                  <span>«مهمتي الوطنية وسفيرة الصحة في وطني»:</span>
                </div>
                <p className="text-xs font-bold text-emerald-950 leading-relaxed">
                  "{nationalMission}"
                </p>
              </div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-3 my-4 text-center">
              <div className="bg-white border border-teal-100 p-2.5 rounded-xl">
                <span className="block text-lg font-black text-teal-800">
                  {toArabicNumerals(student.totalPoints)} نقطة
                </span>
                <span className="text-[10px] text-slate-500 font-bold">النقاط الإجمالية 🌟</span>
              </div>
              <div className="bg-white border border-teal-100 p-2.5 rounded-xl">
                <span className="block text-lg font-black text-cyan-800">
                  {toArabicNumerals(student.completedStations.length)} من {toArabicNumerals(6)}
                </span>
                <span className="text-[10px] text-slate-500 font-bold">المحطات المنجزة 🎯</span>
              </div>
            </div>

            {/* Signatures & Accreditation Footer */}
            <div className="mt-8 pt-4 border-t-2 border-slate-200/80 flex items-end justify-between text-xs font-bold text-slate-700">
              <div className="text-right">
                <div className="text-slate-500 text-[10px]">إعداد وتنفيذ المبادرة:</div>
                <div className="text-teal-900 font-extrabold text-sm">{settings.teacherName || 'أ. خلود الحريصي'}</div>
                <div className="text-[10px] text-slate-500">معلمة المرحلة الابتدائية</div>
              </div>

              {/* Official Seal Graphic */}
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-teal-500 flex flex-col items-center justify-center text-[8px] font-extrabold text-teal-800 leading-none shadow-xs rotate-[-6deg] bg-white">
                <span>معتمد</span>
                <span className="text-sm my-0.5">🎖️</span>
                <span>الابتدائية ٣١١</span>
              </div>

              <div className="text-left">
                <div className="text-slate-500 text-[10px]">المدرسة:</div>
                <div className="text-slate-800 font-extrabold text-sm">{settings.schoolName || 'المدرسة الابتدائية ٣١١'}</div>
                <div className="text-[10px] text-slate-500">إدارة تعليم منطقة الرياض</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
