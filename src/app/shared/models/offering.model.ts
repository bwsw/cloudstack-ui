import { BaseModelInterface } from './base.model';

export const StorageTypes = {
  local: 'local',
  shared: 'shared'
};

export interface Offering extends BaseModelInterface {
  id: string;
  name: string;
  displaytext: string;
  iscustomized: boolean;
  storagetype: string;
  provisioningtype: string;
  diskBytesReadRate?: number;
  diskBytesWriteRate?: number;
  diskIopsReadRate?: number;
  diskIopsWriteRate?: number;
  miniops?: number;
  maxiops?: number;
}

export const isOfferingLocal = (offering: Offering) => offering.storagetype === StorageTypes.local;

export const isCustomized = (offering: Offering) => offering.iscustomized;
