import React, { memo } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
  label?: string;
  onClick?: () => void;
  isDisabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  icon,
  label,
  onClick,
  isDisabled,
}) => {
  const buttonBaseClasses =
    'flex h-10 px-4 cursor-pointer items-center justify-center rounded-md text-[1rem] transition-all duration-200 ease-in-out';

  const buttonVariantClasses =
    variant === 'primary'
      ? 'bg-gray-900 text-gray-50 hover:bg-gray-700'
      : 'bg-gray-300 text-gray-800 hover:bg-gray-200 hover:text-gray-900';

  const disabledClasses = isDisabled ? 'opacity-50 cursor-not-allowed' : '';

  const buttonClasses = `${buttonBaseClasses} ${buttonVariantClasses} ${disabledClasses}`;

  return (
    <button type="button" onClick={onClick} className={buttonClasses}>
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export default memo(Button);
