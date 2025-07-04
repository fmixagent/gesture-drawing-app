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
import { ArrowsFullscreen, FullscreenExit } from 'react-bootstrap-icons';
import Versions from './components/ui/versions/Versions';
import PlayerControls from './components/smart/player-controls/PlayerControls';
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

  return (
    <div className="relative flex w-dvw h-dvh bg-blue-500">
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
      {/* Image container */}
      <div className="flex w-full h-full object-contain">
        <img alt="logo" className="w-full h-full object-contain" src={electronLogo} />
      </div>
      <Versions></Versions>

      {/* Footer */}
      <div className="absolute flex justify-center items-center  w-full bottom-0 bg-gray-900/20 z-10 py-3 ">
        <PlayerControls />
      </div>
    </div>
  );
}

export default App;
