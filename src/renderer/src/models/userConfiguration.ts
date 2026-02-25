export class TimeStretch {
  id!: string;
  label!: string;
  duration!: number; // in seconds
}

export const TIME_STRETCHS: TimeStretch[] = [
  { id: '1', label: '1min', duration: 60 },
  { id: '2', label: '3min', duration: 180 },
  { id: '3', label: '5 min', duration: 300 },
  { id: '4', label: '10 min', duration: 600 },
];

export class UserConfiguration {
  timeStretchSelected: TimeStretch = TIME_STRETCHS[0];
  selectedFolder: string = ''; // Optional, can be undefined if not set
}
