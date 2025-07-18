import React, { useEffect } from 'react';

// Add a type definition for window.api to avoid 'unknown' type errors
declare global {
  interface Window {
    api: {
      onEnterFullscreen: (callback: () => void) => void;
      onLeaveFullscreen: (callback: () => void) => void;
      selectDirectory: () => Promise<string | null>;
      readDirFileNames: (path: string) => Promise<string[]>;
      isDirectory: (path: string) => boolean;
    };
  }
}
import { ArrowsFullscreen, FullscreenExit, GearFill } from 'react-bootstrap-icons';
import PlayerControls from './components/smart/player-controls/PlayerControls';
import ConfigurationPanel from './components/smart/configuration-panel/ConfigurationPanel';
import { Configuration, TIME_STRETCHS } from './models/configuration';
import fsService from './service/fs-service';
import CounterDisplay from './components/ui/counter-display/CounterDisplay';
import useCountdownTimer from './hooks/use-countdown-counter';
import CircularProgressBar from './components/ui/circular-progress-bar/CircularProgressBar';
// import { BrowserWindow } from 'electron';

function App(): React.JSX.Element {
  const onTimerStart = (): void => {
    console.log('Timer started');
    showRandomImageFromFolder();
  };

  const {
    timer,
    isActive: isCounterActive,
    countdownTime,
    setIsInfiniteLoop,
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer,
  } = useCountdownTimer(onTimerStart);

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
    stopTimer();
  };

  // Player controls management
  const onPlayTImer = (): void => {
    startTimer();
  };
  const onPauseTimer = (): void => {
    pauseTimer();
  };
  const onStopTimer = (): void => {
    setSrcImage(undefined);
    stopTimer();
  };

  // Image management
  const [srcImage, setSrcImage] = React.useState<string>();
  const [imagePaths, setImagePaths] = React.useState<string[]>([]);
  useEffect(() => {
    const fetchImages = async (): Promise<void> => {
      if (!configuration.selectedFolder) {
        console.log('No folder selected, skipping image fetch');
        return;
      }
      const imagePaths = await fsService.getFilesFromDir(configuration.selectedFolder);
      setImagePaths(imagePaths);
    };
    fetchImages();

    return () => {
      setImagePaths([]);
    };
  }, [configuration.selectedFolder]);

  useEffect(() => {
    resetTimer(configuration.timeStretchSelected.duration);
    setIsInfiniteLoop(true); // Set infinite loop to true by default
    setSrcImage(undefined); // Reset image source when configuration changes
  }, [configuration.timeStretchSelected]);

  const showRandomImageFromFolder = (): void => {
    const imagePath = getRandomImageFromFolder();
    if (!imagePath) {
      console.log('No images available in the selected folder');
      setSrcImage(undefined); // Fallback to default logo
      return;
    }
    console.log('Showing random image from folder: ', imagePath);

    const fileUrl = 'atom:' + imagePath;
    setSrcImage(fileUrl);
  };

  const getRandomImageFromFolder = (): string | undefined => {
    if (imagePaths.length === 0) {
      return undefined; // Fallback to default logo if no images are available
    }
    const randomIndex = Math.floor(Math.random() * imagePaths.length);
    const imagePath = imagePaths[randomIndex];
    return imagePath;
  };

  return (
    <div className="relative flex w-dvw h-dvh bg-gray-800">
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
        className={`absolute  w-40 h-40 bottom-18 right-2  pointer-events-none transition-opacity duration-300 ease-in-out`}
      >
        <div className="absolute w-full h-full">
          <div className="relative w-40 h-40 rounded-md">
            <div
              className={`w-full h-full ${isCounterActive ? 'opacity-100' : 'opacity-50'} transition-all ease-in-out duration-500`}
            >
              <CounterDisplay time={timer} totalTime={countdownTime} />
              <div className="absolute inset-0 flex justify-center items-center p-3">
                <CircularProgressBar percentage={(countdownTime - timer / countdownTime) * 100} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image container */}
      {srcImage ? (
        <div className="flex w-full h-full object-contain">
          <img alt="logo" className="w-full h-full object-contain" src={srcImage} />
        </div>
      ) : (
        <div className="flex w-full h-full justify-center items-center text-gray-500">
          {!configuration.selectedFolder ? (
            <span>
              In the configuration panel select a folder with images to pick from there a random
              one.
            </span>
          ) : imagePaths.length === 0 ? (
            <span>The folder selected doesn&apos;t contain any image</span>
          ) : (
            <span>{imagePaths.length} photos</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="absolute flex justify-center items-center  w-full bottom-0 bg-gray-900/20 z-10 py-3 ">
        <PlayerControls
          isActive={isCounterActive}
          onPlay={onPlayTImer}
          onPause={onPauseTimer}
          onStop={onStopTimer}
        />
      </div>
    </div>
  );
}

export default App;
