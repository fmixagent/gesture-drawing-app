import {
  DEFAULT_CUSTOM_TIME_STRETCH,
  TimeStretch,
  UserConfiguration,
} from '@renderer/models/userConfiguration';

const USER_CONFIG_KEY = 'userConfig';
const CUSTOM_TIME_STRETCH_KEY = 'customTimeStretch';

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

const storeService = {
  getUserConfig,
  setUserConfig,
  deleteUserConfig,
  getCustomTimeStretch,
  setCustomTimeStretch,
};

export default storeService;
