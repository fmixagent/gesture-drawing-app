import { TimeStretch } from "./userConfiguration";


export class Session {
  totalDuration?: number; // in seconds
  sequenceName?: string; // Optional name for the session
  sequence: TimeStretch[] = [];
}

export const PRELOADED_SESSIONs: Session[] = [
  {
    totalDuration: 1800, // 30 minutes
    sequenceName: 'For testing (25s)',
    sequence: [
      { id: '1', label: '5s', duration: 5 },
      { id: '1', label: '10s', duration: 10 },
      { id: '1', label: '10s', duration: 10 },
    ],
  },
  {
    totalDuration: 1800, // 30 minutes
    sequenceName: 'Short20 (20min)',
    sequence: [
      { id: '1', label: '1min', duration: 60 },
      { id: '1', label: '1min', duration: 60 },
      { id: '2', label: '3min', duration: 180 },
      { id: '3', label: '5 min', duration: 300 },
      { id: '4', label: '10 min', duration: 600 },
    ],
  },
  {
    totalDuration: 1800, // 30 minutes
    sequenceName: 'Short30 (30min)',
    sequence: [
      { id: '1', label: '1min', duration: 60 },
      { id: '1', label: '1min', duration: 60 },
      { id: '1', label: '1min', duration: 60 },
      { id: '1', label: '1min', duration: 60 },
      { id: '2', label: '3min', duration: 180 },
      { id: '2', label: '3min', duration: 180 },
      { id: '3', label: '5 min', duration: 300 },
      { id: '3', label: '5 min', duration: 300 },
      { id: '4', label: '10 min', duration: 600 },
    ],
  },
  {
    totalDuration: 2100, // 35 minutes
    sequenceName: 'Short35 (35min)',
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
    sequenceName: 'LongSession (100min)',
    sequence: [
      { id: '5', label: '15 min', duration: 900 },
      { id: '6', label: '20 min', duration: 1200 },
      { id: '7', label: '30 min', duration: 1800 },
      { id: '8', label: '45 min', duration: 2700 },
    ],
  },
];
