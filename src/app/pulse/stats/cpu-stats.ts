import { Stats } from './stats';

export interface CpuStats extends Stats {
  cpuCount: number;
  cpuTime: number;
}
