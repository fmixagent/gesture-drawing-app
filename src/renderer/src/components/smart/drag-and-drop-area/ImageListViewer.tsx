import React from 'react';
import { FileImage, Trash2Fill } from 'react-bootstrap-icons';
import { Image } from './DragAndDropArea';

interface DragAndDropAreaProps {
  images: Image[];
  onRemoveImage?: (imageFile: Image) => void;
}

const ImageListViewer: React.FC<DragAndDropAreaProps> = ({ images = [], onRemoveImage }) => {
  return (
    <div className="flex h-full w-full items-start justify-start gap-3 overflow-x-auto border-t border-gray-100 p-3">
      {images.length > 0 ? (
        images.map((image) => (
          <div
            key={image.name}
            className="relative flex w-52 flex-col items-center border border-gray-200 bg-white p-2 shadow-sm"
          >
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-gray-800">
              {image.path ? (
                <img src={image.path} alt={image.name} className="h-full w-full object-contain" />
              ) : null}
            </div>
            <div className="flex h-8 w-full items-center justify-start bg-gray-400">
              <FileImage className="mr-3 flex-shrink-0 text-xl text-indigo-500" />
              <span className="flex-grow truncate text-sm">{image.name}</span>
              <button
                onClick={() => onRemoveImage?.(image)}
                className="flex-shrink-0 p-1 text-red-500 opacity-70 transition-opacity hover:text-red-700 hover:opacity-100"
                title="Remove file"
              >
                <Trash2Fill />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-center text-gray-400 italic">No files added yet.</p>
        </div>
      )}
    </div>
  );
};

export default ImageListViewer;
