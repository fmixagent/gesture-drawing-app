import React from 'react';
import { X } from 'react-bootstrap-icons';
interface ModalLayoutProps {
  modalTitle?: string;
  children?: React.ReactNode;
  onClose?: () => void;
}

const ModalLayout: React.FC<ModalLayoutProps> = ({ modalTitle, children, onClose }) => {
  return (
    <div className="absolute top-0 left-0 z-50 h-dvh w-dvw">
      <div className="absolute z-10 flex h-full w-full items-center justify-center">
        <section className="h-[80%] w-[80%] overflow-hidden rounded-md bg-white px-5 pb-5 shadow">
          <div className="flex h-full w-full flex-col">
            <header className="flex h-10 w-full flex-none items-center justify-between border-b border-gray-300/70">
              <h1 className="font-bold">{modalTitle}</h1>
              <button type="button" className="cursor-pointer" onClick={onClose}>
                <X className="h-8 w-8 text-gray-500" />
              </button>
            </header>
            <div className="flex h-full w-full overflow-hidden">{children}</div>
          </div>
        </section>
      </div>
      <div className="h-full w-full bg-black/70"></div>
    </div>
  );
};

export default ModalLayout;
