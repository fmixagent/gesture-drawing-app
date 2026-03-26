import React from 'react';

interface TextFieldProps {
  id: string;
  className?: string;
  type?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const TextField: React.FC<TextFieldProps> = ({
  id,
  className,
  type = 'text',
  label,
  value,
  onChange,
}) => {
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`flex w-full flex-col gap-1 ${className}`}>
      <label className="font-bold" htmlFor={id}>
        {label}
      </label>
      <input
        className="bg-gray-200 px-3 py-2 text-base"
        id={id}
        type={type}
        value={value}
        onChange={onChangeHandler}
      />
    </div>
  );
};

export default TextField;
