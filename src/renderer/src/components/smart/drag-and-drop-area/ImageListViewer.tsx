import React from 'react';
import { FileImage, Trash2Fill } from 'react-bootstrap-icons';
import { BucketImage } from '@renderer/models/bucket';

interface DragAndDropAreaProps {
  images: BucketImage[];
  onRemoveImage?: (imageFile: BucketImage) => void;
}

const ImageListViewer: React.FC<DragAndDropAreaProps> = ({ images = [], onRemoveImage }) => {
  return (
    <div className="flex flex-1 overflow-hidden pr-2">
      {images.length > 0 ? (
        <ul className="flex w-full flex-none flex-wrap items-start justify-start overflow-y-auto p-2">
          {images.map((image) => (
            <li key={image.name} className="w-1/5 p-1">
              <div className="relative flex flex-col items-center border border-gray-200 bg-white p-2 shadow-sm">
                <div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-gray-100 p-1">
                  {image.url ? (
                    <img
                      src={image.url}
                      alt={image.name}
                      className="h-full w-full object-contain"
                    />
                  ) : null}
                  {image.localPath ? (
                    <img
                      src={'atom:' + image.localPath}
                      alt={image.name}
                      className="h-full w-full object-contain"
                    />
                  ) : null}
                </div>
                <div className="flex h-8 w-full items-center justify-start gap-3 bg-gray-200 px-2 py-5">
                  <FileImage className="flex-shrink-0 text-xl text-gray-500" />
                  <span className="flex-grow truncate text-sm">{image.name}</span>
                  <button
                    onClick={() => onRemoveImage?.(image)}
                    className="flex-shrink-0 cursor-pointer p-1 text-red-500/70 opacity-70 transition-all duration-200 ease-in-out hover:text-red-500 hover:opacity-100"
                    title="Remove file"
                  >
                    <Trash2Fill />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-center text-gray-400 italic">No files added yet.</p>
        </div>
      )}
    </div>
  );
};

export default ImageListViewer;
