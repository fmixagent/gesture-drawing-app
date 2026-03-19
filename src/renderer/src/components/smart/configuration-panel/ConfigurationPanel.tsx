import React from 'react';
import FolderSelector from '../folder-selector/FolderSelector';
import ListSelector, { ListItem } from '../list-selector/list-selector';
import { PRELOADED_SESSIONs, Session } from '@renderer/models/session';
import { TimeStretch, UserConfiguration } from '@renderer/models/userConfiguration';
import { X } from 'react-bootstrap-icons';

interface ConfigurationPanelProps {
  userConfiguration: UserConfiguration;
  timeStrechs: TimeStretch[];
  onChange?: (userConfiguration: UserConfiguration) => void;
  onClose?: () => void;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  userConfiguration,
  timeStrechs,
  onChange,
  onClose,
}) => {
  const onFolderSelected = (folderPath: string): void => {
    // Here you can handle the folder selection, e.g., save it to the userConfiguration
    const newConfiguration: UserConfiguration = {
      ...userConfiguration,
      selectedFolder: folderPath,
    };
    onChange?.(newConfiguration);
  };

  const onChangeTimeStretch = (timeStretchId: string): void => {
    const findTimeStretch = timeStrechs.find((ts) => ts.id === timeStretchId);
    if (!findTimeStretch) return;
    const newConfiguration: UserConfiguration = {
      ...userConfiguration,
      timeStretchSelected: findTimeStretch,
      sessionSelected: undefined,
    };
    onChange?.(newConfiguration);
  };

  const sessionItems: ListItem<Session>[] = PRELOADED_SESSIONs.map((session) => ({
    id: session.sequenceName || 'session-' + session.totalDuration,
    name: session.sequenceName || `Session (${session.totalDuration} seconds)`,
    value: session,
  }));
  const selectedSessionItem = sessionItems.find((sessionItem) => sessionItem.value.sequenceName === userConfiguration?.sessionSelected?.sequenceName);

  const onChangeSession = (session: Session): void => {
    const newConfiguration: UserConfiguration = {
      ...userConfiguration,
      sessionSelected: session,
      timeStretchSelected: undefined,
    };
    onChange?.(newConfiguration);
  }

  return (
    <div className="flex w-full h-full flex-col gap-10 items-enter bg-gray-900  p-3 rounded-md shadow overflow-y-auto">
      <section>
        <header className="w-full flex justify-between items-center border-b border-dotted border-gray-300/40 pb-2 mb-3 font-semibold">
          <h1 className="color-white text-gray-100 ">Time stretch</h1>
          <button type="button" className="cursor-pointer" onClick={onClose}>
            <X className="text-white/50 w-8 h-8" />
          </button>
        </header>
        <main className="flex flex-col gap-3">
          {timeStrechs.map((timeStretch) => (
            <button
              key={timeStretch.id}
              className={`flex w-full justify-center items-center rounded-md border border-transparent px-4 h-10 text-sm font-medium shadow-sm transition-colors duration-200 ease-in-out ${
                userConfiguration?.timeStretchSelected?.id === timeStretch.id
                  ? 'bg-gray-300 text-gray-900 '
                  : 'cursor-pointer bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gray-100'
              }`}
              onClick={() => onChangeTimeStretch(timeStretch.id)}
            >
              {timeStretch.label}
            </button>
          ))}
          <h2 className="color-white text-gray-100 mt-3 pb-2 mb-3 font-normal">or use a session</h2>
          <ListSelector selectedItem={selectedSessionItem} items={sessionItems} onChange={onChangeSession}/>
        </main>
      </section>
      <section>
        <h1 className="color-white text-gray-100 border-b border-dotted border-gray-300/40 pb-2 mb-3 font-semibold">
          Folder selected
        </h1>
        <main className="flex flex-col gap-3">
          <FolderSelector
            selectedFolder={userConfiguration?.selectedFolder}
            onFolderSelected={onFolderSelected}
          />
        </main>
      </section>
    </div>
  );
};

export default ConfigurationPanel;
