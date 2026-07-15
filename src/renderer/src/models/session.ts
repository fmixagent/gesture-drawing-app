import { capitalizeFirstLetter, getMinutesFromSeconds } from '@renderer/helpers/utils';
import { TimeStretch } from './userConfiguration';

export class Session {
  id!: string;
  totalDuration: number = 0; // in seconds
  sequenceName: string = ''; // Optional name for the session
  sequence: TimeStretch[] = [];
  isRemovable?: boolean = true;
  isEditable?: boolean = true;
}

export const PRELOADED_SESSIONS: Session[] = [
  {
    id: '1',
    totalDuration: 1800, // 30 minutes
    sequenceName: 'Short20 (20min)',
    sequence: [
      { id: '1', label: '1 min', duration: 60 },
      { id: '2', label: '1 min', duration: 60 },
      { id: '3', label: '3 min', duration: 180 },
      { id: '4', label: '5 min', duration: 300 },
      { id: '5', label: '10 min', duration: 600 },
    ],
    isRemovable: false,
    isEditable: false,
  },
  {
    id: '2',
    totalDuration: 1800, // 30 minutes
    sequenceName: 'Short30 (30min)',
    sequence: [
      { id: '1', label: '1 min', duration: 60 },
      { id: '2', label: '1 min', duration: 60 },
      { id: '3', label: '1 min', duration: 60 },
      { id: '4', label: '1 min', duration: 60 },
      { id: '5', label: '3 min', duration: 180 },
      { id: '6', label: '3 min', duration: 180 },
      { id: '7', label: '5 min', duration: 300 },
      { id: '8', label: '5 min', duration: 300 },
      { id: '9', label: '10 min', duration: 600 },
    ],
    isRemovable: false,
    isEditable: false,
  },
  {
    id: '3',
    totalDuration: 2100, // 35 minutes
    sequenceName: 'Short35 (35min)',
    sequence: [
      { id: '1', label: '1 min', duration: 60 },
      { id: '2', label: '1 min', duration: 60 },
      { id: '3', label: '1 min', duration: 60 },
      { id: '4', label: '1 min', duration: 60 },
      { id: '5', label: '1 min', duration: 60 },
      { id: '6', label: '3 min', duration: 180 },
      { id: '7', label: '3 min', duration: 180 },
      { id: '8', label: '3 min', duration: 180 },
      { id: '9', label: '3 min', duration: 180 },
      { id: '10', label: '3 min', duration: 180 },
      { id: '11', label: '5 min', duration: 300 },
      { id: '12', label: '10 min', duration: 600 },
    ],
    isRemovable: false,
    isEditable: false,
  },
  {
    id: '4',
    totalDuration: 6000, // 100 minutes
    sequenceName: 'LongSession (100min)',
    sequence: [
      { id: '1', label: '15 min', duration: 900 },
      { id: '2', label: '20 min', duration: 1200 },
      { id: '3', label: '30 min', duration: 1800 },
      { id: '4', label: '45 min', duration: 2700 },
    ],
    isRemovable: false,
    isEditable: false,
  },
];

export const getSessionNameFromSession = (session: Session): string => {
  const sessionName = session.sequenceName
    ? session.isRemovable
      ? `${session.sequenceName} (${getMinutesFromSeconds(session.totalDuration)} min)`
      : session.sequenceName
    : `Session (${session.totalDuration} seconds)`;
  return capitalizeFirstLetter(sessionName);
};
