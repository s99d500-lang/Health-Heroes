import React from 'react';
import type { SiteSettings } from '../types/index.ts';

interface FooterProps {
  settings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  return (
    <footer className="w-full bg-gradient-to-b from-white to-teal-50/60 border-t border-teal-100 py-6 px-4 text-center text-xs md:text-sm text-slate-600 mt-auto z-10">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
        <div>
          <span className="font-bold text-teal-800">إعداد وتنفيذ: </span>
          <span className="font-extrabold text-teal-900">{settings.teacherName || 'أ. خلود الحريصي'}</span>
          <span className="text-slate-400 mx-2">|</span>
          <span className="text-slate-700">{settings.schoolName || 'المدرسة الابتدائية ٣١١'}</span>
          <span className="text-slate-500"> – إدارة تعليم منطقة الرياض</span>
        </div>

        <div className="text-slate-500 text-xs">
          مبادرة أبطال الصحة لتعزيز الوعي والوقاية من السكري © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};
