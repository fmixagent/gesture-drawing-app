import { PRELOADED_SESSIONS, Session } from '@renderer/models/session';
import {
  DEFAULT_CUSTOM_TIME_STRETCH,
  TimeStretch,
  UserConfiguration,
} from '@renderer/models/userConfiguration';

const USER_CONFIG_KEY = 'userConfig';
const CUSTOM_TIME_STRETCH_KEY = 'customTimeStretch';
const SESSION_IDS_KEY = 'sessionIds';
const SESSION_BASE_KEY = 'session';

const getUserConfig = async (): Promise<UserConfiguration> => {
  const userConfigString = await window.api.getStoreValue(USER_CONFIG_KEY);
  const userConfig: UserConfiguration = userConfigString
    ? JSON.parse(userConfigString)
    : new UserConfiguration();
  return userConfig;
};
const setUserConfig = async (userConfig: UserConfiguration): Promise<void> => {
  const userConfigString = JSON.stringify(userConfig);
  await window.api.setStoreValue(USER_CONFIG_KEY, userConfigString);
};

const deleteUserConfig = async (): Promise<void> => {
  const emptyUserConfigString = JSON.stringify(new UserConfiguration());
  await window.api.setStoreValue(USER_CONFIG_KEY, emptyUserConfigString);
};

const getCustomTimeStretch = async (): Promise<TimeStretch | undefined> => {
  const customTimeStretchString = await window.api.getStoreValue(CUSTOM_TIME_STRETCH_KEY);
  const customTimeStretch: TimeStretch = customTimeStretchString
    ? JSON.parse(customTimeStretchString)
    : DEFAULT_CUSTOM_TIME_STRETCH;
  return customTimeStretch;
};

const setCustomTimeStretch = async (customTimeStretch: TimeStretch): Promise<void> => {
  const customTimeStretchString = JSON.stringify(customTimeStretch);
  await window.api.setStoreValue(CUSTOM_TIME_STRETCH_KEY, customTimeStretchString);
};

const getAllSessionIds = async (): Promise<string[]> => {
  const allStoredSessionIdsValue = await window.api.getStoreValue(SESSION_IDS_KEY);
  const allStoredSessionIds = allStoredSessionIdsValue ? JSON.parse(allStoredSessionIdsValue) : [];
  return allStoredSessionIds;
};

const getAllSessions = async (): Promise<Session[]> => {
  const allStoredSessionIds = await getAllSessionIds();

  const allStoredSessions: Session[] = [...PRELOADED_SESSIONS];
  for (let i = 0; i < allStoredSessionIds.length; i++) {
    const sessionId = allStoredSessionIds[i];
    const storedSessionString = await window.api.getStoreValue(SESSION_BASE_KEY + sessionId);
    if (storedSessionString) {
      const storedSession: Session = JSON.parse(storedSessionString);
      allStoredSessions.push(storedSession);
    }
  }

  return allStoredSessions;
};

//TODO: update system to recover ids from prefix SESSION_BASE_KEY
const saveSession = async (session: Session) => {
  const allStoredSessionIds = await getAllSessionIds();

  if (!allStoredSessionIds.includes(session.id)) {
    // New session
    const updatedStoredSessionIds = [...allStoredSessionIds, session.id];
    await window.api.setStoreValue(SESSION_IDS_KEY, JSON.stringify(updatedStoredSessionIds));
  }

  // Update session
  await window.api.setStoreValue(SESSION_BASE_KEY + session.id, JSON.stringify(session));
};

const deleteSession = async (session: Session) => {
  // Update session names
  const allStoredSessionIdsValue = await window.api.getStoreValue(SESSION_IDS_KEY);
  const allStoredSessionIds = allStoredSessionIdsValue ? JSON.parse(allStoredSessionIdsValue) : [];
  const updatedStoredSessionIds = allStoredSessionIds.filter((id) => id !== session.id);
  await window.api.setStoreValue(SESSION_IDS_KEY, JSON.stringify(updatedStoredSessionIds));

  // Delete session key
  await window.api.deleteStoreValue(SESSION_BASE_KEY + session.id);
};

const storeService = {
  getUserConfig,
  setUserConfig,
  deleteUserConfig,
  getCustomTimeStretch,
  setCustomTimeStretch,
  getAllSessions,
  saveSession,
  deleteSession,
};

export default storeService;
