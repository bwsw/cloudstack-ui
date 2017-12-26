import { Taggable } from '../interfaces/taggable.interface';
import { SnapshotTagKeys } from '../services/tags/snapshot-tag-keys';
import { BaseModelInterface } from './base.model';
import { Tag } from './tag.model';

import * as moment from 'moment';

export enum SnapshotStates {
  BackedUp = 'BackedUp',
  Creating = 'Creating',
  BackingUp = 'BackingUp',
  Allocated = 'Allocated',
  Error = 'Error'
}

export interface Snapshot extends Taggable, BaseModelInterface {
  description: string;
  id: string;
  created: string;
  resourceType: string;
  physicalsize: number;
  volumeid: string;
  name: string;
  tags: Array<Tag>;
  state: SnapshotStates
}

export const getDateSnapshotCreated = (snapshot: Snapshot) => {
  return moment(snapshot.created).toDate();
};

export const getSnapshotDescription = (snapshot: Snapshot) => {
  if (!snapshot.tags) {
    return '';
  }

  const description = snapshot.tags.find(tag => tag.key === SnapshotTagKeys.description);
  if (description) {
    return description.value;
  } else {
    return '';
  }
};
