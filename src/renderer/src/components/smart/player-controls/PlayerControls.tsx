import FullRoundButton from '@renderer/components/ui/full-round-button/FullRoundButton';
import React from 'react';
import { PauseFill, PlayFill, SkipEndFill, SkipStartFill, StopFill } from 'react-bootstrap-icons';

interface PlayerControlsProps {
  isActive?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isActive = false,
  onPlay,
  onPause,
  onStop,
  onNext,
  onPrevious,
}) => {
  const handlePlay = (): void => {
    onPlay?.();
  };

  const handlePause = (): void => {
    onPause?.();
  };
  const handleStop = (): void => {
    onStop?.();
  };

  return (
    <div className="flex flex-row items-enter gap-2">
      <FullRoundButton icon={<SkipStartFill className="relative" />} onClick={onPrevious} />
      {!isActive ? (
        <FullRoundButton
          icon={<PlayFill className="relative left-[0.05em]" />}
          onClick={handlePlay}
        />
      ) : (
        <FullRoundButton icon={<PauseFill className="relative" />} onClick={handlePause} />
      )}
      <FullRoundButton icon={<StopFill className="relative" />} onClick={handleStop} />
      <FullRoundButton icon={<SkipEndFill className="relative" />} onClick={onNext} />
    </div>
  );
};

export default PlayerControls;
