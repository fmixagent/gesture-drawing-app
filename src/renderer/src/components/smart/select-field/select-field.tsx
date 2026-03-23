import { TrashFill, XLg } from 'react-bootstrap-icons';
import ReactSelect, { components, CSSObjectWithLabel, SingleValue } from 'react-select';

export type SelectFieldOption<T> = {
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
  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Delete clicked for: ', props.selectProps);
    props.selectProps.onOptionDelete?.(props.data.value);
  };

  return (
    <components.Option {...props}>
      <div className="flex items-center justify-between">
        <div>{props.children}</div>
        <button
          type="button"
          onClick={handleDeleteClick}
          className="rounded text-red-500/50 transition-all duration-200 ease-in-out hover:text-red-500 focus:outline-none"
        >
          <TrashFill className="h-5 w-5" />
        </button>
      </div>
    </components.Option>
  );
};

type SelectFieldProps<T> = {
  id?: string;
  label?: string;
  labelElement?: React.ReactNode;
  options?: SelectFieldOption<T>[];
  className?: string;
  flex?: 'row' | 'column';
  size?: 'small' | 'medium' | 'large';
  selectedOption?: SelectFieldOption<T> | null;
  onChange?: (value: SingleValue<SelectFieldOption<T>>) => void;
  isClearable?: boolean;
  placeholder?: string;
  isMandatory?: boolean;
  isDisabled?: boolean;
  noOptionsMessage?: string;
  hasDeleteOptionFeature?: boolean;
  onOptionDelete?: (value: SingleValue<SelectFieldOption<T>>) => void;
};

export const SelectField = <T extends any>({
  id,
  label,
  labelElement,
  options = [],
  className,
  flex = 'column',
  size = 'medium',
  selectedOption,
  onChange,
  isClearable = true,
  placeholder = '...',
  isMandatory = false,
  isDisabled = false,
  noOptionsMessage = 'No options',
  hasDeleteOptionFeature = false,
  onOptionDelete,
}: SelectFieldProps<T>) => {
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
        <label className="capitalize-firstt mb-2 w-full truncate font-medium" htmlFor="selectType">
          {label}
          {isMandatory ? '*' : ''}
        </label>
      ) : null}
      <div>
        <ReactSelect
          inputId={id ?? `${label}_select`}
          className="h-full w-full rounded-md border border-solid border-[#ababab]/50"
          styles={{
            control: (baseStyles, state) =>
              ({
                ...baseStyles,
                background: '#f1f1f1',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: options?.length > 0 ? 'pointer' : 'default',
              } as CSSObjectWithLabel),
            menu: (base) => ({ ...base, zIndex: 100 } as CSSObjectWithLabel),
          }}
          options={options}
          value={selectedOption ?? null}
          onChange={onChange}
          isMulti={false}
          isClearable={isClearable}
          components={{
            ClearIndicator: CustomClearIndicator,
            Option: hasDeleteOptionFeature ? OptionWithDelete : components.Option,
          }}
          tabIndex={1}
          placeholder={placeholder}
          isDisabled={isDisabled}
          noOptionsMessage={() => noOptionsMessage}
          {...(hasDeleteOptionFeature && { onOptionDelete })}
        />
      </div>
    </div>
  );
};

export default SelectField;
