import React, { useEffect, useState } from 'react';
import FolderSelector from '../folder-selector/FolderSelector';
import { TimeStretch, UserConfiguration } from '@renderer/models/userConfiguration';
import { ChevronRight, PlusCircleFill, TrashFill, X } from 'react-bootstrap-icons';
import CreatableSelectField from '../creatable-select-field/creatable-select-field';
import TimeStretchSelector from '../time-stretch-selector/time-stretch-selector';
import { createPortal } from 'react-dom';
import ModalLayout from '@renderer/components/layout/modal/ModalLayout';
import TextField from '../text-field/text-field';
import Button from '@renderer/components/ui/button/Button';
import { useAppContext } from '@renderer/context-providers/app-context';
import { getSessionNameFromSession, Session } from '@renderer/models/session';

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
  const { sessions, saveSession, deleteSession } = useAppContext();
  const [sessionOptions, setSessionOptions] = useState<{ label: string; value: Session }[]>([]);

  useEffect(() => {
    const removableSessions = sessions.filter((session) => session.isRemovable);
    const nonRemovableSessions = sessions.filter((session) => !session.isRemovable);
    const sortedRemovableSessions = removableSessions.sort((a, b) =>
      a.totalDuration > b.totalDuration ? 1 : -1
    );
    const sortedNonRemovableSessions = nonRemovableSessions.sort((a, b) =>
      a.totalDuration > b.totalDuration ? 1 : -1
    );
    const sortedSessions = [...sortedNonRemovableSessions, ...sortedRemovableSessions];

    const options = sortedSessions.map((session) => ({
      label: getSessionNameFromSession(session),
      value: session,
    }));
    setSessionOptions(options);
  }, [sessions]);

  const onFolderSelected = (folderPath: string): void => {
    // Here you can handle the folder selection, e.g., save it to the userConfiguration
    const newConfiguration: UserConfiguration = {
      ...userConfiguration,
      folderSelected: folderPath,
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

  const [editingSession, setEditingSession] = React.useState<Session | null>(null);
  const onCreateNewSession = (sessionName: string): void => {
    const newSession: Session = {
      sequenceName: sessionName,
      totalDuration: 0,
      sequence: [],
      isRemovable: true,
    };
    setEditingSession(newSession);
  };

  const onDeleteSession = (session: Session): void => {
    console.log('Attempting to delete session: ', session);
    if (!session.isRemovable) return;
    console.log('Deleting session: ', session);
    deleteSession(session);
    setEditingSession(null);

    if (userConfiguration.sessionSelected?.sequenceName === session.sequenceName) {
      const newConfiguration: UserConfiguration = {
        ...userConfiguration,
        sessionSelected: undefined,
      };
      onChange?.(newConfiguration);
    }
  };

  const onChangeEditingSessionProperty = (property: string, value: any): void => {
    if (!editingSession) return;

    const updatedSession = {
      ...editingSession,
      [property]: value,
    };
    setEditingSession(updatedSession);
  };

  const onCloseEditingSession = (): void => {
    // TODO: confirm modal?
    setEditingSession(null);
  };

  const onSaveEditingSession = (): void => {
    if (!editingSession) return;

    saveSession(editingSession);
    onChangeSession(editingSession);
    setEditingSession(null);
  };

  const [stretchDurationInput, setStretchDurationInput] = React.useState('');
  const onChangeStretchDurationInput = (value: string): void => {
    setStretchDurationInput(value);
  };

  const onAddTimeStretchToSequence = (): void => {
    if (!editingSession || !stretchDurationInput) return;

    const stretchDurationInSeconds = parseFloat(stretchDurationInput) * 60;
    const newStretch: TimeStretch = {
      id: `${editingSession.sequence.length + 1}`,
      label: `${stretchDurationInput} min`,
      duration: stretchDurationInSeconds,
    };

    const updatedSequence = [...editingSession.sequence, newStretch];
    const updatedTotalDuration = updatedSequence.reduce(
      (total, stretch) => total + stretch.duration,
      0
    );

    const updatedSession = {
      ...editingSession,
      sequence: updatedSequence,
      totalDuration: updatedTotalDuration,
    };

    setEditingSession(updatedSession);
    // setStretchDurationInput('');
  };

  const onRemoveTImeStretchFromSequence = (stretchId: string): void => {
    if (!editingSession) return;

    const updatedSequence = editingSession.sequence.filter((stretch) => stretch.id !== stretchId);
    const updatedTotalDuration = updatedSequence.reduce(
      (total, stretch) => total + stretch.duration,
      0
    );
    // Reorder ids
    const reorderedSequence = updatedSequence.map((stretch, index) => ({
      ...stretch,
      id: `${index + 1}`,
    }));

    const updatedSession = {
      ...editingSession,
      sequence: reorderedSequence,
      totalDuration: updatedTotalDuration,
    };

    setEditingSession(updatedSession);
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
            <CreatableSelectField
              label="Or select a session"
              labelClassName="text-gray-100 text-sm"
              options={sessionOptions}
              selectedOption={
                userConfiguration?.sessionSelected
                  ? {
                      label: getSessionNameFromSession(userConfiguration?.sessionSelected),
                      value: userConfiguration.sessionSelected,
                    }
                  : undefined
              }
              onChange={(option) => {
                onChangeSession(option?.value as Session);
              }}
              isClearable={false}
              placeholder="Select session..."
              hasDeleteOptionFeature={true}
              onCreateNewOption={onCreateNewSession}
              onOptionDelete={(option) => onDeleteSession(option?.value as Session)}
            />
            {userConfiguration.sessionSelected && (
              <ul className="flex flex-wrap items-center justify-start">
                {userConfiguration.sessionSelected.sequence.map((stretch, index) => (
                  <li className="group flex items-center justify-start pb-3" key={index}>
                    <div className="truncate rounded-md border border-gray-300/20 px-3 py-2 text-gray-400">
                      {stretch.label}
                    </div>
                    <div className="px-2 group-last:hidden">
                      <ChevronRight className="text-gray-300" />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </main>
        </section>
        <section>
          <h1 className="color-white mb-3 border-b border-dotted border-gray-300/40 pb-2 font-semibold text-gray-100">
            Folder selected
          </h1>
          <main className="flex flex-col gap-3">
            <FolderSelector
              folder={userConfiguration?.folderSelected}
              onFolderSelected={onFolderSelected}
            />
          </main>
        </section>
      </div>

      {/* Session modal */}
      {editingSession &&
        createPortal(
          <ModalLayout
            modalTitle={`New session (${editingSession.totalDuration ? editingSession.totalDuration / 60 : 0} min)`}
            onClose={onCloseEditingSession}
          >
            <section className="flex w-full flex-1 flex-col overflow-hidden">
              <main className="flex h-full flex-col justify-between overflow-hidden">
                <div className="flex flex-none py-3">
                  <TextField
                    id="sessionName"
                    label="Session name"
                    value={editingSession?.sequenceName ?? ''}
                    onChange={(value) => onChangeEditingSessionProperty('sequenceName', value)}
                  />
                </div>
                <h1 className="font-bold">Add stretches</h1>
                <div className="flex flex-1 flex-col gap-3 overflow-hidden py-3 pl-2">
                  {/* Add stretch */}
                  <section className="flex-none">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex w-full rounded-md border border-gray-300 bg-gray-50 p-3">
                        <TextField
                          id="stretchDuration"
                          type="number"
                          label="Stretch duration in minutes"
                          value={stretchDurationInput}
                          onChange={onChangeStretchDurationInput}
                        />
                      </div>
                      <button
                        className={`ml-auto flex flex-none cursor-pointer transition-opacity ease-in-out hover:opacity-100 ${!stretchDurationInput ? 'pointer-events-none opacity-20' : 'opacity-70'}`}
                        type="button"
                        onClick={onAddTimeStretchToSequence}
                      >
                        <PlusCircleFill className="h-8 w-8" />
                      </button>
                    </div>
                  </section>
                  {/* Stretch list */}
                  <section className="flex flex-1 flex-col overflow-hidden">
                    <div className="flex w-full flex-1 flex-col overflow-y-auto rounded-md border border-gray-300 bg-gray-200 p-3">
                      {editingSession.sequence.length === 0 ? (
                        <div className="flex h-full w-full flex-col items-center justify-center">
                          <span className="font-bold">No stretches in this session</span>
                          <i>Add some time stretches...</i>
                        </div>
                      ) : (
                        <ul className="flex flex-col gap-3">
                          {editingSession.sequence.map((stretch, index) => (
                            <li
                              key={index}
                              className="flex items-center justify-between bg-white px-2 py-2 last:border-none"
                            >
                              <span>{stretch.duration / 60} min</span>
                              <button
                                className={`ml-auto flex flex-none cursor-pointer opacity-50 transition-opacity duration-200 ease-in-out hover:opacity-100`}
                                type="button"
                                onClick={() => onRemoveTImeStretchFromSequence(stretch.id)}
                              >
                                <TrashFill className="h-5 w-5 text-red-600" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </section>
                </div>
              </main>
              <footer className="border-t border-gray-400 pt-5">
                <ul className="flex items-center justify-end gap-3">
                  <li>
                    <Button
                      label="Cancel"
                      variant="secondary"
                      onClick={onCloseEditingSession}
                    ></Button>
                  </li>
                  <li>
                    <Button label="Save" onClick={onSaveEditingSession}></Button>
                  </li>
                </ul>
              </footer>
            </section>
          </ModalLayout>,
          document.body
        )}
    </>
  );
};

export default ConfigurationPanel;
