import fsService from '@renderer/service/fs-service';
import React from 'react';

import { Folder2 } from 'react-bootstrap-icons';

interface FolderSelectorProps {
  selectedFolder?: string;
  onFolderSelected?: (folderPath: string) => void;
}
const FolderSelector: React.FC<FolderSelectorProps> = ({ selectedFolder, onFolderSelected }) => {
  const [folderSelected, setFolderSelected] = React.useState<string | null>(selectedFolder || null);
  const folderOnChange = async (): Promise<void> => {
    const folderPath = await fsService.selectFolder();
    if (!folderPath) {
      console.log('No folder selected');
      return;
    }
    setFolderSelected(folderPath);
    onFolderSelected?.(folderPath);
  };

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-white text-xs border border-gray-700 px-3 py-2">{selectedFolder}</h1>
      <button
        type="button"
        className="cursor-pointer flex items-center justify-center bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gray-100 p-2 rounded-md"
        onClick={() => folderOnChange()}
      >
        <Folder2 className="w-5 h-5 text-gray-500 dark:text-gray-300" />

        <p className="mb-1 pl-2 text-sm  dark:text-gray-400">
          <span className="font-semibold">Select a folder</span>
        </p>
      </button>
      {folderSelected && (
        <div title={folderSelected} className="p-3 bg-gray-800 text-gray-600 truncate">
          {folderSelected}
        </div>
      )}
    </div>
  );
};

export default FolderSelector;
