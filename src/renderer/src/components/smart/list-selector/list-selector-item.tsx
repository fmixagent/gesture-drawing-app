import React from 'react';

type ListSelectorItemProps = {
  label: string;
  onClick?: () => void;
};

const ListSelectorItem: React.FC<ListSelectorItemProps> = ({ label, onClick }) => {
  return (
    <div
      className="flex h-10 cursor-pointer items-center justify-start whitespace-nowrap border-t border-solid border-gray-400/30 px-3 duration-300 ease-out"
      onClick={onClick}
    >
      <div>{label}</div>
    </div>
  );
};

export default ListSelectorItem;
