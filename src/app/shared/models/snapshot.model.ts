import * as moment from 'moment';
import { Taggable } from '../interfaces/taggable.interface';
import { snapshotTagKeys } from '../services/tags/snapshot-tag-keys';
import { BaseModel } from './base.model';

export enum SnapshotStates {
  BackedUp = 'BackedUp',
  Creating = 'Creating',
  BackingUp = 'BackingUp',
  Allocated = 'Allocated',
  Error = 'Error',
}

export enum SnapshotType {
  Manual = 'MANUAL',
  Hourly = 'HOURLY',
  Daily = 'DAILY',
  Weekly = 'WEEKLY',
  Monthly = 'MONTHLY',
}

export interface Snapshot extends Taggable, BaseModel {
  id: string;
  account: string;
  domain: string;
  domainid: string;
  created: string;
  physicalsize: number;
  volumeid: string;
  snapshottype: SnapshotType;
  name: string;
  state: SnapshotStates;
  revertable: boolean;
}

export const getDateSnapshotCreated = (snapshot: Snapshot) => {
  return moment(snapshot.created).toDate();
};

export const getSnapshotDescription = (snapshot: Snapshot) => {
  if (!snapshot.tags) {
    return '';
  }

  const description = snapshot.tags.find(tag => tag.key === snapshotTagKeys.description);
  if (description) {
    return description.value;
  }
  return '';
};
