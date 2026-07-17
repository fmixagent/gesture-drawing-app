import { ImageData } from '@renderer/models/imageData';
import { UserConfiguration } from '@renderer/models/userConfiguration';
import fsService from '@renderer/service/fs-service';
import { useEffect, useState } from 'react';

type UseImagesShownProps = {
  images: ImageData[];
  srcImage: string;
  resetSrcImage: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

const useImagesShown = (userConfiguration: UserConfiguration): UseImagesShownProps => {
  // Images available
  const [images, setImages] = useState<ImageData[]>([]);
  // Images already shown
  const [imagesShown, setImagesShown] = useState<string[]>([]);
  // Actual image index
  const [imageShownIndex, setImageShownIndex] = useState<number>(-1);
  // Image shown
  const [srcImage, setSrcImage] = useState<string>('');

  useEffect(() => {
    const recoverFolderImages = async (): Promise<void> => {
      if (!userConfiguration.folderSelected) {
        return;
      }
      const images: ImageData[] = await fsService.getFilesFromDir(userConfiguration.folderSelected);
      setImages(images);
    };
    recoverFolderImages();

    return () => {
      setImages([]);
    };
  }, [userConfiguration.folderSelected]);

  useEffect(() => {
    const images = userConfiguration.bucketSelected ? userConfiguration.bucketSelected.images : [];
    setImages(images);

    return () => {
      setImages([]);
    };
  }, [userConfiguration.bucketSelected]);

  const showNewRandomImage = (): void => {
    // Is folder selected
    const imagePath: string | undefined = getRandomImage();
    if (!imagePath) return;

    showImage(imagePath);
    setImagesShown((prev) => [...prev, imagePath]);
    setImageShownIndex((prev) => prev + 1);
  };

  const showImage = (imagePath: string): void => {
    setSrcImage(imagePath);
  };

  const getRandomImage = (): string | undefined => {
    if (images.length === 0) {
      return undefined; // Fallback to default logo if no images are available
    }
    const randomIndex = Math.floor(Math.random() * images.length);
    const imageData: ImageData = images[randomIndex];
    const imagePath = imageData.url ?? 'atom:' + imageData.localPath;
    return imagePath;
  };

  const onNext = (): void => {
    if (imageShownIndex >= imagesShown.length - 1) {
      showNewRandomImage();
      return;
    }

    const newIndex = imageShownIndex + 1;
    setImageShownIndex(newIndex);
    const nextImage = imagesShown[newIndex];
    showImage(nextImage); // Show the next image;
  };

  const onPrevious = (): void => {
    if (imageShownIndex <= 0) {
      return;
    }

    const newIndex = imageShownIndex - 1;
    setImageShownIndex(newIndex);
    const previousImage = imagesShown[newIndex];
    showImage(previousImage); // Show the previous image
  };

  const resetSrcImage = (): void => {
    setSrcImage('');
  };

  return {
    images,
    srcImage,
    resetSrcImage,
    onPrevious,
    onNext,
  };
};

export default useImagesShown;
