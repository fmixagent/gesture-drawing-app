import { Bucket, PRELOADED_BUCKET } from '@renderer/models/bucket';
import { PRELOADED_SESSIONS, Session } from '@renderer/models/session';
import {
  DEFAULT_CUSTOM_TIME_STRETCH,
  TimeStretch,
  UserConfiguration,
} from '@renderer/models/userConfiguration';
import { StoreService } from './store-service.electron';

const USER_CONFIG_KEY = 'userConfig';
const CUSTOM_TIME_STRETCH_KEY = 'customTimeStretch';
const SESSION_CATEGORY = 'session';
const BUCKET_CATEGORY = 'bucket';

const categoryKey = (category: string, key: string): string => `${category}:${key}`;

const getAllCategoryValues = (category: string): string[] => {
  const prefix = `${category}:`;
  return Object.keys(localStorage)
    .filter((key) => key.startsWith(prefix))
    .map((key) => localStorage.getItem(key))
    .filter((value): value is string => value !== null);
};

const getUserConfig = async (): Promise<UserConfiguration> => {
  const userConfigString = localStorage.getItem(USER_CONFIG_KEY);
  const userConfig: UserConfiguration = userConfigString
    ? JSON.parse(userConfigString)
    : new UserConfiguration();
  return userConfig;
};

const setUserConfig = async (userConfig: UserConfiguration): Promise<void> => {
  const userConfigString = JSON.stringify(userConfig);
  localStorage.setItem(USER_CONFIG_KEY, userConfigString);
};

const deleteUserConfig = async (): Promise<void> => {
  const emptyUserConfigString = JSON.stringify(new UserConfiguration());
  localStorage.setItem(USER_CONFIG_KEY, emptyUserConfigString);
};

const getCustomTimeStretch = async (): Promise<TimeStretch | undefined> => {
  const customTimeStretchString = localStorage.getItem(CUSTOM_TIME_STRETCH_KEY);
  const customTimeStretch: TimeStretch = customTimeStretchString
    ? JSON.parse(customTimeStretchString)
    : DEFAULT_CUSTOM_TIME_STRETCH;
  return customTimeStretch;
};

const setCustomTimeStretch = async (customTimeStretch: TimeStretch): Promise<void> => {
  const customTimeStretchString = JSON.stringify(customTimeStretch);
  localStorage.setItem(CUSTOM_TIME_STRETCH_KEY, customTimeStretchString);
};

// SESSIONS
const getAllSessions = async (): Promise<Session[]> => {
  const allStoredSessions: Session[] = [...PRELOADED_SESSIONS];
  const allCustomStoredSessionValues = getAllCategoryValues(SESSION_CATEGORY);
  const allCustomSessions: Session[] = allCustomStoredSessionValues.map(
    (sessionValue) => JSON.parse(sessionValue) as Session
  );

  const allSessions = [...allStoredSessions, ...allCustomSessions];

  return allSessions;
};

const saveSession = async (session: Session) => {
  localStorage.setItem(categoryKey(SESSION_CATEGORY, session.id), JSON.stringify(session));
};

const deleteSession = async (session: Session) => {
  localStorage.removeItem(categoryKey(SESSION_CATEGORY, session.id));
};

// BUCKETS
const getAllBuckets = async (): Promise<Bucket[]> => {
  const allStoredBuckets: Bucket[] = [...PRELOADED_BUCKET];
  const allCustomStoredBucketValues = getAllCategoryValues(BUCKET_CATEGORY);
  const allCustomBuckets: Bucket[] = allCustomStoredBucketValues.map(
    (bucketValue) => JSON.parse(bucketValue) as Bucket
  );

  const allBuckets = [...allStoredBuckets, ...allCustomBuckets];

  return allBuckets;
};

const saveBucket = async (bucket: Bucket) => {
  localStorage.setItem(categoryKey(BUCKET_CATEGORY, bucket.id), JSON.stringify(bucket));
};

const deleteBucket = async (bucket: Bucket) => {
  localStorage.removeItem(categoryKey(BUCKET_CATEGORY, bucket.id));
};

const storeServiceWeb: StoreService = {
  getUserConfig,
  setUserConfig,
  deleteUserConfig,
  getCustomTimeStretch,
  setCustomTimeStretch,
  getAllSessions,
  saveSession,
  deleteSession,
  getAllBuckets,
  saveBucket,
  deleteBucket,
};

export default storeServiceWeb;
