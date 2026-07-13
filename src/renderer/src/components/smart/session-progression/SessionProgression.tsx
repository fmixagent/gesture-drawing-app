import { Session } from '@renderer/models/session';
import React from 'react';

interface SesssionProgressionProps {
  session: Session;
  progression?: number; // in seconds
}
const SesssionProgression: React.FC<SesssionProgressionProps> = ({ session, progression }) => {
  const durationSession = session.sequence.reduce((acc, item) => acc + item.duration, 0);
  const progressionPercentage = progression ? (progression / durationSession) * 100 : 0;

  return (
    <div className="relative w-full h-4 left-0 bottom-0">
      <div className='absolute left-0 top-0 w-full h-1/2 z-10'>
        <div className='absolute top-0 left-0 h-full z-20 bg-gray-300' style={{ width: `${progressionPercentage}%` }}></div>
        <div className='w-full h-full bg-black'></div>
      </div>
      <div className="w-full flex justify-start items-center h-full">
        {session.sequence.map((timeStreth, index) => {
          const widthPercentage = (timeStreth.duration / durationSession) * 100;
          const isOdd = index % 2 === 0;
          return (
            <div
              key={index}
              className={`h-full last:border-none border-gray-300/60 border-r-[1px] ${isOdd ? 'bg-gray-700' : 'bg-gray-700'}`}
              style={{ width: `${widthPercentage}%` }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SesssionProgression;
