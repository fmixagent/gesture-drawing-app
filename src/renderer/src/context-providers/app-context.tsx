import { Bucket } from '@renderer/models/bucket';
import { Session } from '@renderer/models/session';
import storeService from '@renderer/service/store-service';
import React, { useContext, useEffect, useState } from 'react';

interface AppContextInterface {
  sessions: Session[];
  saveSession: (session: Session) => void;
  deleteSession: (session: Session) => void;

  buckets: Bucket[];
  saveBucket: (bucket: Bucket) => void;
  deleteBucket: (bucket: Bucket) => void;
}

export const AppContext = React.createContext<AppContextInterface>({} as AppContextInterface);

const AppContextProvider = (props: any) => {
  // SESSIONS
  const [sessions, setSessions] = useState<Session[]>([]);

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
      const updatedUserConfig = { ...userConfig, sessionSelected: undefined };
      await storeService.setUserConfig(updatedUserConfig);
      recoverSessions();
    } else {
      recoverSessions();
    }
  };

  // BUCKETS
  const [buckets, setBuckets] = useState<Bucket[]>([]);

  const recoverBuckets = async () => {
    const recoveredBuckets = await storeService.getAllBuckets();
    setBuckets([...recoveredBuckets]);
  };

  const saveBucket = async (bucket: Bucket) => {
    await storeService.saveBucket(bucket);

    // Check if user session is the same as session
    const userConfig = await storeService.getUserConfig();
    const userBucket = userConfig.bucketSelected;

    if (userBucket?.id === bucket.id) {
      const updatedUserConfig = { ...userConfig, bucketSelected: bucket };
      await storeService.setUserConfig(updatedUserConfig);
      recoverBuckets();
    } else {
      recoverBuckets();
    }
  };

  const deleteBucket = async (bucket: Bucket) => {
    await storeService.deleteBucket(bucket);

    // Check if user session is the same as session
    const userConfig = await storeService.getUserConfig();
    const userBucket = userConfig.bucketSelected;

    if (userBucket?.id === bucket.id) {
      const updatedUserConfig = { ...userConfig, bucketSelected: undefined };
      await storeService.setUserConfig(updatedUserConfig);
      recoverBuckets();
    } else {
      recoverBuckets();
    }
  };

  // Initial
  useEffect(() => {
    recoverSessions();
    recoverBuckets();

    return (() => {
      setSessions([]);
    })();
  }, []);

  return (
    <AppContext.Provider
      value={{
        sessions,
        saveSession,
        deleteSession,
        buckets,
        saveBucket,
        deleteBucket,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

export default AppContextProvider;
