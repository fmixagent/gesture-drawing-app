import React from 'react';
import FolderSelector from '../folder-selector/FolderSelector';
import ListSelector, { ListItem } from '../list-selector/list-selector';
import { PRELOADED_SESSIONs, Session } from '@renderer/models/session';
import { TimeStretch, UserConfiguration } from '@renderer/models/userConfiguration';

interface ConfigurationPanelProps {
  userConfiguration: UserConfiguration;
  timeStrechs: TimeStretch[];
  onChange?: (userConfiguration: UserConfiguration) => void;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  userConfiguration,
  timeStrechs,
  onChange,
}) => {
  const onChangeTimeStretch = (timeStretchId: string): void => {
    const findTimeStretch = timeStrechs.find((ts) => ts.id === timeStretchId);
    if (!findTimeStretch) return;
    const newConfiguration: UserConfiguration = {
      ...userConfiguration,
      timeStretchSelected: findTimeStretch,
    };
    onChange?.(newConfiguration);
  };

  const onFolderSelected = (folderPath: string): void => {
    console.log('Selected folder:', folderPath);
    // Here you can handle the folder selection, e.g., save it to the userConfiguration
    const newConfiguration: UserConfiguration = {
      ...userConfiguration,
      selectedFolder: folderPath,
    };
    onChange?.(newConfiguration);
  };

  const sessionItems: ListItem<Session>[] = PRELOADED_SESSIONs.map((session) => ({
    id: session.sequenceName || 'session-' + session.totalDuration,
    name: session.sequenceName || `Session (${session.totalDuration} seconds)`,
    value: session,
  }));

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
                userConfiguration?.timeStretchSelected?.id === timeStretch.id
                  ? 'bg-gray-300 text-gray-900 '
                  : 'cursor-pointer bg-gray-900 text-gray-300 hover:bg-gray-100 hover:text-gray-900'
              }`}
              onClick={() => onChangeTimeStretch(timeStretch.id)}
            >
              {timeStretch.label}
            </button>
          ))}
          <h2 className="color-white text-gray-100 mt-3 pb-2 mb-3 font-normal">or use a session</h2>
          <ListSelector items={sessionItems} />
        </main>
      </section>
      <section>
        <h1 className="color-white text-gray-100 border-b border-dotted border-gray-300/40 pb-2 mb-3 font-semibold">
          Folder selected
        </h1>
        <main className="flex flex-col gap-3">
          <FolderSelector selectedFolder={userConfiguration?.selectedFolder} onFolderSelected={onFolderSelected} />
        </main>
      </section>
    </div>
  );
};

export default ConfigurationPanel;
