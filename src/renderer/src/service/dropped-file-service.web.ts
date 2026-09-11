import { ImageData } from '@renderer/models/imageData';
import { DroppedFileService } from './dropped-file-service.electron';

const getImageDataFromFile = (file: File): ImageData => {
  return {
    name: file.name,
    url: URL.createObjectURL(file),
  };
};

const droppedFileServiceWeb: DroppedFileService = {
  getImageDataFromFile,
};

export default droppedFileServiceWeb;
