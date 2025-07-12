import React from 'react';

// Add a type definition for window.api to avoid 'unknown' type errors
declare global {
  interface Window {
    api: {
      onEnterFullscreen: (callback: () => void) => void;
      onLeaveFullscreen: (callback: () => void) => void;
    };
  }
}
import electronLogo from './assets/electron.svg';
import { ArrowsFullscreen, FullscreenExit, GearFill } from 'react-bootstrap-icons';
import Versions from './components/ui/versions/Versions';
import PlayerControls from './components/smart/player-controls/PlayerControls';
import ConfigurationPanel from './components/smart/configuration-panel/ConfigurationPanel';
import { Configuration, TIME_STRETCHS } from './models/configurtion';
import Timer from './components/smart/timer/Timer';
import CircularProgressBar from './components/ui/circular-progress-bar/CircularProgressBar';
// import { BrowserWindow } from 'electron';

function App(): React.JSX.Element {
  // Listen for fullscreen events via Electron IPC if needed
  React.useEffect(() => {
    window.api.onEnterFullscreen(() => {
      setIsFullscreen(true);
    });
    window.api.onLeaveFullscreen(() => {
      setIsFullscreen(false);
    });
  }, []);

  // Fullscreen management
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false);

  const onIpcFullscreen = (): void => {
    console.log('Toggling fullscreen mode');
    if (isFullscreen) {
      window.electron.ipcRenderer.send('exitfullscreen');
      setIsFullscreen(false);
      return;
    }
    window.electron.ipcRenderer.send('gofullscreen');
    setIsFullscreen(true);
  };

  // Configuration management
  const [configuration, setConfiguration] = React.useState<Configuration>({
    timeStretchSelected: TIME_STRETCHS[0],
  } as Configuration);
  const [isConfigurationPanelOpen, setIsConfigurationPanelOpen] = React.useState<boolean>(false);
  const onToggleConfigurationPanel = (): void => {
    setIsConfigurationPanelOpen((prev) => !prev);
  };
  const onChangeConfiguration = (newConfiguration: Configuration): void => {
    setConfiguration(newConfiguration);
    onStopTimer(); // Reset timer when configuration changes
    setTimerTime(newConfiguration.timeStretchSelected.duration);
  };

  // Timer
  const [isTimerVisible, setIsTimerVisible] = React.useState<boolean>(true);
  const [isTimerPlaying, setIsTimerPlaying] = React.useState<boolean>(false);
  const [timerTime, setTimerTime] = React.useState<number>(
    configuration.timeStretchSelected.duration
  );
  const onPlayTImer = (): void => {
    console.log('Playing timer');
    setIsTimerPlaying(true);
  };
  const onPauseTimer = (): void => {
    console.log('Pausing timer');
    setIsTimerPlaying(false);
  };
  const onStopTimer = (): void => {
    console.log('Stopping timer');
    setIsTimerPlaying(false);
    setTimerTime(configuration.timeStretchSelected.duration);
  };

  return (
    <div className="relative flex w-dvw h-dvh bg-blue-500">
      {/* Bt configuration */}
      <button
        type="button"
        className="absolute z-10 top-2 left-2 flex justify-center items-center w-10 h-10 bg-gray-800 text-gray-200 rounded-md shadow hover:bg-gray-700 cursor-pointer opacity-40 hover:opacity-100 transtion duration-300 ease-in-out"
        onClick={onToggleConfigurationPanel}
        title={`${isFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen'}`}
      >
        <GearFill className="w-5 h-5" />
      </button>
      <div
        className={`absolute top-14 left-2 ${isConfigurationPanelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-opacity duration-300 ease-in-out`}
      >
        <ConfigurationPanel
          configuration={configuration}
          timeStrechs={TIME_STRETCHS}
          onChange={onChangeConfiguration}
        />
      </div>
      {/* Bt fullscreen */}
      <button
        type="button"
        className="absolute z-10 top-2 right-2 flex justify-center items-center w-10 h-10 bg-gray-800 text-gray-200 rounded-md shadow hover:bg-gray-700 cursor-pointer opacity-40 hover:opacity-100 transtion duration-300 ease-in-out"
        onClick={onIpcFullscreen}
        title={`${isFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen'}`}
      >
        {isFullscreen ? (
          <FullscreenExit className="w-5 h-5" />
        ) : (
          <ArrowsFullscreen className="w-5 h-5" />
        )}
      </button>
      {/* Timer */}
      <div
        className={`absolute bg-gray-950 w-40 h-40 bottom-18 right-2 ${isTimerVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-opacity duration-300 ease-in-out`}
      >
        <div className="absolute w-full h-full">
          <Timer
            isPlaying={isTimerPlaying}
            inititalTime={timerTime}
            totalTime={configuration.timeStretchSelected.duration}
          />
        </div>
      </div>

      {/* Image container */}
      <div className="flex w-full h-full object-contain">
        <img alt="logo" className="w-full h-full object-contain" src={electronLogo} />
      </div>
      <Versions></Versions>

      {/* Footer */}
      <div className="absolute flex justify-center items-center  w-full bottom-0 bg-gray-900/20 z-10 py-3 ">
        <PlayerControls onPlay={onPlayTImer} onPause={onPauseTimer} onStop={onStopTimer} />
      </div>
    </div>
  );
}

export default App;
