import { Configuration, TIME_STRETCHS } from '@renderer/models/configurtion';
import React from 'react';

interface ConfigurationPanelProps {
  configuration?: Configuration;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ configuration }) => {
  return (
    <section className="flex flex-column items-enter gap-2">
      <h1>Time stretch</h1>
      {TIME_STRETCHS.map((timeStretch) => (
        <button
          key={timeStretch.id}
          className={`flex-1 rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors duration-200 ease-in-out ${
            configuration?.timeStretchSelected?.id === timeStretch.id
              ? 'bg-orange-500 text-white hover:bg-orange-600'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => {
            if (configuration) {
              configuration.timeStretchSelected = timeStretch;
            }
          }}
        >
          {timeStretch.label}
        </button>
      ))}
    </section>
  );
};

export default ConfigurationPanel;
