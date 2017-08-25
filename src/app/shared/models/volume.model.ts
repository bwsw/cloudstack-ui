import * as moment from 'moment';
import { FieldMapper } from '../decorators/field-mapper.decorator';
import { ZoneName } from '../decorators/zone-name.decorator';
import { VolumeTagKeys } from '../services/tags/volume-tag-keys';
import { BaseModel } from './base.model';
import { DiskOffering } from './disk-offering.model';
import { Snapshot } from './snapshot.model';
import { DeletionMark, Tag } from './tag.model';


export enum VolumeType {
  ROOT = 'ROOT',
  DATADISK = 'DATADISK'
}

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

  public get description(): string {
    if (!this.tags) {
      return '';
    }

    const description = this.tags.find(tag => tag.key === VolumeTagKeys.description);
    if (description) {
      return description.value;
    } else {
      return '';
    }
  }

  public get isRoot(): boolean {
    return this.type === VolumeType.ROOT;
  }

  public get isDeleted(): boolean {
    return !!this.tags.find(
      tag => tag.key === DeletionMark.TAG && tag.value === DeletionMark.VALUE
    );
  }

  private initializeTags(): void {
    if (!this.tags) {
      this.tags = [];
    }

    this.tags = this.tags.map(tag => new Tag(tag));
  }
}
