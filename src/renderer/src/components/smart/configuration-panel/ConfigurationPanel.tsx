import React from 'react';
import FolderSelector from '../folder-selector/FolderSelector';
import { TimeStretch, UserConfiguration } from '@renderer/models/userConfiguration';
import TimeStretchSelector from '../time-stretch-selector/time-stretch-selector';
import { X } from 'react-bootstrap-icons';
import SessionSelectionAndManagement from '../session-selection-and-management/SessionSelectionAndManagement';
import BucketSelectionAndManagement from '../bucket-selection-and-management/BucketSelectionAndManagement';

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
      folderSelected: folderPath,
      bucketSelected: undefined,
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

  return (
    <>
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
            <SessionSelectionAndManagement
              userConfiguration={userConfiguration}
              onChange={onChange}
            />
          </main>
        </section>
        <section className="flex flex-col gap-3">
          <h1 className="color-white border-b border-dotted border-gray-300/40 pb-2 font-semibold text-gray-100">
            Folder selected
          </h1>
          <FolderSelector
            folder={userConfiguration?.folderSelected}
            onFolderSelected={onFolderSelected}
          />
          <BucketSelectionAndManagement userConfiguration={userConfiguration} onChange={onChange} />
        </section>
      </div>
    </>
  );
};

export default ConfigurationPanel;
