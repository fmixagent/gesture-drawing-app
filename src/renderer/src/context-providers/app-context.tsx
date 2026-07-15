import { Session } from '@renderer/models/session';
import storeService from '@renderer/service/store-service';
import React, { useContext, useEffect, useState } from 'react';

interface AppContextInterface {
  sessions: Session[];
  saveSession: (session: Session) => void;
  deleteSession: (session: Session) => void;
}

export const AppContext = React.createContext<AppContextInterface>({} as AppContextInterface);

const AppContextProvider = (props: any) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  useEffect(() => {
    recoverSessions();

    return (() => {
      setSessions([]);
    })();
  }, []);

  const recoverSessions = async () => {
    const recoveredSessions = await storeService.getAllSessions();
    setSessions([...recoveredSessions]);
  };

  const saveSession = async (session) => {
    await storeService.saveSession(session);

    // Check if user session is the same as session
    const userConfig = await storeService.getUserConfig();
    const userSession = userConfig.sessionSelected;

    if (userSession?.id === session.id) {
      const updatedUserSection = { ...userConfig, sessionSelected: session };
      await storeService.setUserConfig(updatedUserSection);
      recoverSessions();
    } else {
      recoverSessions();
    }
  };

  const deleteSession = async (session) => {
    await storeService.deleteSession(session);

    // Check if user session is the same as session
    const userConfig = await storeService.getUserConfig();
    const userSession = userConfig.sessionSelected;

    if (userSession?.id === session.id) {
      const updatedUserSection = { ...userConfig, sessionSelected: undefined };
      await storeService.setUserConfig(updatedUserSection);
      recoverSessions();
    } else {
      recoverSessions();
    }
  };

  return (
    <AppContext.Provider
      value={{
        sessions,
        saveSession,
        deleteSession,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppContextProvider;
