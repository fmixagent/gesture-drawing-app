import { ImageData } from '@renderer/models/imageData';

async function getFilesFromDir(folderPath: string, images: ImageData[] = []): Promise<ImageData[]> {
  const fileList = await window.api.readDirFileNames(folderPath);
  for (const file of fileList) {
    const path = `${folderPath}\\${file}`;
    const imageData: ImageData = {
      name: file,
      url: undefined,
      localPath: `${folderPath}\\${file}`,
    };
    if (window.api.isDirectory(path)) {
      // Recover image
      await getFilesFromDir(path, images);
    } else {
      // Recover the
      images.push(imageData);
    }
  }
  return images;
}

const selectFolder = async (): Promise<string | null> => {
  const folderPath = await window.api.selectDirectory();
  if (!folderPath) {
    return null;
  }
  return folderPath;
};

const fsService = {
  getFilesFromDir,
  selectFolder,
};

export default fsService;
