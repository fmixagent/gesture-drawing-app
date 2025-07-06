export class TimeStretch {
  id!: string;
  label!: string;
  duration!: number; // in seconds
}

export const TIME_STRETCHS: TimeStretch[] = [
  { id: '1', label: '1min', duration: 60 },
  { id: '2', label: '5 min', duration: 300 },
  { id: '3', label: '10 min', duration: 600 },
];

export class Configuration {
  timeStretchSelected!: TimeStretch;
}
