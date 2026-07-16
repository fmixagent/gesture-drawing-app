import { useState } from 'react';
import { PencilFill, TrashFill, XLg } from 'react-bootstrap-icons';
import { ActionMeta, components, CSSObjectWithLabel, SingleValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';

interface BaseValue {
  isRemovable?: boolean;
}
export type SelectFieldOption<T extends BaseValue> = {
  label: string;
  value: T;
};

const CustomClearIndicator = (props: any) => {
  return (
    <components.ClearIndicator {...props}>
      <XLg className="cursor-pointer" />
    </components.ClearIndicator>
  );
};

const OptionWithDelete = (props: any) => {
  const isRemovable = props.data.value.isRemovable ?? false;
  const isEditable = props.data.value.isEditable ?? false;

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    props.selectProps.onOptionDelete?.(props.data);
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    props.selectProps.onOptionEdit?.(props.data);
  };

  return (
    <components.Option {...props}>
      <div className="m-0 flex items-center justify-between gap-2 p-0">
        <div className="mr-auto">{props.children}</div>
        {isEditable && (
          <button
            type="button"
            onClick={handleEditClick}
            className="cursor-pointer rounded text-gray-500/50 transition-all duration-200 ease-in-out hover:text-gray-500 focus:outline-none"
          >
            <PencilFill className="h-5 w-5" />
          </button>
        )}
        {isRemovable && (
          <button
            type="button"
            onClick={handleDeleteClick}
            className="cursor-pointer rounded text-red-500/50 transition-all duration-200 ease-in-out hover:text-red-500 focus:outline-none"
          >
            <TrashFill className="h-5 w-5" />
          </button>
        )}
      </div>
    </components.Option>
  );
};

type SelectFieldProps<T extends BaseValue> = {
  id?: string;
  label?: string;
  labelElement?: React.ReactNode;
  options?: SelectFieldOption<T>[];
  className?: string;
  labelClassName?: string;
  flex?: 'row' | 'column';
  size?: 'small' | 'medium' | 'large';
  selectedOption?: SelectFieldOption<T> | null;
  onChange?: (
    value: SingleValue<SelectFieldOption<T>>,
    actionMeta: ActionMeta<SelectFieldOption<T>>
  ) => void;
  isClearable?: boolean;
  placeholder?: string;
  isMandatory?: boolean;
  isDisabled?: boolean;
  noOptionsMessage?: string;
  onOptionDelete?: (value: SingleValue<SelectFieldOption<T>>) => void;
  onOptionEdit?: (value: SingleValue<SelectFieldOption<T>>) => void;
  onCreateNewOption?: (optionName: string) => void;
  autoUppercaseOnInput?: boolean;
  createNewOptionLabel?: string;
};

export const CreatableSelectField = <T extends BaseValue>({
  id,
  label,
  labelElement,
  options = [],
  className,
  labelClassName,
  flex = 'column',
  size = 'medium',
  selectedOption,
  onChange,
  isClearable = true,
  placeholder = '...',
  isMandatory = false,
  isDisabled = false,
  noOptionsMessage = 'No options',
  onOptionDelete,
  onOptionEdit,
  onCreateNewOption,
  autoUppercaseOnInput = false,
  createNewOptionLabel = 'Create new option',
}: SelectFieldProps<T>) => {
  const onCreateOption = (inputValue: string) => {
    if (!inputValue) return;
    onCreateNewOption?.(inputValue);
  };

  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (newValue: string) => {
    setInputValue(autoUppercaseOnInput ? newValue.toUpperCase() : newValue);
  };

  return (
    <div
      className={[
        'w-full',
        className,
        flex === 'row' ? 'flex' : '',
        flex === 'column' ? 'flex flex-col' : '',
        size === 'small' ? '' : '',
        size === 'medium' ? '' : '',
        size === 'large' ? '' : '',
      ].join(' ')}
    >
      {labelElement ? (
        labelElement
      ) : label ? (
        <label
          className={`capitalize-first mb-2 w-full truncate font-medium ${labelClassName}`}
          htmlFor="selectType"
        >
          {label}
          {isMandatory ? '*' : ''}
        </label>
      ) : null}
      <div>
        <CreatableSelect
          inputId={id ?? `${label}_select`}
          className="h-full w-full rounded-md border border-solid text-sm"
          styles={{
            control: (baseStyles, _state) =>
              ({
                ...baseStyles,
                background: selectedOption || inputValue ? '#d1d5dc' : '#1e2939',
                color: selectedOption || inputValue ? '#101828' : '#d2d5dc',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: options?.length > 0 ? 'pointer' : 'default',
              }) as CSSObjectWithLabel,
            menu: (base) => ({ ...base, zIndex: 100 }) as CSSObjectWithLabel,
          }}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          options={options}
          value={selectedOption ?? null}
          onChange={onChange}
          isMulti={false}
          isClearable={isClearable}
          components={{
            ClearIndicator: CustomClearIndicator,
            Option: OptionWithDelete,
          }}
          tabIndex={1}
          placeholder={placeholder}
          isDisabled={isDisabled}
          noOptionsMessage={() => noOptionsMessage}
          {...{ onOptionDelete, onOptionEdit }}
          onCreateOption={onCreateOption}
          formatCreateLabel={(inputValue) => `${createNewOptionLabel}: "${inputValue}"`}
        />
      </div>
    </div>
  );
};

export default CreatableSelectField;
