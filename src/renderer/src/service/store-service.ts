import { UserConfiguration } from "@renderer/models/userConfiguration";


const USER_CONFIG_KEY = 'userConfig';

const getUserConfig = async (): Promise<UserConfiguration> => {
  const userConfigString = await window.api.getStoreValue(USER_CONFIG_KEY);
  const userConfig:UserConfiguration = userConfigString ? JSON.parse(userConfigString) : new UserConfiguration();
  return userConfig;
}
const setUserConfig = async (userConfig: UserConfiguration): Promise<void> => {
  const userConfigString = JSON.stringify(userConfig);
  await window.api.setStoreValue(USER_CONFIG_KEY, userConfigString);
};

const deleteUserConfig = async (): Promise<void> => {
  const emptyUserConfigString = JSON.stringify(new UserConfiguration());
  await window.api.setStoreValue(USER_CONFIG_KEY, emptyUserConfigString);
}

const storeService = {
  getUserConfig,
  setUserConfig,
  deleteUserConfig
};

export default storeService;
