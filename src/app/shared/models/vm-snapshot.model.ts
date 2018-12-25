import { SnapshotType } from '../types';
import { BaseModel } from './base.model';
import { Snapshot } from './snapshot.model';

export interface VmSnapshot extends BaseModel {
  account: string;
  created: string;
  current: boolean;
  description: string;
  displayname: string;
  domain: string;
  domainid: string;
  name: string;
  parent: string;
  parentName: string;
  state: string;
  type: string;
  virtualmachineid: string;
  zoneid: string;
}

export function getSnapshotType(snapshot: VmSnapshot | Snapshot): SnapshotType {
  if (!snapshot) {
    return undefined;
  }
  return (snapshot as VmSnapshot).virtualmachineid == null ? SnapshotType.Volume : SnapshotType.VM;
}
