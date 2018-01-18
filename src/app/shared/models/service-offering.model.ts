import { Offering } from './offering.model';

export interface ServiceOffering extends Offering {
  created: string;
  cpunumber: number;
  cpuspeed: number;
  memory: number;
  networkrate: string;
  offerha: boolean;
  limitcpuuse: boolean;
  isvolatile: boolean;
  issystem: boolean;
  defaultuse: boolean;
  deploymentplanner: string;
  domain: string;
  hosttags: string;
  disabled?: boolean
}
