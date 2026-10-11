export class ImageData {
  name: string = '';
  url?: string;
  localPath?: string;
  // Reference to an image stored in IndexedDB (images dropped on Android, see image-blob-store)
  blobId?: string;
}
