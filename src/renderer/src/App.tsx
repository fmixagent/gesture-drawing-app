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
import { UserConfiguration } from './models/userConfiguration';
import storeService from './service/store-service';
import ConfigurationPanel from './components/smart/configuration-panel/ConfigurationPanel';
import SesssionProgression from './components/smart/session-progression/SessionProgression';

const TIMEOUT_MOVING_DURATION = 3000;
let TIMEOUT_ID: any;

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
    resetTimerWithoutStopping,
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
    userConfiguration.timeStretchSelected
      ? resetTimer(userConfiguration.timeStretchSelected.duration)
      : resetTimer(
          userConfiguration.sessionSelected
            ? userConfiguration.sessionSelected.sequence[0].duration
            : countdownTime
        );
  };

  // Image management
  const [srcImage, setSrcImage] = React.useState<string>();
  const [imagePaths, setImagePaths] = React.useState<string[]>([]);
  useEffect(() => {
    const fetchImages = async (): Promise<void> => {
      if (!userConfiguration.selectedFolder) {
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
      const elapsedSessionTime = userConfiguration.sessionSelected.sequence
        .slice(0, currentSessionStretchIndex)
        .reduce((acc, stretch) => acc + stretch.duration, 0);
      const elapsedTime = elapsedSessionTime + (countdownTime - timer);
      setSessionProgressInSeconds(elapsedTime); // Add the elapsed time of the current stretch
      elapsedTime === 1 && onNext(); // Show the first image at the start of the session

      if (timer === 0) {
        const updateCurrentSessionIndex = currentSessionStretchIndex + 1;
        const sessionFinished =
          updateCurrentSessionIndex >= userConfiguration.sessionSelected.sequence.length;

        if (sessionFinished) {
          setSessionProgressInSeconds(0);
          setCurrentSessionStretchIndex(0);
          stopTimer({ resetTimer: true });
          return;
        }

        onNext(); // Move to the next image when the timer reaches 0
        setCurrentSessionStretchIndex(updateCurrentSessionIndex);
        const currentStretch =
          userConfiguration.sessionSelected.sequence[updateCurrentSessionIndex];
        resetTimerWithoutStopping(currentStretch.duration);
      }
    }
  }, [timer]);

  // IMAGE MANAGEMENT
  const [imagesShown, setImagesShown] = React.useState<string[]>([]);
  const [imageShownIndex, setImageShownIndex] = React.useState<number>(-1);
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
    if (imageShownIndex >= imagesShown.length - 1) {
      showNewRandomImageFromFolder();
      return;
    }

    const newIndex = imageShownIndex + 1;
    setImageShownIndex(newIndex);
    const nextImage = imagesShown[newIndex];
    showImage(nextImage); // Show the next image;
  };

  const onPrevious = (): void => {
    if (imageShownIndex <= 0) {
      return;
    }

    const newIndex = imageShownIndex - 1;
    setImageShownIndex(newIndex);
    const previousImage = imagesShown[newIndex];
    showImage(previousImage); // Show the previous image
  };
  const [showPlayerControls, setShowPlayerControls] = React.useState<boolean>(true);

  const onMouseMove = (): void => {
    setShowPlayerControls(true);
    TIMEOUT_ID && clearTimeout(TIMEOUT_ID);
    TIMEOUT_ID = setTimeout(() => {
      setShowPlayerControls(false);
    }, TIMEOUT_MOVING_DURATION);
  };

  const onMouseEnter = (): void => {
    setShowPlayerControls(true);
  };

  const onmouseleave = (): void => {
    setShowPlayerControls(false);
  };

  return (
    <div
      className="relative flex h-dvh w-dvw bg-gray-800"
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onmouseleave}
    >
      {/* Bt userConfiguration */}
      <button
        type="button"
        className="absolute top-2 left-2 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-gray-800 text-gray-200 opacity-40 shadow duration-300 ease-in-out hover:bg-gray-700 hover:opacity-100"
        onClick={onToggleConfigurationPanel}
        title={`${isFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen'}`}
      >
        <GearFill className="h-5 w-5" />
      </button>

      {/* User configuration panel */}
      <div className="pointer-events-none absolute top-0 left-0 z-30 h-full w-full">
        <div
          className={`absolute top-0 h-full w-[30%] ${isConfigurationPanelOpen ? 'pointer-events-auto left-0 opacity-100' : 'pointer-events-none -left-[30%] opacity-0'} transition-all duration-300 ease-in-out`}
        >
          <ConfigurationPanel
            userConfiguration={userConfiguration}
            onChange={onChangeConfiguration}
            onClose={onToggleConfigurationPanel}
          />
        </div>
        <div
          onClick={onToggleConfigurationPanel}
          className={`h-full w-full transition-all duration-400 ease-in-out ${isConfigurationPanelOpen ? 'pointer-events-auto bg-black/50' : 'pointer-events-none bg-black/0'}`}
        ></div>
      </div>

      {/* Bt fullscreen */}
      <button
        type="button"
        className="transtion absolute top-2 right-2 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-gray-800 text-gray-200 opacity-40 shadow duration-300 ease-in-out hover:bg-gray-700 hover:opacity-100"
        onClick={onIpcFullscreen}
        title={`${isFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen'}`}
      >
        {isFullscreen ? (
          <FullscreenExit className="h-5 w-5" />
        ) : (
          <ArrowsFullscreen className="h-5 w-5" />
        )}
      </button>

      {/* Timer */}
      <div
        className={`pointer-events-none absolute right-2 bottom-18 h-40 w-40 transition-opacity duration-300 ease-in-out`}
      >
        <div className="absolute h-full w-full">
          <div className="relative h-40 w-40 rounded-md">
            <div
              className={`h-full w-full ${isCounterActive ? 'opacity-100' : 'opacity-50 grayscale'} transition-all duration-500 ease-in-out`}
            >
              <CounterDisplay time={timer} totalTime={countdownTime} />
              <div className="absolute inset-0 flex items-center justify-center p-3">
                <CircularProgressBar percentage={(countdownTime - timer / countdownTime) * 100} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image container */}
      {srcImage ? (
        <div className="flex h-full w-full object-contain">
          <img alt="logo" className="h-full w-full object-contain" src={srcImage} />
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-gray-500">
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
      <div className="absolute bottom-0 left-0 z-10 w-full">
        <div className="flex flex-col">
          <div
            className={`flex w-full items-center justify-center bg-gray-900/20 py-3 ${showPlayerControls ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} transition-opacity duration-300 ease-in-out`}
          >
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
            <SesssionProgression
              session={userConfiguration.sessionSelected}
              progression={sessionProgressInSeconds}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
