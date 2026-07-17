import { ImageData } from '@renderer/models/imageData';
import { UserConfiguration } from '@renderer/models/userConfiguration';
import fsService from '@renderer/service/fs-service';
import { useCallback, useEffect, useState } from 'react';

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
  const [nonRepeatedImages, setNonRepeatedImages] = useState<ImageData[]>([]);
  // Images already shown
  const [imagesShown, setImagesShown] = useState<string[]>([]);
  // Actual image index
  const [imageShownIndex, setImageShownIndex] = useState<number>(-1);
  // Image shown
  const [srcImage, setSrcImage] = useState<string>('');

  useEffect(() => {
    if (!userConfiguration) return;

    const recoverFolderImages = async (folder: string): Promise<void> => {
      const images: ImageData[] = await fsService.getFilesFromDir(folder);
      initImages(images);
    };

    if (userConfiguration.folderSelected) {
      recoverFolderImages(userConfiguration.folderSelected);
      return;
    }

    if (userConfiguration.bucketSelected) {
      const images = userConfiguration.bucketSelected.images;
      initImages(images);
    }

    return () => {
      setImages([]);
      setNonRepeatedImages([]);
    };
  }, [userConfiguration]);

  const initImages = (images: ImageData[]) => {
    console.log('//INIT IMAGES: ', images);
    setSrcImage('');
    setImages(images);
    setNonRepeatedImages(images);
    setImageShownIndex(-1);
    setImagesShown([]);
  };

  const showNewRandomImage = useCallback((): void => {
    console.log('//ShowRANDOM: ', nonRepeatedImages);
    // Is folder selected
    const imageData: ImageData = getRandomImage(nonRepeatedImages);
    if (!imageData) return;
    const imagePath = imageData.url ?? 'atom:' + imageData.localPath;

    // Update used images
    const updateNonRepeatedImages = nonRepeatedImages.filter(
      (anImageData) => anImageData.name !== imageData.name
    );
    updateNonRepeatedImages.length === 0
      ? setNonRepeatedImages(images)
      : setNonRepeatedImages([...updateNonRepeatedImages]);

    // Show image (path)
    showImage(imagePath);
    setImagesShown((prev) => [...prev, imagePath]);
    setImageShownIndex((prev) => prev + 1);
  }, [nonRepeatedImages]);

  const showImage = (imagePath: string): void => {
    setSrcImage(imagePath);
  };

  const getRandomImage = (images: ImageData[]): ImageData => {
    const randomIndex = Math.floor(Math.random() * images.length);
    const imageData: ImageData = images[randomIndex];
    return imageData;
  };

  const onNext = (): void => {
    console.log('//SHOW NEXT: ', imageShownIndex);
    if (!imagesShown || imagesShown.length === 0 || imageShownIndex >= imagesShown.length - 1) {
      showNewRandomImage();
      return;
    }

    const newIndex = imageShownIndex + 1;
    setImageShownIndex(newIndex);
    const nextImage = imagesShown[newIndex];
    console.log('////SHOW IMAGE: ', nextImage);
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
    // console.log('///SET IMAGES:', images);
    setSrcImage('');
    // setNonRepeatedImages(images);
    // setImageShownIndex(0);
    // setImagesShown([]);
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
