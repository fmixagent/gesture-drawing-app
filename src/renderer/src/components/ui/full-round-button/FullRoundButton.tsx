import React from 'react';

interface FullRoundButtonProps {
  icon?: React.ReactNode;
  onClick?: () => void;
}

const FullRoundButton: React.FC<FullRoundButtonProps> = ({ icon, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer w-10 h-10 flex justify-center text-[1rem] text-gray-200 items-center bg-gray-800 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-all duration-200 ease-in-out"
    >
      {icon}
    </button>
  );
};

export default FullRoundButton;
