import { Offering } from './offering.model';

export interface DiskOffering extends Offering {
  disksize: number;
  created?: string;
}
