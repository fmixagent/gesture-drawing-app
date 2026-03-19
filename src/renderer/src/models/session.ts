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
      { id: '2', label: '10s', duration: 10 },
      { id: '3', label: '10s', duration: 10 },
    ],
  },
  {
    totalDuration: 1800, // 30 minutes
    sequenceName: 'Short20 (20min)',
    sequence: [
      { id: '1', label: '1min', duration: 60 },
      { id: '2', label: '1min', duration: 60 },
      { id: '3', label: '3min', duration: 180 },
      { id: '4', label: '5 min', duration: 300 },
      { id: '5', label: '10 min', duration: 600 },
    ],
  },
  {
    totalDuration: 1800, // 30 minutes
    sequenceName: 'Short30 (30min)',
    sequence: [
      { id: '1', label: '1min', duration: 60 },
      { id: '2', label: '1min', duration: 60 },
      { id: '3', label: '1min', duration: 60 },
      { id: '4', label: '1min', duration: 60 },
      { id: '5', label: '3min', duration: 180 },
      { id: '6', label: '3min', duration: 180 },
      { id: '7', label: '5 min', duration: 300 },
      { id: '8', label: '5 min', duration: 300 },
      { id: '9', label: '10 min', duration: 600 },
    ],
  },
  {
    totalDuration: 2100, // 35 minutes
    sequenceName: 'Short35 (35min)',
    sequence: [
      { id: '1', label: '1min', duration: 60 },
      { id: '2', label: '1min', duration: 60 },
      { id: '3', label: '1min', duration: 60 },
      { id: '4', label: '1min', duration: 60 },
      { id: '5', label: '1min', duration: 60 },
      { id: '6', label: '3min', duration: 180 },
      { id: '7', label: '3min', duration: 180 },
      { id: '8', label: '3min', duration: 180 },
      { id: '9', label: '3min', duration: 180 },
      { id: '10', label: '3min', duration: 180 },
      { id: '11', label: '5 min', duration: 300 },
      { id: '12', label: '10 min', duration: 600 },
    ],
  },
  {
    totalDuration: 6000, // 100 minutes
    sequenceName: 'LongSession (100min)',
    sequence: [
      { id: '1', label: '15 min', duration: 900 },
      { id: '2', label: '20 min', duration: 1200 },
      { id: '3', label: '30 min', duration: 1800 },
      { id: '4', label: '45 min', duration: 2700 },
    ],
  },
];
