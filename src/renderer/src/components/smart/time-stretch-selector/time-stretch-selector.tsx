import { TIME_STRETCHS, TimeStretch } from '@renderer/models/userConfiguration';
import storeService from '@renderer/service/store-service';
import React, { useEffect } from 'react';
import { Check, PencilFill } from 'react-bootstrap-icons';

interface TimeStretchSelectorProps {
  selectedTimeStretch?: TimeStretch;
  onSelectTimeStretch?: (timeStretch: TimeStretch) => void;
}

const TimeStretchSelector: React.FC<TimeStretchSelectorProps> = ({
  selectedTimeStretch,
  onSelectTimeStretch,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const timeStretchs = TIME_STRETCHS;

  // Customable time stretch state
  const recoverInitialCustomTimeStretch = async () => {
    const customTimeStretch = await storeService.getCustomTimeStretch();
    setCustomTimeStretch(customTimeStretch);
  };
  const [customTimeStretch, setCustomTimeStretch] = React.useState<TimeStretch>();
  useEffect(() => {
    recoverInitialCustomTimeStretch();
  }, []);

  const [customTimeStretchEditMode, setCustomTimeStretchEditMode] = React.useState(false);
  const onChangeCustomTIme = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!customTimeStretch) return;

    const newDuration = parseFloat(e.target.value) * 60; // Convert minutes to seconds
    const updatedCustomTimeStretch = {
      ...customTimeStretch,
      duration: newDuration,
    };
    setCustomTimeStretch(updatedCustomTimeStretch);
    onSelectTimeStretch?.(updatedCustomTimeStretch);
    updateStoredCustomTimeStretch(updatedCustomTimeStretch);
  };

  const updateStoredCustomTimeStretch = async (customTimeStretch: TimeStretch): Promise<void> => {
    await storeService.setCustomTimeStretch(customTimeStretch);
  };

  const onChangeTimeStretch = (timeStretch: TimeStretch): void => {
    setCustomTimeStretchEditMode(false);
    onSelectTimeStretch?.(timeStretch);
  };

  const onChangeToEditMode = (): void => {
    setCustomTimeStretchEditMode(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 100);
  };

  const onKeyDownCustomTime = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      setCustomTimeStretchEditMode(false);
    }
  };

  const onFocusCustomTime = (e: React.FocusEvent<HTMLInputElement>): void => {
    e.target.select();
  };

  return (
    <ul className="flex flex-col gap-1">
      {timeStretchs.map((timeStretch) => (
        <li key={timeStretch.id}>
          <button
            key={timeStretch.id}
            className={`flex h-10 w-full items-center justify-center rounded-md border px-4 text-sm font-medium shadow-sm transition-colors duration-200 ease-in-out ${
              selectedTimeStretch?.id === timeStretch.id
                ? 'border-gray-300 bg-gray-300 text-gray-900'
                : 'cursor-pointer border-gray-300/20 bg-gray-900 text-gray-300 hover:bg-gray-700 hover:text-gray-100'
            }`}
            onClick={() => onChangeTimeStretch(timeStretch)}
          >
            {timeStretch.label}
          </button>
        </li>
      ))}
      {customTimeStretch && (
        <li>
          <div
            className={`flex h-10 w-full items-center justify-center rounded-md border text-sm font-medium shadow-sm transition-colors duration-200 ease-in-out ${
              selectedTimeStretch?.id === customTimeStretch.id
                ? 'border-gray-300 bg-gray-300 text-gray-900'
                : 'cursor-pointer border-gray-300/20 bg-gray-900 text-gray-300 hover:bg-gray-700 hover:text-gray-100'
            }`}
          >
            {customTimeStretchEditMode ? (
              <div className="relative flex h-full w-full items-center justify-center gap-2 bg-white">
                <span>Custom time:</span>
                <input
                  ref={inputRef}
                  className="h-[90%] w-[3rem] border border-gray-300 bg-gray-200 px-2 text-inherit outline-none"
                  type="text"
                  value={customTimeStretch.duration / 60}
                  onChange={onChangeCustomTIme}
                  onKeyDownCapture={onKeyDownCustomTime}
                  onFocus={onFocusCustomTime}
                />
                <span>(min)</span>

                <button
                  type="button"
                  className="absolute top-0 right-0 z-10 flex h-full w-10 cursor-pointer items-center justify-center text-gray-900 opacity-50 duration-200 ease-in-out hover:opacity-100"
                  onClick={() => setCustomTimeStretchEditMode(false)}
                >
                  <Check />
                </button>
              </div>
            ) : (
              <div className="relative flex h-full w-full items-center justify-center">
                <button
                  className="w-full cursor-pointer"
                  type="button"
                  onClick={() => onChangeTimeStretch(customTimeStretch)}
                >
                  Custom time {customTimeStretch.duration / 60} min
                </button>
                <button
                  type="button"
                  className="absolute top-0 right-0 z-10 flex h-full w-10 cursor-pointer items-center justify-center opacity-50 duration-200 ease-in-out hover:opacity-100"
                  onClick={onChangeToEditMode}
                >
                  <PencilFill />
                </button>
              </div>
            )}
          </div>
        </li>
      )}
    </ul>
  );
};

export default TimeStretchSelector;
