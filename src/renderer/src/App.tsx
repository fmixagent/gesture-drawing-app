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

      getStoreValue: (key: string) => Promise<string>;
      setStoreValue: (key: string, value: string) => Promise<void>;
      deleteStoreValue: (key: string) => Promise<void>;

      getCategoryStoreValue: (category: string, key: string) => Promise<string>;
      setCategoryStoreValue: (category: string, key: string, value: string) => Promise<void>;
      deleteCategoryStoreValue: (category: string, key: string) => Promise<void>;
      getAllCategoryStoreValues: (category: string) => Promise<string[]>;
      getPathForFile: (file: File) => string;
    };
  }
}
import { ArrowsFullscreen, Folder, FullscreenExit, GearFill } from 'react-bootstrap-icons';
import PlayerControls from './components/smart/player-controls/PlayerControls';
import CounterDisplay from './components/ui/counter-display/CounterDisplay';
import useCountdownTimer from './hooks/use-countdown-counter';
import CircularProgressBar from './components/ui/circular-progress-bar/CircularProgressBar';
import { UserConfiguration } from './models/userConfiguration';
import storeService from './service/store-service';
import ConfigurationPanel from './components/smart/configuration-panel/ConfigurationPanel';
import SesssionProgression from './components/smart/session-progression/SessionProgression';
import useImagesShown from './hooks/use-images-shown';

const TIMEOUT_MOVING_DURATION = 3000;
let TIMEOUT_ID: any;

function App(): React.JSX.Element {
  const onTimerStart = (): void => {
    onNext();
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

  // Image management
  const { images, srcImage, resetSrcImage, onPrevious, onNext } = useImagesShown(userConfiguration);

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
    resetSrcImage();
    userConfiguration.timeStretchSelected
      ? resetTimer(userConfiguration.timeStretchSelected.duration)
      : resetTimer(
          userConfiguration.sessionSelected
            ? userConfiguration.sessionSelected.sequence[0].duration
            : countdownTime
        );
  };

  // Reset timer and image when time stretch changes
  useEffect(() => {
    if (!userConfiguration.timeStretchSelected) return;

    resetTimer(userConfiguration.timeStretchSelected.duration);
    setIsInfiniteLoop(true);
    resetSrcImage();
  }, [userConfiguration.timeStretchSelected]);

  // Reset timer and image when time stretch changes
  const [currentSessionStretchIndex, setCurrentSessionStretchIndex] = React.useState<number>(0);
  useEffect(() => {
    if (!userConfiguration.sessionSelected) return;

    resetTimer(userConfiguration.sessionSelected.sequence[currentSessionStretchIndex].duration);
    setIsInfiniteLoop(false);
    resetSrcImage();
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

  // PLAYER CONTROLS
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
          {!userConfiguration.folderSelected && !userConfiguration.bucketSelected ? (
            <span>
              In the userConfiguration panel select a folder or bucket with images to pick from
              there a random one.
            </span>
          ) : images.length === 0 ? (
            <span>
              The {userConfiguration.folderSelected ? 'folder' : 'bucket'} selected doesn&apos;t
              contain any image
            </span>
          ) : (
            <div className="flex flex-col items-center justify-start gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-500">
                <div className="h-auto w-10 text-gray-900">
                  <svg version="1.1" viewBox="0 0 38.318 25.934" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="m11.088 6.4845e-5c-1.5888-0.0087-3.1517 0.85829-4.0234 2.4434-0.46395 0.84355-0.46277 0.68337-1.125 2.0449-0.65479 1.3462-1.964 4.1844-5.0996 11.115-0.18349 0.32005-0.32898 0.65836-0.45508 1.0039l-0.02344 0.05469 0.0059 2e-3c-0.23026 0.64996-0.36719 1.3352-0.36719 2.0566 0 4.1314 4.0722 7.2366 8.8262 7.2129 4.3845-0.02184 8.1873-2.6985 8.752-6.3555h3.1621c0.56464 3.657 4.3675 6.3336 8.752 6.3555 4.754 0.02368 8.8262-3.0815 8.8262-7.2129 0-0.7214-0.13692-1.4067-0.36719-2.0566l0.0059-2e-3 -0.02344-0.05469c-0.1261-0.34555-0.27159-0.68385-0.45508-1.0039-3.1357-6.9308-4.4448-9.769-5.0996-11.115-0.66223-1.3616-0.66105-1.2014-1.125-2.0449-0.87179-1.5851-2.4346-2.4521-4.0234-2.4434-0.52962 0.0029-1.0613 0.10313-1.5723 0.30664-0.88467 0.35235-1.6022 1.087-1.9648 2.0352-0.36261 0.94818-0.28761 2.1722 0.49219 3.1758l0.04102 0.05469 1.2422-1.3594c-0.26978-0.44478-0.24591-0.83063-0.09375-1.2285 0.17463-0.45662 0.60199-0.86756 0.94922-1.0059 1.2476-0.4969 2.5694-0.08813 3.3516 1.334 0.50832 0.92422 0.44735 0.64995 1.0859 1.9629 0.49908 1.0261 1.4211 3.0191 3.334 7.2305-1.3534-0.68447-2.936-1.0776-4.6035-1.0859-4.3396-0.02161-8.1102 2.5647-8.7344 6.1582h-3.1973c-0.6242-3.5936-4.3948-6.1798-8.7344-6.1582-1.6675 0.0083-3.2501 0.40147-4.6035 1.0859 1.9129-4.2113 2.8349-6.2043 3.334-7.2305 0.63859-1.3129 0.57762-1.0387 1.0859-1.9629 0.78216-1.4221 2.1039-1.8309 3.3516-1.334 0.34723 0.13829 0.77459 0.54924 0.94922 1.0059 0.15216 0.39789 0.17603 0.78374-0.09375 1.2285l1.2422 1.3594 0.04102-0.05469c0.77979-1.0036 0.8548-2.2276 0.49219-3.1758-0.36261-0.94818-1.0802-1.6828-1.9648-2.0352-0.51098-0.20351-1.0426-0.30375-1.5723-0.30664zm-2.2617 13.42c3.8898-0.01937 6.8242 2.4451 6.8242 5.2246s-2.9344 5.2697-6.8242 5.2891c-3.8898 0.01937-6.8262-2.4432-6.8262-5.2227 0-2.7795 2.9363-5.2716 6.8262-5.291zm20.666 0c3.8898 0.01937 6.8262 2.5115 6.8262 5.291 0 2.7795-2.9363 5.242-6.8262 5.2227-3.8898-0.01937-6.8242-2.5096-6.8242-5.2891 0-2.7795 2.9344-5.244 6.8242-5.2246z"
                      fill="currentColor"
                      stopColor="#000000"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth=".99999"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <span className="font-bold">fmixlab</span>
                <span>|</span>
                <span>Gestures</span>
              </div>
              <div className="w-70 py-10 text-center">
                <p>
                  Choose a folder or bucket with your samples images, choose your time stretches or
                  session and <strong>just start drawing</strong>
                </p>
              </div>

              {(userConfiguration.folderSelected || userConfiguration.bucketSelected) && (
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center justify-center gap-2 border-b border-dotted border-gray-600 pb-1">
                    <Folder />
                    <span>
                      {userConfiguration.folderSelected ?? userConfiguration.bucketSelected?.name}
                    </span>
                  </div>
                  <span className="font-bold">{images.length} photos</span>
                </div>
              )}
            </div>
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
