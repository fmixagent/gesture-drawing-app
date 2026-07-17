import React, { useState, useCallback, useEffect } from 'react';
import { Upload } from 'react-bootstrap-icons';
import ImageListViewer from './ImageListViewer';
import { ImageData } from '@renderer/models/imageData';

// --- Typings & Constants ---
enum DropStatusEnum {
  DEFAULT = 'default',
  DRAG_OVER = 'drag-over',
  ERROR = 'error',
}
type DropStatus = `${DropStatusEnum}`;

interface DragAndDropAreaProps {
  initialImages?: ImageData[];
  onChange?: (images: ImageData[]) => void;
}

const DragAndDropArea: React.FC<DragAndDropAreaProps> = ({ initialImages = [], onChange }) => {
  const [images, setImages] = useState<ImageData[]>(initialImages);
  const [dropStatus, setDropStatus] = useState<DropStatus>(DropStatusEnum.DEFAULT);

  useEffect(() => {
    onChange?.(images);
  }, [images]);

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

      if (!files || files.length === 0) return;

      const droppedFile = files[0];

      let droppedImage: ImageData;
      if (imageUrl) {
        // File dropped from browser
        droppedImage = {
          name: droppedFile.name,
          url: imageUrl,
        };
      } else {
        // File from system
        const filePath = window.api.getPathForFile(droppedFile);
        droppedImage = {
          name: droppedFile.name,
          localPath: filePath,
        };
      }

      // Check if already exists in the list
      if (checkIfImageAlreadyExists(droppedImage.name)) return;

      // Add image
      setImages([...images, droppedImage]);
    },
    [images]
  );

  const checkIfImageAlreadyExists = (imageName: string): boolean => {
    return images.find((anImage) => anImage.name === imageName) ? true : false;
  };

  const handleRemoveImage = (image: ImageData) => {
    setImages(images.filter((anImage) => anImage.name !== image.name));
  };

  const onChangeBrowse = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(ev.target.files!);
    if (files.length === 0) return;

    const newImages: ImageData[] = [];
    for (const file of files) {
      const imageName = file.name;
      const filePath = window.api.getPathForFile(file);
      const imageAlreadyExists = checkIfImageAlreadyExists(file.name);
      if (!imageAlreadyExists) {
        const newImage = {
          name: imageName,
          localPath: filePath,
        };
        newImages.push(newImage);
      }
    }
    setImages([...images, ...newImages]);
  };

  return (
    <div className="flex h-full w-full flex-col items-start justify-start gap-3 overflow-hidden">
      <header className="flex w-full flex-none items-center justify-between gap-2">
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
              onChange={onChangeBrowse}
              className="hidden"
              accept="image/*"
              multiple
            />
          </label>
        </div>
      </header>
      <div
        className={`relative flex w-full flex-1 overflow-hidden border border-gray-300 transition-all duration-200 ease-in-out ${
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
