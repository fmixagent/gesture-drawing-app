import { capitalizeFirstLetter } from '@renderer/helpers/utils';

export class Bucket {
  id!: string;
  name: string = '';
  images: string[] = []; // url list
  isRemovable?: boolean = true;
  isEditable?: boolean = true;
}

export const PRELOADED_BUCKET: Bucket[] = [
  {
    id: '1',
    name: 'Demo bucket',
    images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    isRemovable: false,
    isEditable: false,
  },
];

export const getBucketNameFromBucket = (bucket: Bucket): string => {
  return capitalizeFirstLetter(bucket.name);
};
