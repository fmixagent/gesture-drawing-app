import { Configuration, TimeStretch } from '@renderer/models/configurtion';
import React from 'react';
import FolderExplorer from '../folder-explorer/FolderExplorer';
import FolderSelector from '../folder-selector/FolderSelector';

interface ConfigurationPanelProps {
  configuration: Configuration;
  timeStrechs: TimeStretch[];
  onChange?: (configuration: Configuration) => void;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  configuration,
  timeStrechs,
  onChange,
}) => {
  const onChangeTimeStretch = (timeStretchId: string): void => {
    const findTimeStretch = timeStrechs.find((ts) => ts.id === timeStretchId);
    if (!findTimeStretch) return;
    const newConfiguration: Configuration = {
      ...configuration,
      timeStretchSelected: findTimeStretch,
    };
    onChange?.(newConfiguration);
  };

  const onFolderSelected = (folderPath: string): void => {
    console.log('Selected folder:', folderPath);
    // Here you can handle the folder selection, e.g., save it to the configuration
    const newConfiguration: Configuration = {
      ...configuration,
      selectedFolder: folderPath,
    };
    onChange?.(newConfiguration);
  };

  return (
    <div className="flex w-[10rem] h-full flex-col gap-10 items-enter bg-black/50  p-3 rounded-md">
      <section>
        <h1 className="color-white text-gray-100 border-b border-dotted border-gray-300/40 pb-2 mb-3 font-semibold">
          Time stretch
        </h1>
        <main className="flex flex-col gap-3">
          {timeStrechs.map((timeStretch) => (
            <button
              key={timeStretch.id}
              className={`flex-1 rounded-md border border-transparent px-4 py-5 text-sm font-medium shadow-sm transition-colors duration-200 ease-in-out ${
                configuration?.timeStretchSelected?.id === timeStretch.id
                  ? 'bg-gray-300 text-gray-900 '
                  : 'cursor-pointer bg-gray-900 text-gray-300 hover:bg-gray-100 hover:text-gray-900'
              }`}
              onClick={() => onChangeTimeStretch(timeStretch.id)}
            >
              {timeStretch.label}
            </button>
          ))}
        </main>
      </section>
      <section>
        <h1 className="color-white text-gray-100 border-b border-dotted border-gray-300/40 pb-2 mb-3 font-semibold">
          Folder selected
        </h1>
        <main className="flex flex-col gap-3">
          <FolderSelector onFolderSelected={onFolderSelected} />
        </main>
      </section>
    </div>
  );
};

export default ConfigurationPanel;
