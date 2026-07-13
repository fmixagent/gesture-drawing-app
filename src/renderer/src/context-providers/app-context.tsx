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
    console.log('//TEST CALL TO STORE SERVICE *** ');
    const recoveredSessions = await storeService.getAllSessions();
    console.log('//RECOVERD SESSIONS: ', recoveredSessions);
    setSessions(recoveredSessions);
  };

  const saveSession = async (session) => {
    console.log('//ACTUAL SESSIONS: ', sessions);
    await storeService.saveSession(session);
    const updatedSessions = [...sessions, session];
    console.log('//UPDATED SESSIONS: ', sessions);
    setSessions(updatedSessions);
  };

  const deleteSession = async (session) => {
    await storeService.deleteSession(session);
    setSessions((prev) => prev.filter((s) => s.sequenceName !== session.sequenceName));
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
