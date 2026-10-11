import React, { useState, useCallback } from 'react';
import { Upload } from 'react-bootstrap-icons';
import ImageListViewer from './ImageListViewer';
import { ImageData } from '@renderer/models/imageData';
import droppedFileService from '@renderer/service/dropped-file-service';
import imageBlobStore, { isAndroid } from '@renderer/service/image-blob-store';
import { environment } from '@renderer/environments/environment';

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

// Electron (Chromium) exposes a dragged web image's URL via the non-standard
// 'url' format. Plain browsers never populate it, only the standard
// 'text/uri-list' format or an <img> tag inside 'text/html'.
// Chrome on Android only provides the image as a File (no URL at all) when
// dragging an image, but a dragged link arrives as 'text/plain'.
const extractDroppedImageUrl = (dataTransfer: DataTransfer): string | null => {
  const electronUrl = dataTransfer.getData('url');
  console.log('//electronUrl: ', electronUrl);
  if (electronUrl) return electronUrl;

  const uriList = dataTransfer.getData('text/uri-list');
  console.log('//uriList: ', uriList);
  if (uriList) {
    const firstUrl = uriList
      .split('\n')
      .map((line) => line.trim())
      .find((line) => line && !line.startsWith('#'));
    if (firstUrl) return firstUrl;
  }

  const html = dataTransfer.getData('text/html');
  console.log('//HTML: ', html);
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match) return match[1];

  const text = dataTransfer.getData('text/plain').trim();
  return /^https?:\/\/\S+$/i.test(text) ? text : null;
};

// Android drops tend to share generic file names (e.g. 'image.png'), so the
// stored id is appended to keep names unique within a bucket.
const getUniqueFileName = (fileName: string, blobId: string): string => {
  const extensionIndex = fileName.lastIndexOf('.');
  const suffix = blobId.slice(0, 8);
  return extensionIndex > 0
    ? `${fileName.slice(0, extensionIndex)}-${suffix}${fileName.slice(extensionIndex)}`
    : `${fileName}-${suffix}`;
};

const getFileNameFromUrl = (url: string): string => {
  try {
    return new URL(url).pathname.split('/').pop() || url;
  } catch {
    return url;
  }
};

const DragAndDropArea: React.FC<DragAndDropAreaProps> = ({ initialImages = [], onChange }) => {
  const [images, setImages] = useState<ImageData[]>(initialImages);
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
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDropStatus(DropStatusEnum.DEFAULT);

      // Simulate accepting dropped files (e.dataTransfer.files)
      const files: FileList | null = e.dataTransfer.files;
      const imageUrl = extractDroppedImageUrl(e.dataTransfer);
      console.log('//TEST imageUrl:  ', imageUrl);

      let droppedImage: ImageData;
      if (imageUrl) {
        // Image dropped from a browser page. Electron also provides a
        // synthetic File here, but plain browsers (web build) do not.
        droppedImage = {
          name: files?.[0]?.name || getFileNameFromUrl(imageUrl),
          url: imageUrl,
        };
      } else if (files && files.length > 0 && environment.webVersion && isAndroid()) {
        // Image dropped on Android: no URL is available, so the image itself
        // is stored in IndexedDB and only referenced from the bucket.
        const blobId = await imageBlobStore.saveImage(files[0]);
        droppedImage = { name: getUniqueFileName(files[0].name, blobId), blobId };
      } else if (files && files.length > 0) {
        // File from system
        droppedImage = droppedFileService.getImageDataFromFile(files[0]);
      } else {
        return;
      }

      // Check if already exists in the
      const imageNameExists = images.find((anImage) => anImage.name === droppedImage.name)
        ? true
        : false;
      if (imageNameExists) return;

      // Add image
      const updatedImages = [...images, droppedImage];
      setImages(updatedImages);
      onChange?.(updatedImages);
    },
    [images, onChange]
  );

  const handleRemoveImage = (image: ImageData): void => {
    const updatedImages = images.filter((anImage) => anImage.name !== image.name);
    setImages(updatedImages);
    onChange?.(updatedImages);
  };

  const onChangeBrowse = (ev: React.ChangeEvent<HTMLInputElement>): void => {
    const files: File[] = Array.from(ev.target.files!);
    if (files.length === 0) return;

    const newImages: ImageData[] = [];
    for (const file of files) {
      const imageAlreadyExists = images.find((anImage) => anImage.name === file.name)
        ? true
        : false;
      if (!imageAlreadyExists) {
        newImages.push(droppedFileService.getImageDataFromFile(file));
      }
    }
    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onChange?.(updatedImages);
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
