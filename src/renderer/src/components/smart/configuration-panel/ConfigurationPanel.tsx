import React from 'react';
import FolderSelector from '../folder-selector/FolderSelector';
import { PRELOADED_SESSIONs, Session } from '@renderer/models/session';
import { TimeStretch, UserConfiguration } from '@renderer/models/userConfiguration';
import { X } from 'react-bootstrap-icons';
import CreatableSelectField from '../creatable-select-field/creatable-select-field';
import TimeStretchSelector from '../time-stretch-selector/time-stretch-selector';

interface ConfigurationPanelProps {
  userConfiguration: UserConfiguration;
  onChange?: (userConfiguration: UserConfiguration) => void;
  onClose?: () => void;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  userConfiguration,
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

  const onChangeTimeStretch = (timeStretch: TimeStretch): void => {
    const newConfiguration: UserConfiguration = {
      ...userConfiguration,
      timeStretchSelected: timeStretch,
      sessionSelected: undefined,
    };
    onChange?.(newConfiguration);
  };

  const onChangeSession = (session: Session): void => {
    const newConfiguration: UserConfiguration = {
      ...userConfiguration,
      sessionSelected: session,
      timeStretchSelected: undefined,
    };
    onChange?.(newConfiguration);
  };

  const sessionOptions = PRELOADED_SESSIONs.map((session) => ({
    label: session.sequenceName || `Session (${session.totalDuration} seconds)`,
    value: session,
  }));

  return (
    <div className="items-enter flex h-full w-full flex-col gap-10 overflow-y-auto rounded-md bg-gray-800 p-3 shadow">
      <section>
        <header className="mb-3 flex w-full items-center justify-between border-b border-dotted border-gray-300/40 pb-2 font-semibold">
          <h1 className="color-white text-gray-100">Time stretch</h1>
          <button type="button" className="cursor-pointer" onClick={onClose}>
            <X className="h-8 w-8 text-white/50" />
          </button>
        </header>
        <main className="flex flex-col gap-3">
          <TimeStretchSelector
            selectedTimeStretch={userConfiguration.timeStretchSelected}
            onSelectTimeStretch={onChangeTimeStretch}
          />
          <CreatableSelectField
            label="Or select a session"
            labelClassName="text-gray-100 text-sm"
            options={sessionOptions}
            selectedOption={
              userConfiguration?.sessionSelected
                ? {
                    label:
                      userConfiguration.sessionSelected.sequenceName ||
                      `Session (${userConfiguration.sessionSelected.totalDuration} seconds)`,
                    value: userConfiguration.sessionSelected,
                  }
                : undefined
            }
            onChange={(option) => {
              onChangeSession(option?.value as Session);
            }}
            isClearable={false}
            placeholder="Select session..."
          />
        </main>
      </section>
      <section>
        <h1 className="color-white mb-3 border-b border-dotted border-gray-300/40 pb-2 font-semibold text-gray-100">
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
