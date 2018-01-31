import { BaseModelInterface } from './base.model';

export const StorageTypes = {
  local: 'local',
  shared: 'shared'
};

export interface Offering extends BaseModelInterface {
  id: string;
  name: string;
  displaytext: string;
  diskBytesReadRate: number;
  diskBytesWriteRate: number;
  diskIopsReadRate: number;
  diskIopsWriteRate: number;
  iscustomized: boolean;
  miniops: number;
  maxiops: number;
  storagetype: string;
  provisioningtype: string;
}

export const isOfferingLocal = (offering: Offering) => offering.storagetype === StorageTypes.local;

export const isCustomized = (offering: Offering) => offering.iscustomized;
