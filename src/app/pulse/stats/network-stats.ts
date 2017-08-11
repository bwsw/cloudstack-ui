import { Stats } from './stats';

export interface NetworkStats extends Stats {
  readBits: number;
  writeBits: number;
  readErrors: number;
  writeErrors: number;
  readDrops: number;
  writeDrops: number;
  readPackets: number;
  writePackets: number;
}
