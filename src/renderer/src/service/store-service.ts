import { PRELOADED_SESSIONs, Session } from '@renderer/models/session';
import {
  DEFAULT_CUSTOM_TIME_STRETCH,
  TimeStretch,
  UserConfiguration,
} from '@renderer/models/userConfiguration';

const USER_CONFIG_KEY = 'userConfig';
const CUSTOM_TIME_STRETCH_KEY = 'customTimeStretch';
const SESSION_NAMES_KEY = 'sessionNames';

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

const getAllSessionNames = async (): Promise<string[]> => {
  const allStoredSessionNamesValue = await window.api.getStoreValue(SESSION_NAMES_KEY);
  const allStoredSessionNames = allStoredSessionNamesValue
    ? JSON.parse(allStoredSessionNamesValue)
    : [];
  return allStoredSessionNames;
};

const getAllSessions = async (): Promise<Session[]> => {
  // await window.api.deleteStoreValue(SESSION_NAMES_KEY);
  // return [];

  const allStoredSessionNames = await getAllSessionNames();

  const allStoredSessions: Session[] = PRELOADED_SESSIONs;
  allStoredSessionNames.forEach(async (storedSessionName) => {
    const storedSessionString = await window.api.getStoreValue(storedSessionName);
    if (storedSessionString) {
      const storedSession: Session = JSON.parse(storedSessionString);
      allStoredSessions.push(storedSession);
    }
  });
  return allStoredSessions;
};

const saveSession = async (session: Session) => {
  //Update session names
  const allStoredSessionNames = await getAllSessionNames();
  const updatedStoredSessionNames = [...allStoredSessionNames, session.sequenceName];
  await window.api.setStoreValue(SESSION_NAMES_KEY, JSON.stringify(updatedStoredSessionNames));

  // Update session key
  await window.api.setStoreValue(session.sequenceName, JSON.stringify(session));
};

const deleteSession = async (session: Session) => {
  // Update session names
  const allStoredSessionNamesValue = await window.api.getStoreValue(SESSION_NAMES_KEY);
  const allStoredSessionNames = allStoredSessionNamesValue
    ? JSON.parse(allStoredSessionNamesValue)
    : [];
  const updatedStoredSessionNames = allStoredSessionNames.filter(
    (name) => name !== session.sequenceName
  );
  await window.api.setStoreValue(SESSION_NAMES_KEY, JSON.stringify(updatedStoredSessionNames));

  // Delete session key
  await window.api.deleteStoreValue(session.sequenceName);
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
