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
      setStoreValue: (key: string, value: string) => Promise<void>;
      getStoreValue: (key: string) => Promise<string>;
      deleteStoreValue: (key: string) => Promise<void>;
    };
  }
}
import { ArrowsFullscreen, FullscreenExit, GearFill } from 'react-bootstrap-icons';
import PlayerControls from './components/smart/player-controls/PlayerControls';
import fsService from './service/fs-service';
import CounterDisplay from './components/ui/counter-display/CounterDisplay';
import useCountdownTimer from './hooks/use-countdown-counter';
import CircularProgressBar from './components/ui/circular-progress-bar/CircularProgressBar';
import { TIME_STRETCHS, UserConfiguration } from './models/userConfiguration';
import storeService from './service/store-service';
import ConfigurationPanel from './components/smart/configuration-panel/ConfigurationPanel';
import SesssionProgression from './components/smart/session-progression/SessionProgression';

function App(): React.JSX.Element {
  const onTimerStart = (): void => {
    showNewRandomImageFromFolder();
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
    resetTimerWithoutStopping
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
    if (isFullscreen) {
      window.electron.ipcRenderer.send('exitfullscreen');
      setIsFullscreen(false);
      return;
    }
    window.electron.ipcRenderer.send('gofullscreen');
    setIsFullscreen(true);
  };

  // UserConfiguration management
  const [userConfiguration, setUserConfiguration] = React.useState<UserConfiguration>(
    new UserConfiguration()
  );
  useEffect(() => {
    const storedUserConfig = async (): Promise<void> => {
      const userConfig = await storeService.getUserConfig();
      setUserConfiguration(userConfig);
    };
    storedUserConfig();
  }, []);

  const [isConfigurationPanelOpen, setIsConfigurationPanelOpen] = React.useState<boolean>(false);
  const onToggleConfigurationPanel = (): void => {
    const isOpen = !isConfigurationPanelOpen;
    isOpen && pauseTimer();
    setIsConfigurationPanelOpen((prev) => !prev);
  };
  const onChangeConfiguration = (newConfiguration: UserConfiguration): void => {
    setUserConfiguration(newConfiguration);
    storeService.setUserConfig(newConfiguration);
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
    setCurrentSessionStretchIndex(0);
    setSessionProgressInSeconds(0);
    setSrcImage(undefined);
    stopTimer();
  };

  // Image management
  const [srcImage, setSrcImage] = React.useState<string>();
  const [imagePaths, setImagePaths] = React.useState<string[]>([]);
  useEffect(() => {
    const fetchImages = async (): Promise<void> => {
      if (!userConfiguration.selectedFolder) {
        console.log('No folder selected, skipping image fetch');
        return;
      }
      const imagePaths = await fsService.getFilesFromDir(userConfiguration.selectedFolder);
      setImagePaths(imagePaths);
    };
    fetchImages();

    return () => {
      setImagePaths([]);
    };
  }, [userConfiguration.selectedFolder]);

  // Reset timer and image when time stretch changes
  useEffect(() => {
    if (!userConfiguration.timeStretchSelected) return;

    resetTimer(userConfiguration.timeStretchSelected.duration);
    setIsInfiniteLoop(true);
    setSrcImage(undefined);
  }, [userConfiguration.timeStretchSelected]);

  // Reset timer and image when time stretch changes
  const [currentSessionStretchIndex, setCurrentSessionStretchIndex] = React.useState<number>(0);
  useEffect(() => {
    if (!userConfiguration.sessionSelected) return;

    resetTimer(userConfiguration.sessionSelected.sequence[currentSessionStretchIndex].duration);
    setIsInfiniteLoop(false);
    setSrcImage(undefined);
  }, [userConfiguration.sessionSelected]);

  // Session management
  const [sessionProgressInSeconds, setSessionProgressInSeconds] = React.useState<number>(0);
  useEffect(() => {
    // Update the session progression in seconds
    if (userConfiguration.sessionSelected) {
      const elapsedSessionTime = userConfiguration.sessionSelected.sequence.slice(0, currentSessionStretchIndex).reduce((acc, stretch) => acc + stretch.duration, 0);
      const elapsedTime = elapsedSessionTime + (countdownTime - timer);
      setSessionProgressInSeconds(elapsedTime); // Add the elapsed time of the current stretch
    }

    if(timer === 0 && userConfiguration.sessionSelected ) {
      const updateCurrentSessionIndex = currentSessionStretchIndex + 1;
      const sessionFinished = updateCurrentSessionIndex >= userConfiguration.sessionSelected.sequence.length;

      if (sessionFinished) {
        setSessionProgressInSeconds(0);
        setCurrentSessionStretchIndex(0);
        stopTimer({resetTimer: true});
        return;
      }

      setCurrentSessionStretchIndex(updateCurrentSessionIndex);
      const currentStretch = userConfiguration.sessionSelected.sequence[currentSessionStretchIndex];
      resetTimerWithoutStopping(currentStretch.duration);
    }
  }, [timer]);

  // IMAGE MANAGEMENT
  const [imagesShown, setImagesShown] = React.useState<string[]>([]);
  const [imageShoiwnIndex, setImageShownIndex] = React.useState<number>(-1);
  const showNewRandomImageFromFolder = (): void => {
    const imagePath = getRandomImageFromFolder();
    if (!imagePath) {
      setSrcImage(undefined);
      return;
    }
    showImage(imagePath);
    setImagesShown((prev) => [...prev, imagePath]);
    setImageShownIndex((prev) => prev + 1);
  };

  const showImage = (imagePath: string): void => {
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

  const onNext = (): void => {
    if (imageShoiwnIndex >= imagesShown.length - 1) {
      showNewRandomImageFromFolder();
      return;
    }

    const newIndex = imageShoiwnIndex + 1;
    setImageShownIndex(newIndex);
    const nextImage = imagesShown[newIndex];
    showImage(nextImage); // Show the next image;
  };

  const onPrevious = (): void => {
    if (imageShoiwnIndex <= 0) {
      return;
    }

    const newIndex = imageShoiwnIndex - 1;
    setImageShownIndex(newIndex);
    const previousImage = imagesShown[newIndex];
    showImage(previousImage); // Show the previous image
  };

  return (
    <div className="relative flex w-dvw h-dvh bg-gray-800">
      {/* Bt userConfiguration */}
      <button
        type="button"
        className="absolute z-10 top-2 left-2 flex justify-center items-center w-10 h-10 bg-gray-800 text-gray-200 rounded-md shadow hover:bg-gray-700 cursor-pointer opacity-40 hover:opacity-100 transtion duration-300 ease-in-out"
        onClick={onToggleConfigurationPanel}
        title={`${isFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen'}`}
      >
        <GearFill className="w-5 h-5" />
      </button>

      <div className="top-0 left-0 w-full h-full absolute z-30 pointer-events-none">
        <div
          className={`absolute w-[30%] h-full top-0 ${isConfigurationPanelOpen ? 'opacity-100 pointer-events-auto left-0' : 'opacity-0 pointer-events-none -left-[30%]'} transition-all duration-300 ease-in-out`}
        >
          <ConfigurationPanel
            userConfiguration={userConfiguration}
            timeStrechs={TIME_STRETCHS}
            onChange={onChangeConfiguration}
            onClose={onToggleConfigurationPanel}
          />
        </div>
        <div
          onClick={onToggleConfigurationPanel}
          className={` w-full h-full ${isConfigurationPanelOpen ? 'pointer-events-auto bg-gray-900/90' : 'bg-gray-900/0 pointer-events-none'}`}
        ></div>
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
          {!userConfiguration.selectedFolder ? (
            <span>
              In the userConfiguration panel select a folder with images to pick from there a random
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
      <div className="absolute w-full left-0 bottom-0 z-10 ">
        <div className="flex flex-col">
          <div className="w-full flex justify-center items-center bg-gray-900/20 py-3">
            <PlayerControls
              isActive={isCounterActive}
              onPlay={onPlayTImer}
              onPause={onPauseTimer}
              onStop={onStopTimer}
              onNext={onNext}
              onPrevious={onPrevious}
            />
          </div>
          {/* Session */}
          {userConfiguration?.sessionSelected && (
            <SesssionProgression session={userConfiguration.sessionSelected} progression={sessionProgressInSeconds} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
