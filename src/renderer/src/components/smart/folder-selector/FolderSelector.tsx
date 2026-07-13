import fsService from '@renderer/service/fs-service';
import React from 'react';

import { Folder2 } from 'react-bootstrap-icons';

interface FolderSelectorProps {
  folder?: string;
  onFolderSelected?: (folderPath: string) => void;
}
const FolderSelector: React.FC<FolderSelectorProps> = ({ folder, onFolderSelected }) => {
  const [folderSelected, setFolderSelected] = React.useState<string | null>(folder || null);
  const folderOnChange = async (): Promise<void> => {
    const folderPath = await fsService.selectFolder();
    if (!folderPath) {
      return;
    }
    setFolderSelected(folderPath);
    onFolderSelected?.(folderPath);
  };

  return (
    <div className="flex flex-col gap-3">
      <h1 className="flex h-8 items-center justify-start border border-gray-700 px-3 text-xs text-white">
        {folder}
      </h1>
      <button
        type="button"
        className="flex cursor-pointer items-center justify-center rounded-md border border-gray-300/20 bg-gray-900 p-2 text-gray-300 transition-all duration-200 ease-in-out hover:bg-gray-700 hover:text-gray-100"
        onClick={() => folderOnChange()}
      >
        <Folder2 className="h-5 w-5 text-gray-500 dark:text-gray-300" />

        <p className="mb-1 pl-2 text-sm dark:text-gray-400">
          <span className="font-semibold">Select a folder</span>
        </p>
      </button>
      {folderSelected && (
        <div title={folderSelected} className="truncate bg-gray-800 p-3 text-gray-600">
          {folderSelected}
        </div>
      )}
    </div>
  );
};

export default FolderSelector;
