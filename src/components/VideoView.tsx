import React, { useState, useRef } from 'react';
import { Play, CheckCircle2, ArrowLeft, Info, AlertCircle, Video } from 'lucide-react';
import { sound } from '../utils/numerals.ts';
import type { SiteSettings } from '../types/index.ts';

interface VideoViewProps {
  settings: SiteSettings;
  onContinue: () => void;
}

export const VideoView: React.FC<VideoViewProps> = ({ settings, onContinue }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasWatched, setHasWatched] = useState(!settings.videoRequired);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoEnded = () => {
    setHasWatched(true);
    sound.playCorrect();
  };

  const handleProceed = () => {
    sound.playClick();
    onContinue();
  };

  const videoSrc = settings.videoPath || '/assets/aistudio/VID-20261110-WA0092_76b55817.mp4';

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
      {/* Title Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-cyan-50 border border-cyan-200 px-3.5 py-1 rounded-full text-cyan-800 text-xs font-bold mb-2">
          <Video className="w-3.5 h-3.5" />
          <span>المحطة التمهيدية</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-teal-900">
          شاهدي وتعرّفي
        </h2>
        <p className="text-slate-600 text-sm md:text-base mt-1">
          {settings.videoTitle || 'اليوم العالمي للسكري ١٤ نوفمبر — الوقاية تبدأ من البيت والمدرسة'}
        </p>
      </div>

      {/* Main Video Box Container */}
      <div className="bg-white rounded-3xl p-4 md:p-6 border-2 border-teal-200 shadow-xl overflow-hidden relative">
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center">
          <video
            ref={videoRef}
            src={videoSrc}
            controls
            playsInline
            onEnded={handleVideoEnded}
            onTimeUpdate={() => {
              if (videoRef.current) {
                const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
                setVideoProgress(pct);
                if (pct > 80) setHasWatched(true);
              }
            }}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Video Description & Notes */}
        <div className="mt-4 p-3 bg-teal-50/60 rounded-xl border border-teal-100 text-right">
          <p className="text-xs md:text-sm text-slate-700 font-medium">
            {settings.videoDescription || 'شاهدي هذا المقطع القصير للتعرف على أسرار صحة البنكرياس وكيف يساندنا الإنسولين في عيش يوم نشيط ومشرق.'}
          </p>
        </div>

        {/* Enforcement notice if required */}
        {settings.videoRequired && !hasWatched && (
          <div className="mt-3 flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>حددت المعلمة مشاهدة المقطع التوعوي للمتابعة نحو المغامرة.</span>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleProceed}
            disabled={settings.videoRequired && !hasWatched}
            className={`px-8 py-3.5 rounded-2xl font-extrabold text-base md:text-lg flex items-center gap-2 transition-all cursor-pointer ${
              settings.videoRequired && !hasWatched
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-md hover:shadow-lg active:scale-95'
            }`}
          >
            <span>انتقلي إلى الرحلة</span>
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
