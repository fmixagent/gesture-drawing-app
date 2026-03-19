import { JSX, useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'react-bootstrap-icons';
import ListSelectorItem from './list-selector-item';

export interface ListItem<T> {
  id: string;
  name: string;
  value: T;
}

type ListSelectorProps<T extends object> = {
  id?: string;
  items: ListItem<T>[];
  selectedItem?: ListItem<T>;
  tabIndex?: number;
  label?: string;
  placeholder?: string;
  className?: string;
  flexDirection?: 'row' | 'column';
  isReadOnly?: boolean;
  onChange?: (value: T) => void;
};

const ListSelector = <T extends object>({
  id,
  items = [],
  selectedItem,
  tabIndex = -1,
  label,
  placeholder = 'Select...',
  className,
  flexDirection = 'column',
  isReadOnly = false,
  onChange,
}: ListSelectorProps<T>): JSX.Element => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);


  const toggleCollapse = (): void => {
    setIsCollapsed(!isCollapsed);
  };

  const clickItemHandler = (item: ListItem<T>): void => {
    setIsCollapsed(true);
    onChange?.(item.value);
  };

  return (
    <div
      className={`flex w-full ${flexDirection === 'row' ? 'flex flex-row items-center justify-start' : 'flex-col'} ${className}`}
    >
      {label && (
        <label
          className={`text-md relative mb-1 flex w-full flex-row items-center justify-start truncate pr-3 font-semibold ${isReadOnly ? 'text-gray-400' : 'text-gray-900'}`}
          htmlFor={id}
        >
          <span className="capitalize-first">{label}</span>
        </label>
      )}
      <div
        className={`relative overflow-visible bg-gray-800 text-sm text-gray-700 ${flexDirection === 'row' ? 'h-10' : ''}`}
      >
        <div
          onClick={() => !isReadOnly && toggleCollapse()}
          className={`rounded-md  flex h-10 items-center justify-between cursor-pointer  ${flexDirection === 'row' ? 'h-6 rounded-full' : ''} ${selectedItem ? 'bg-gray-300 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gray-100'}`}
          tabIndex={tabIndex}
        >
          <div className="px-3 capitalize-first">
            {selectedItem ? selectedItem.name : placeholder}
          </div>
          {!isReadOnly && (
            <div className="ml-3 pr-2">{isCollapsed ? <ChevronDown /> : <ChevronUp />}</div>
          )}
        </div>
        <div
          className={`absolute right-0 top-full z-10 m-0 min-w-full p-0 drop-shadow transition duration-300 ease-out ${
            isCollapsed
              ? 'pointer-events-none opacity-0'
              : 'pointer-events-auto opacity-100'
          }`}
        >
          <ul className="flex max-h-[400px] flex-col overflow-y-auto bg-gray-100 text-gray-700">
            {items.map((item, index) => (
              <li className='bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gray-100' key={item.name + '-' + index}>
                <ListSelectorItem
                  label={item.name}
                  onClick={() => !isReadOnly && clickItemHandler(item)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ListSelector;
