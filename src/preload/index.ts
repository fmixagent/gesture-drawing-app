import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import * as fs from 'fs';
import path from 'path';

// Custom APIs for renderer
const api = {
  onEnterFullscreen: (callback) => ipcRenderer.on('enter-full-screen', () => callback()),
  onLeaveFullscreen: (callback) => ipcRenderer.on('leave-full-screen', () => callback()),
  selectDirectory: async (): Promise<string | null> => {
    const result = await ipcRenderer.invoke('selectDirectory');
    return result ? result : null;
  },
  readDirFileNames: async (pathName: string): Promise<string[]> => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    const files = await fs.readdirSync(pathName, { encoding: 'utf-8', withFileTypes: true });
    const imageFiles = files
      .filter((dirent) => dirent.isFile()) // Ensure it's a file, not a directory
      .map((dirent) => dirent.name) // Get the file name
      .filter((fileName) => {
        const ext = path.extname(fileName).toLowerCase(); // Get lowercase extension
        return imageExtensions.includes(ext); // Check if extension is in our list
      });
    return imageFiles;
  },
  isDirectory: (path: string): boolean => fs.lstatSync(path).isDirectory(),
  setStoreValue: async (key: string, value: string): Promise<void> => {
    await ipcRenderer.invoke('electron-store:set', key, value);
  },
  getStoreValue: async (key: string): Promise<string> => {
    const value = await ipcRenderer.invoke('electron-store:get', key);
    return value;
  },
  deleteStoreValue: async (key: string): Promise<void> => {
    await ipcRenderer.invoke('electron-store:delete', key);
  },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);

  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
