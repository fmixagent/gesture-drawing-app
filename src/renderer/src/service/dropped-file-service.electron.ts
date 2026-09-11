import { ImageData } from '@renderer/models/imageData';

const getImageDataFromFile = (file: File): ImageData => {
  const filePath = window.api.getPathForFile(file);
  return {
    name: file.name,
    localPath: filePath,
  };
};

const droppedFileServiceElectron = {
  getImageDataFromFile,
};

export type DroppedFileService = typeof droppedFileServiceElectron;

export default droppedFileServiceElectron;
