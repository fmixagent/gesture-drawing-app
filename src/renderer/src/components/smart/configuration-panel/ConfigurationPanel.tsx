import { Configuration, TimeStretch } from '@renderer/models/configurtion';
import React from 'react';

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

  return (
    <section className="flex w-[10rem] h-full flex-col items-enter gap-2 bg-black/50  p-3 rounded-md">
      <h1 className="color-white text-gray-100 border-b border-dotted border-gray-300/40 pb-2 mb-3 font-semibold">
        Time stretch
      </h1>
      <div className="flex flex-col gap-3">
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
      </div>
    </section>
  );
};

export default ConfigurationPanel;
