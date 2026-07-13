import { capitalizeFirstLetter } from '@renderer/helpers/utils';

export class Bucket {
  name: string = '';
  images: string[] = []; // url list
  isRemovable?: boolean = true;
}

export const PRELOADED_BUCKET: Bucket[] = [
  {
    name: 'Demo bucket',
    images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    isRemovable: true,
  },
];

export const getBucketNameFromBucket = (bucket: Bucket): string => {
  return capitalizeFirstLetter(bucket.name);
};
