import React from 'react';

import { useState } from 'react';
import { Folder2 } from 'react-bootstrap-icons';

interface FolderExplorerProps {
  onFileSelected?: (folderPath: string) => void;
}
const FolderExplorer: React.FC<FolderExplorerProps> = ({ onFileSelected }) => {
  const [filePaths, setFilePaths] = useState<string[]>([]);

  const folderOnChange = async (): Promise<void> => {
    const folderPath = await window.api.selectDirectory();
    console.log('Selected folder:', folderPath);
    const filesAndFolders = await getFilesFromDir(folderPath);
    console.log('Files and folders:', filesAndFolders);
    setFilePaths(filesAndFolders);
  };

  async function getFilesFromDir(folderPath, filePaths: string[] = []): Promise<string[]> {
    const fileList = await window.api.readDirFileNames(folderPath);
    console.log('Files in directory:', fileList);
    for (const file of fileList) {
      console.log('Processing file:', file);
      const path = `${folderPath}\\${file}`;
      if (window.api.isDirectory(path)) {
        await getFilesFromDir(path, filePaths);
      } else {
        filePaths.push(path);
      }
    }
    return filePaths;
  }

  const onFileSelectedHandler = (file: string): void => {
    console.log('Selected file:', file);
    onFileSelected?.(file);
    setFilePaths([]);
  };

  return (
    <div className="absolute top-3 left-50 z-10">
      <button
        type="button"
        className="flex items-center justify-center bg-gray-900 text-gray-200 p-2 rounded-md"
        onClick={() => folderOnChange()}
      >
        <Folder2 className="w-5 h-5 text-gray-500 dark:text-gray-300" />

        <p className="mb-1 pl-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold">Select a folder</span>
        </p>
      </button>

      {filePaths.length > 0 && (
        <ul className="flex flex-col w-400">
          {filePaths.map((file: string) => (
            <li className="w-full border-b border-gray-600 last:border-none" key={file}>
              <button
                onClick={() => onFileSelectedHandler(file)}
                type="button"
                className="cursor-pointer w-full text-left p-2 bg-gray-700 text-gray-200 hover:bg-gray-200 hover:text-gray-700 transition-all duration-200 ease-in-out"
              >
                {file}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FolderExplorer;
