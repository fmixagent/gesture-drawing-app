import React, { useState, useCallback } from 'react';
import { Upload } from 'react-bootstrap-icons';
import ImageListViewer from './ImageListViewer';

// --- Typings & Constants ---
enum DropStatusEnum {
  DEFAULT = 'default',
  DRAG_OVER = 'drag-over',
  ERROR = 'error',
}
type DropStatus = `${DropStatusEnum}`;

export interface Image {
  name: string;
  path: string;
}

interface DragAndDropAreaProps {
  initialImages?: Image[];
}

const DragAndDropArea: React.FC<DragAndDropAreaProps> = ({ initialImages = [] }) => {
  const [images, setImages] = useState<Image[]>(initialImages);
  const [dropStatus, setDropStatus] = useState<DropStatus>(DropStatusEnum.DEFAULT);

  // --- Handlers ---
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDropStatus(DropStatusEnum.DRAG_OVER);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDropStatus(DropStatusEnum.DEFAULT);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDropStatus(DropStatusEnum.DRAG_OVER);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDropStatus(DropStatusEnum.DEFAULT);

      // Simulate accepting dropped files (e.dataTransfer.files)
      const files: FileList | null = e.dataTransfer.files;
      const imageUrl = e.dataTransfer.getData('url');
      console.log('//IMAGE URL: ', imageUrl);
      console.log('//FILES: ', files);
      console.log('//FILE NAME: ', files[0].name);

      if (!files || files.length === 0) return;

      const droppedFile = files[0];

      let droppedImage: Image;
      if (imageUrl) {
        // File dropped from browser
        droppedImage = {
          name: droppedFile.name,
          path: imageUrl,
        };
      } else {
        // File from system
        const filePath = window.api.getPathForFile(droppedFile);
        droppedImage = {
          name: droppedFile.name,
          path: filePath,
        };
      }

      // Check if already exists in the list
      const existingImage = images.find((anImage) => anImage.path === droppedImage.path);
      if (existingImage) return;

      // Add image
      setImages([...images, droppedImage]);
    },
    [images]
  );

  const handleRemoveImage = (image: Image) => {
    setImages(images.filter((anImage) => anImage.path !== image.path));
  };

  return (
    <div className="flex h-full w-full flex-col items-start justify-start gap-3">
      <header className="flex w-full items-center justify-between gap-2">
        <p>Drag and drop directly the images from your browser or browse files from the system</p>

        <div>
          <label
            htmlFor="file-upload"
            className="inline-flex cursor-pointer items-center rounded-full border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700"
          >
            Browse Files
            <input
              id="file-upload"
              type="file"
              // onChange={(e) => {
              //   const files: File[] = Array.from(e.target.files!);
              //   if (files.length > 0) {
              //     onFileSelect?.(files);
              //     setImages([...imageFiles, { id: Date.now().toString(), file: files[0] }]);
              //   }
              // }}
              className="hidden"
            />
          </label>
        </div>
      </header>
      <div
        className={`relative flex w-full flex-1 flex-col border border-gray-700 transition-all duration-200 ease-in-out ${
          dropStatus === 'drag-over'
            ? 'border-dashed border-gray-500 bg-indigo-50'
            : 'border-gray-300 bg-white'
        } `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Overlay */}
        {dropStatus === 'drag-over' && (
          <div className="pointer-events-none absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center bg-white/60">
            <div className="flex flex-col items-center justify-center gap-2">
              <Upload className="mb-2 text-4xl text-gray-600" />
              <p className="text-base font-semibold">Drop your file</p>
            </div>
          </div>
        )}
        {/* File List */}
        <ImageListViewer images={images} onRemoveImage={handleRemoveImage} />
      </div>
    </div>
  );
};

export default DragAndDropArea;
