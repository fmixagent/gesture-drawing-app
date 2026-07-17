import { capitalizeFirstLetter } from '@renderer/helpers/utils';
import { ImageData } from './imageData';
export class Bucket {
  id!: string;
  name: string = '';
  images: ImageData[] = []; // url list
  isRemovable?: boolean = true;
  isEditable?: boolean = true;
}

export const PRELOADED_BUCKET: Bucket[] = [
  {
    id: '1',
    name: 'Demo bucket',
    images: [],
    isRemovable: false,
    isEditable: false,
  },
];

export const getBucketNameFromBucket = (bucket: Bucket): string => {
  return capitalizeFirstLetter(bucket.name);
};
