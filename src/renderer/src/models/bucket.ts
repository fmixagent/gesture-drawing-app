import { capitalizeFirstLetter } from '@renderer/helpers/utils';
import { ImageData } from './imageData';
export class Bucket {
  id!: string;
  name: string = '';
  images: ImageData[] = []; // url list
  isRemovable?: boolean = true;
  isEditable?: boolean = true;
  isDownloadable?: boolean = true;
}

export const PRELOADED_BUCKET: Bucket[] = [
  {
    id: '1',
    name: 'Demo bucket',
    images: [],
    isRemovable: false,
    isEditable: false,
    isDownloadable: false,
  },
];

export const getBucketNameFromBucket = (bucket: Bucket): string => {
  return capitalizeFirstLetter(bucket.name);
};

export const isValidBucketStructure = (data: unknown): data is Bucket => {
  if (!data || typeof data !== 'object') return false;

  const bucket = data as Record<string, unknown>;
  return (
    typeof bucket.id === 'string' &&
    typeof bucket.name === 'string' &&
    Array.isArray(bucket.images) &&
    bucket.images.every(
      (image) =>
        !!image && typeof image === 'object' && typeof (image as ImageData).name === 'string'
    )
  );
};
