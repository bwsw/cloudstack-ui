import * as moment from 'moment';

import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';
import { Snapshot } from './snapshot.model';
import { DiskOffering } from './disk-offering.model';
import { ZoneName } from '../decorators/zone-name.decorator';
import { Tag, DeletionMark } from './tag.model';


type VolumeType = 'ROOT' | 'DATADISK';

export const VolumeTypes = {
  ROOT: 'ROOT' as VolumeType,
  DATADISK: 'DATADISK' as VolumeType
};

@ZoneName()
@FieldMapper({
  diskofferingid: 'diskOfferingId',
  diskofferingname: 'diskOfferingName',
  provisioningtype: 'provisioningType',
  storagetype: 'storageType',
  virtualmachineid: 'virtualMachineId',
  zoneid: 'zoneId',
  zonename: 'zoneName'
})
export class Volume extends BaseModel {
  public resourceType = 'Volume';

  public id: string;
  public created: Date;
  public domain: string;
  public diskOffering: DiskOffering;
  public diskOfferingId: string;
  public name: string;
  public state: string;
  public size: number;
  public virtualMachineId: string;
  public provisioningType: string;
  public snapshots: Array<Snapshot>;
  public storageType: string;
  public tags: Array<Tag>;
  public type: VolumeType;
  public zoneId: string;

  public zoneName: string;

  constructor(json) {
    super(json);
    this.created = moment(json.created).toDate();

    this.initializeTags();
  }

  public get isRoot(): boolean {
    return this.type === VolumeTypes.ROOT;
  }

  public get isDeleted(): boolean {
    return !!this.tags.find(tag => tag.key === DeletionMark.TAG && tag.value === DeletionMark.VALUE);
  }

  private initializeTags(): void {
    if (!this.tags) {
      this.tags = [];
    }

    this.tags = this.tags.map(tag => new Tag(tag));
  }
}
