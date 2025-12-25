
import React, { useState, useEffect } from 'react';

interface DiceRollerProps {
  onComplete: (value: number) => void;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ onComplete }) => {
  const [value, setValue] = useState(1);
  const [rolling, setRolling] = useState(true);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      setValue(Math.floor(Math.random() * 20) + 1);
      count++;
      if (count > 15) {
        clearInterval(interval);
        const final = Math.floor(Math.random() * 20) + 1;
        setValue(final);
        setRolling(false);
        setTimeout(() => onComplete(final), 1000);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center gap-10 p-10 bg-black/60 backdrop-blur-sm rounded-3xl border-2 border-amber-900/20" dir="rtl">
      <div className={`
        w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center text-5xl sm:text-6xl font-bold rounded-xl border-4 transition-all duration-100 shadow-2xl
        ${rolling ? 'bg-amber-900 text-amber-50 border-amber-500 animate-bounce' : 'bg-amber-100 text-amber-900 border-amber-900 shadow-[0_0_50px_rgba(251,191,36,0.6)]'}
      `}
      style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
      >
        {value}
      </div>
      <p className="gothic-font text-2xl sm:text-4xl text-amber-400 tracking-widest animate-pulse text-center leading-relaxed">
        {rolling ? 'در حال مشورت با الهه سرنوشت...' : 'سرنوشت شما رقم خورد!'}
      </p>
    </div>
  );
};

export default DiceRoller;
