import { environment } from '@renderer/environments/environment';
import { useEffect, useState } from 'react';

type UseFullscreenProps = {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
};

const useFullscreen = (): UseFullscreenProps => {
  useEffect(() => {
    addFullscreenListeners();

    return () => {
      removeFullscreenListeners();
    };
  }, []);

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const onToggleFullscreen = (): void => {
    if (isFullscreen) {
      exitFullscreen();
      setIsFullscreen(false);
      return;
    }
    goFullscreen();
    setIsFullscreen(true);
  };

  // Environment actions
  const addFullscreenListeners = (): void => {
    if (environment.webVersion) {
      document.addEventListener('fullscreenchange', fullscreenWebListener);
      return;
    }

    window.electron.ipcRenderer.on('enter-full-screen', onGoFullscreenListener);
    window.electron.ipcRenderer.on('leave-full-screen', onExitFullscreenListener);
  };

  const removeFullscreenListeners = (): void => {
    if (environment.webVersion) {
      document.removeEventListener('fullscreenchange', fullscreenWebListener);
      return;
    }

    window.electron.ipcRenderer.on('enter-full-screen', onGoFullscreenListener);
    window.electron.ipcRenderer.on('leave-full-screen', onExitFullscreenListener);
  };

  const fullscreenWebListener = () => {
    if (document.fullscreenElement) {
      // Entering fullscreen
      setIsFullscreen(true);
    } else {
      // Exiting fullscreen
      setIsFullscreen(false);
    }
  };

  const onGoFullscreenListener = () => {
    setIsFullscreen(true);
  };

  const onExitFullscreenListener = () => {
    setIsFullscreen(false);
  };

  const goFullscreen = (): void => {
    if (environment.webVersion) {
      document.documentElement?.requestFullscreen();
      return;
    }

    window.electron.ipcRenderer.send('goFullscreen');
  };

  const exitFullscreen = (): void => {
    if (environment.webVersion) {
      document.exitFullscreen?.();
      return;
    }

    window.electron.ipcRenderer.send('exitFullscreen');
  };

  return {
    isFullscreen,
    onToggleFullscreen,
  };
};

export default useFullscreen;
