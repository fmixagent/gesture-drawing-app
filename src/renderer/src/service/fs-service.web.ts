import { ImageData } from '@renderer/models/imageData';
import { FsService } from './fs-service.electron';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];

// The File System Access API only hands out directory handles, not resolvable OS paths,
// so selected folders are kept here in memory, keyed by the path string returned to callers.
const directoryHandles = new Map<string, FileSystemDirectoryHandle>();

const isImageFile = (fileName: string): boolean => {
  const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
  return IMAGE_EXTENSIONS.includes(extension);
};

const collectImagesFromDirectory = async (
  directoryHandle: FileSystemDirectoryHandle,
  folderPath: string,
  images: ImageData[]
): Promise<void> => {
  for await (const entry of directoryHandle.values()) {
    const entryPath = `${folderPath}/${entry.name}`;

    if (entry.kind === 'directory') {
      directoryHandles.set(entryPath, entry);
      await collectImagesFromDirectory(entry, entryPath, images);
      continue;
    }

    if (!isImageFile(entry.name)) {
      continue;
    }

    const file = await entry.getFile();
    images.push({
      name: entry.name,
      url: URL.createObjectURL(file),
      localPath: entryPath,
    });
  }
};

async function getFilesFromDir(folderPath: string, images: ImageData[] = []): Promise<ImageData[]> {
  const directoryHandle = directoryHandles.get(folderPath);
  if (!directoryHandle) {
    return images;
  }

  await collectImagesFromDirectory(directoryHandle, folderPath, images);
  return images;
}

const selectFolder = async (): Promise<string | null> => {
  if (!window.showDirectoryPicker) {
    console.error('File System Access API is not supported in this browser.');
    return null;
  }

  try {
    const directoryHandle = await window.showDirectoryPicker();
    directoryHandles.set(directoryHandle.name, directoryHandle);
    return directoryHandle.name;
  } catch {
    // User dismissed the picker
    return null;
  }
};

const fsServiceWeb: FsService = {
  getFilesFromDir,
  selectFolder,
};

export default fsServiceWeb;
