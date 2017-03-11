import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';
import { Snapshot } from './snapshot.model';
import { DiskOffering } from './disk-offering.model';
import { ZoneName } from '../decorators/zone-name.decorator';
import { Tag } from './tag.model';


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
  public id: string;
  public created: string;
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
  public type: string;
  public zoneId: string;
  public zoneName: string;
}
