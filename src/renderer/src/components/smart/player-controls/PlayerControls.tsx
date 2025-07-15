import FullRoundButton from '@renderer/components/ui/full-round-button/FullROundButton';
import React from 'react';
import { PauseFill, PlayFill, SkipEndFill, SkipStartFill, StopFill } from 'react-bootstrap-icons';

interface PlayerControlsProps {
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  onPlay,
  onPause,
  onStop,
  onNext,
  onPrevious,
}) => {
  const [isPLaying, setIsPlaying] = React.useState(false);
  const handlePlay = (): void => {
    onPlay?.();
    setIsPlaying(true);
  };

  const handlePause = (): void => {
    onPause?.();
    setIsPlaying(false);
  };
  const handleStop = (): void => {
    onStop?.();
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-row items-enter gap-2">
      <FullRoundButton icon={<SkipStartFill className="relative" />} onClick={onPrevious} />
      {!isPLaying ? (
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
