import { VolumeTagKeys } from '../services/tags/volume-tag-keys';
import { BaseModelInterface } from './base.model';
import { DiskOffering } from './disk-offering.model';
import { ServiceOffering } from './service-offering.model';
import { Snapshot } from './snapshot.model';
import { DeletionMark, Tag } from './tag.model';

export class VolumeCreationData {
  public name: string;
  public zoneid: string;
  public diskofferingid: string;
  public size?: number;
}

export enum VolumeType {
  ROOT = 'ROOT',
  DATADISK = 'DATADISK'
}

export enum VolumeState {
  Allocated = 'Allocated',
  Ready = 'Ready'
}

export const volumeTypeNames = {
  [VolumeType.ROOT]: 'VOLUME_TYPE.ROOT',
  [VolumeType.DATADISK]: 'VOLUME_TYPE.DATADISK'
};

export interface Volume extends BaseModelInterface {
  id: string;
  account: string;
  created: Date;
  domain: string;
  domainid: string;
  diskOffering: DiskOffering;
  diskofferingid: string;
  loading: boolean;
  name: string;
  state: VolumeState;
  size: number;
  virtualmachineid: string;
  vmdisplayname?: string;
  provisioningtype: string;
  serviceOffering: ServiceOffering;
  serviceofferingid: string;
  snapshots: Array<Snapshot>;
  storagetype: string;
  tags: Array<Tag>;
  type: VolumeType;
  zoneid: string;
  zonename: string;
}

export const getDescription = (volume: Volume) => {
  if (!volume.tags) {
    return '';
  }

  const description = volume.tags.find(tag => tag.key === VolumeTagKeys.description);
  if (description) {
    return description.value;
  } else {
    return '';
  }
};

export const isRoot = (volume: Volume) => {
  return volume.type === VolumeType.ROOT;
};

export const isDeleted = (volume: Volume) => {
  return !!volume.tags.find(
    tag => tag.key === DeletionMark.TAG && tag.value === DeletionMark.VALUE
  );
};

export interface ISnapshotData {
  name: string;
  desc: string;
}
