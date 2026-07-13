import { Session } from './session';

export class TimeStretch {
  id!: string;
  label!: string;
  duration!: number; // in seconds
}

export const DEFAULT_CUSTOM_TIME_STRETCH: TimeStretch = {
  id: 'customTimeStretchId',
  label: 'Custom time',
  duration: 600, // default to 10 minutes
};

export const TIME_STRETCHS: TimeStretch[] = [
  { id: '1', label: '1 min', duration: 60 },
  { id: '2', label: '3 min', duration: 180 },
  { id: '3', label: '5 min', duration: 300 },
];

export class UserConfiguration {
  timeStretchSelected?: TimeStretch;
  sessionSelected?: Session;
  selectedFolder: string = ''; // Optional, can be undefined if not set
}
