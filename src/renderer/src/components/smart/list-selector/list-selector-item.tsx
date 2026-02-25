import React from 'react';

type ListSelectorItemProps = {
  label: string;
  onClick?: () => void;
};

const ListSelectorItem: React.FC<ListSelectorItemProps> = ({ label, onClick }) => {
  return (
    <div
      className="flex h-10 cursor-pointer items-center justify-start whitespace-nowrap border-t border-dotted border-gray-400 px-3 duration-300 ease-out"
      onClick={onClick}
    >
      <div className="mr-2 inline-block">{label}</div>
    </div>
  );
};

export default ListSelectorItem;
