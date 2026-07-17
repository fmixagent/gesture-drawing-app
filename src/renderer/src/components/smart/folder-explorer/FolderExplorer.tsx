import { ImageData } from '@renderer/models/imageData';
import React from 'react';

import { useState } from 'react';
import { Folder2 } from 'react-bootstrap-icons';

interface FolderExplorerProps {
  onFileSelected?: (folderPath: string) => void;
}
const FolderExplorer: React.FC<FolderExplorerProps> = ({ onFileSelected }) => {
  const [images, setImages] = useState<ImageData[]>([]);

  const folderOnChange = async (): Promise<void> => {
    const folderPath = await window.api.selectDirectory();

    if (!folderPath) return setImages([]);

    const filesAndFolders = await getFilesFromDir(folderPath);
    setImages(filesAndFolders);
  };

  async function getFilesFromDir(
    folderPath: string,
    images: ImageData[] = []
  ): Promise<ImageData[]> {
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

  const onFileSelectedHandler = (file: string): void => {
    console.log('Selected file:', file);
    onFileSelected?.(file);
    setImages([]);
  };

  return (
    <div>
      <button
        type="button"
        className="flex cursor-pointer items-center justify-center rounded-md bg-gray-900 p-2 text-gray-200"
        onClick={() => folderOnChange()}
      >
        <Folder2 className="h-5 w-5 text-gray-500 dark:text-gray-300" />

        <p className="mb-1 pl-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold">Select a folder</span>
        </p>
      </button>

      {images.length > 0 && (
        <ul className="flex w-400 flex-col">
          {images.map((imageData: ImageData) => (
            <li className="w-full border-b border-gray-600 last:border-none" key={imageData.name}>
              <button
                onClick={() => onFileSelectedHandler(imageData.name)}
                type="button"
                className="w-full cursor-pointer bg-gray-700 p-2 text-left text-gray-200 transition-all duration-200 ease-in-out hover:bg-gray-200 hover:text-gray-700"
              >
                TEST {imageData.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FolderExplorer;
