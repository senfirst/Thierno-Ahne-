import React, { useState } from 'react';

interface OfficialEmblemProps {
  className?: string;
  size?: number;
}

export const OfficialEmblem: React.FC<OfficialEmblemProps> = ({ className = '', size = 56 }) => {
  const [hasError, setHasError] = useState(false);

  // Path generated via generate_image tool
  const imageSrc = '/src/assets/images/school_emblem_almaarifa_1790261083914.jpg';

  if (hasError) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-full bg-emerald-900 border-2 border-amber-400 flex items-center justify-center text-amber-300 font-bold shadow-sm ${className}`}
        title="ALMAARIFA THIERNO DJIBRIL OUSMANE BA"
      >
        <span className="text-xs tracking-tighter text-center leading-none">
          ALM<br />BA
        </span>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt="Sceau officiel ALMAARIFA THIERNO DJIBRIL OUSMANE BA"
      style={{ width: size, height: size }}
      className={`rounded-full object-cover border border-amber-500/30 shadow-sm ${className}`}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
};
