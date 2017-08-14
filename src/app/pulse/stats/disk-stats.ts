import { Stats } from './stats';

export interface DiskStats extends Stats {
  ioErrors: number;
  readBytes: number;
  writeBytes: number;
  readIOPS: number;
  writeIOPS: number;
}
