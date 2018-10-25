import { BaseModel } from './base.model';

export const storageTypes = {
  local: 'local',
  shared: 'shared',
};

export interface Offering extends BaseModel {
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

export const isOfferingLocal = (offering: Offering) => offering.storagetype === storageTypes.local;

export const isCustomized = (offering: Offering) => offering.iscustomized;
