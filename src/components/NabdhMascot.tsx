import React from 'react';

interface NabdhMascotProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  mood?: 'happy' | 'waving' | 'excited' | 'proud' | 'thinking';
  showShield?: boolean;
  showSaudiFlag?: boolean;
  className?: string;
}

export const NabdhMascot: React.FC<NabdhMascotProps> = ({
  message = 'أهلًا بكِ يا بطلة الصحة!',
  size = 'md',
  mood = 'happy',
  showShield = true,
  showSaudiFlag = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-48 h-48',
    xl: 'w-60 h-60',
  }[size];

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble */}
      {message && (
        <div className="relative mb-3 max-w-xs animate-gentle-bounce bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border-2 border-teal-200 text-teal-900 text-sm md:text-base font-bold text-center leading-relaxed">
          <span>{message}</span>
          <div className="absolute -bottom-2 right-1/2 translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-teal-200 rotate-45 transform" />
        </div>
      )}

      {/* Mascot Graphic (SVG 3D Style Nabdh Heart) */}
      <div className={`relative ${sizeClasses} animate-float-slow`}>
        {/* Soft Glow Shadow Underneath */}
        <div className="absolute -bottom-2 inset-x-4 h-4 bg-teal-400/25 blur-md rounded-full transform scale-x-90" />

        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl overflow-visible">
          <defs>
            {/* Heart 3D Radial Gradient (Turquoise & Sky Blue) */}
            <radialGradient id="nabdhBodyGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="35%" stopColor="#22d3ee" />
              <stop offset="75%" stopColor="#0891b2" />
              <stop offset="100%" stopColor="#0e7490" />
            </radialGradient>

            {/* Specular Highlight */}
            <linearGradient id="highlightGrad" x1="0%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Shield Golden Gradient */}
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
          </defs>

          {/* Main Heart Body */}
          <path
            d="M 100,175 
               C 25,120 15,65 55,35 
               C 85,12 98,35 100,48 
               C 102,35 115,12 145,35 
               C 185,65 175,120 100,175 Z"
            fill="url(#nabdhBodyGrad)"
            stroke="#0e7490"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Top Left Specular Sheen (Gives 3D Volume) */}
          <ellipse cx="65" cy="50" rx="22" ry="14" fill="url(#highlightGrad)" transform="rotate(-30 65 50)" />
          <circle cx="50" cy="62" r="5" fill="#ffffff" opacity="0.6" />

          {/* Cute Big Eyes */}
          <g>
            {/* Left Eye */}
            <circle cx="75" cy="85" r="14" fill="#0f172a" />
            <circle cx="79" cy="81" r="5" fill="#ffffff" />
            <circle cx="72" cy="89" r="2.5" fill="#ffffff" />
            {/* Left Eyelash */}
            <path d="M 64,74 Q 69,70 75,72" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* Right Eye */}
            <circle cx="125" cy="85" r="14" fill="#0f172a" />
            <circle cx="129" cy="81" r="5" fill="#ffffff" />
            <circle cx="122" cy="89" r="2.5" fill="#ffffff" />
            {/* Right Eyelash */}
            <path d="M 136,74 Q 131,70 125,72" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>

          {/* Rosy Cheeks */}
          <ellipse cx="58" cy="102" rx="9" ry="5" fill="#f43f5e" opacity="0.45" />
          <ellipse cx="142" cy="102" rx="9" ry="5" fill="#f43f5e" opacity="0.45" />

          {/* Happy Smile */}
          <path
            d="M 85,104 Q 100,122 115,104"
            fill="#be123c"
            stroke="#0f172a"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Cute Tongue */}
          <path
            d="M 93,112 Q 100,121 107,112"
            fill="#fb7185"
            stroke="none"
          />

          {/* Waving / Welcoming Hands */}
          {/* Left Hand (Welcoming) */}
          <g transform="translate(15, 80) rotate(-15)">
            <ellipse cx="0" cy="0" rx="14" ry="11" fill="#38bdf8" stroke="#0284c7" strokeWidth="2.5" />
            <circle cx="-4" cy="-5" r="4" fill="#7dd3fc" />
          </g>

          {/* Right Hand: Saudi Flag OR Health Shield OR waving hand */}
          {showSaudiFlag ? (
            <g transform="translate(142, 75)">
              {/* Arm */}
              <ellipse cx="8" cy="15" rx="12" ry="10" fill="#38bdf8" stroke="#0284c7" strokeWidth="2.5" />
              {/* Flag Pole (Golden spear top) */}
              <line x1="22" y1="-30" x2="22" y2="55" stroke="#b45309" strokeWidth="3.5" strokeLinecap="round" />
              <polygon points="22,-36 18,-28 26,-28" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
              {/* Saudi Flag cloth (Green with white sword motif) */}
              <path
                d="M 22,-28 Q 42,-25 62,-29 Q 60,2 62,8 Q 42,4 22,8 Z"
                fill="#006C35"
                stroke="#024d26"
                strokeWidth="1.5"
              />
              {/* White emblem / sword on flag */}
              <line x1="32" y1="-10" x2="52" y2="-10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              <line x1="42" y1="-14" x2="42" y2="-6" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          ) : showShield ? (
            <g transform="translate(145, 85)">
              {/* Arm */}
              <ellipse cx="10" cy="5" rx="12" ry="10" fill="#38bdf8" stroke="#0284c7" strokeWidth="2.5" />
              {/* Health Shield */}
              <path
                d="M 15,-10 L 40,-10 C 40,15 28,35 15,42 C 2,35 -10,15 -10,-10 Z"
                fill="url(#shieldGrad)"
                stroke="#b45309"
                strokeWidth="2.5"
                transform="scale(0.85) translate(10, 0)"
              />
              {/* Plus symbol on shield */}
              <path
                d="M 23,2 L 23,18 M 15,10 L 31,10"
                stroke="#0284c7"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>
          ) : (
            <g transform="translate(180, 80) rotate(20)">
              <ellipse cx="0" cy="0" rx="14" ry="11" fill="#38bdf8" stroke="#0284c7" strokeWidth="2.5" />
            </g>
          )}

          {/* Tiny Stethoscope or Medical Pulse Line on Chest */}
          <path
            d="M 82,135 L 93,135 L 97,125 L 103,145 L 107,135 L 118,135"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.85"
          />
        </svg>

        {/* Small floating sparkles */}
        <span className="absolute -top-1 right-2 text-amber-400 text-lg animate-pulse">✦</span>
        <span className="absolute bottom-4 left-0 text-cyan-400 text-sm animate-ping">✧</span>
      </div>
    </div>
  );
};
