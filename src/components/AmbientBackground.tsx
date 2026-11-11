import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Soft radiant ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-cyan-100/35 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-amber-100/25 rounded-full blur-3xl" />

      {/* Floating 3D Health Symbols */}
      {/* 1. Pulsing Heart */}
      <div className="absolute top-24 right-12 animate-pulse-heart opacity-35 transition-transform duration-700 hover:scale-110">
        <svg className="w-12 h-12 text-rose-400 drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* 2. Water Drop (Hydration) */}
      <div className="absolute top-1/4 left-16 animate-float-slow opacity-35" style={{ animationDelay: '1s' }}>
        <svg className="w-10 h-10 text-cyan-500 drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      </div>

      {/* 3. Fresh Apple / Healthy Food */}
      <div className="absolute top-2/3 right-16 animate-float-slow opacity-35" style={{ animationDelay: '2s' }}>
        <svg className="w-11 h-11 text-emerald-500 drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 10c0-4.41-3.59-8-8-8-.34 0-.67.02-1 .07V2c0-.55-.45-1-1-1s-1 .45-1 1v.74C5.17 6.08 2 10.66 2 16c0 4.41 3.59 8 8 8s8-3.59 8-8c0-.68-.09-1.34-.25-1.97C18.91 13.08 20 11.66 20 10z" />
        </svg>
      </div>

      {/* 4. Protective Shield */}
      <div className="absolute bottom-28 left-20 animate-float-slow opacity-30" style={{ animationDelay: '3s' }}>
        <svg className="w-12 h-12 text-teal-600 drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v4h4v2h-4v4h-2v-4H7v-2h4V7z" />
        </svg>
      </div>

      {/* 5. Golden Star for Badges */}
      <div className="absolute top-16 left-1/3 animate-gentle-bounce opacity-40">
        <span className="text-2xl text-amber-400 drop-shadow">⭐</span>
      </div>

      <div className="absolute bottom-16 right-1/3 animate-gentle-bounce opacity-30" style={{ animationDelay: '1.5s' }}>
        <span className="text-xl text-teal-400">✨</span>
      </div>

      {/* 6. Running Shoe / Movement Symbol */}
      <div className="absolute top-1/2 right-6 animate-float-slow opacity-30" style={{ animationDelay: '2.5s' }}>
        <svg className="w-10 h-10 text-sky-500 drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13c-.34 0-.68-.07-1-.18V15h2v-2h-1zm-6-8c-1.1 0-2 .9-2 2v6h4V7c0-1.1-.9-2-2-2zm-8 8c-.55 0-1 .45-1 1v5c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h-3v-1c0-1.66-1.34-3-3-3H5zm4 4H7v-2h2v2z" />
        </svg>
      </div>
    </div>
  );
};
