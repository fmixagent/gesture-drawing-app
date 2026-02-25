import { TimeStretch } from './configuration';

export class Session {
  totalDuration?: number; // in seconds
  sequenceName?: string; // Optional name for the session
  sequence: TimeStretch[] = [];
}

export const PRELOADED_SESSIONs: Session[] = [
  {
    totalDuration: 2100, // 35 minutes
    sequenceName: 'Short Session (35min)',
    sequence: [
      { id: '1', label: '1min', duration: 60 },
      { id: '1', label: '1min', duration: 60 },
      { id: '1', label: '1min', duration: 60 },
      { id: '1', label: '1min', duration: 60 },
      { id: '1', label: '1min', duration: 60 },
      { id: '2', label: '3min', duration: 180 },
      { id: '2', label: '3min', duration: 180 },
      { id: '2', label: '3min', duration: 180 },
      { id: '2', label: '3min', duration: 180 },
      { id: '2', label: '3min', duration: 180 },
      { id: '3', label: '5 min', duration: 300 },
      { id: '4', label: '10 min', duration: 600 },
    ],
  },
  {
    totalDuration: 6000, // 100 minutes
    sequenceName: 'Medium Session (100min)',
    sequence: [
      { id: '5', label: '15 min', duration: 900 },
      { id: '6', label: '20 min', duration: 1200 },
      { id: '7', label: '30 min', duration: 1800 },
      { id: '8', label: '45 min', duration: 2700 },
    ],
  },
];
