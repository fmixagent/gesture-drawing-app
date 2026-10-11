import { ImageData } from '@renderer/models/imageData';

// Images dropped on Android arrive as a bare File (Chrome on Android never exposes the
// original web URL across apps), so their content is kept in IndexedDB and the bucket
// JSON only stores a 'blobId' reference to it.

const DB_NAME = 'gesture-drawing-app';
const DB_VERSION = 1;
const STORE_NAME = 'droppedImages';

let dbPromise: Promise<IDBDatabase> | null = null;

const openDb = (): Promise<IDBDatabase> => {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  return dbPromise;
};

const runRequest = async <T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = operation(db.transaction(STORE_NAME, mode).objectStore(STORE_NAME));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const generateId = (): string =>
  crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

// Android tablets run Chrome in "desktop site" mode by default, which reports a desktop
// Linux user agent, so a touch-capable Linux device is also treated as Android.
export const isAndroid = (): boolean => {
  const { userAgent, maxTouchPoints } = navigator;
  return /android/i.test(userAgent) || (/linux/i.test(userAgent) && maxTouchPoints > 0);
};

const saveImage = async (file: Blob): Promise<string> => {
  const blobId = generateId();
  await runRequest('readwrite', (store) => store.put(file, blobId));
  return blobId;
};

const getImage = (blobId: string): Promise<Blob | undefined> =>
  runRequest<Blob | undefined>('readonly', (store) => store.get(blobId));

// Removes every stored image not referenced by any of the given buckets' images.
const pruneUnreferencedImages = async (referencedImages: ImageData[]): Promise<void> => {
  const referencedIds = new Set(referencedImages.map((image) => image.blobId).filter(Boolean));
  const storedIds = await runRequest('readonly', (store) => store.getAllKeys());
  const unreferencedIds = storedIds.filter((id) => !referencedIds.has(id as string));
  await Promise.all(
    unreferencedIds.map((id) => runRequest('readwrite', (store) => store.delete(id)))
  );
};

// Gives every blob-backed image a displayable object URL (in memory only, never persisted).
// Images whose blob no longer exists are dropped.
const resolveImageUrls = async (images: ImageData[]): Promise<ImageData[]> => {
  const resolved = await Promise.all(
    images.map(async (image) => {
      if (!image.blobId) return image;
      const blob = await getImage(image.blobId);
      return blob ? { ...image, url: URL.createObjectURL(blob) } : null;
    })
  );
  return resolved.filter((image): image is ImageData => image !== null);
};

const imageBlobStore = {
  saveImage,
  getImage,
  pruneUnreferencedImages,
  resolveImageUrls,
};

export default imageBlobStore;
