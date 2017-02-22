import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';
import { Snapshot } from './snapshot.model';

@FieldMapper({
  virtualmachineid: 'virtualMachineId',
  zonename: 'zoneName'
})
export class Volume extends BaseModel {
  public id: string;
  public name: string;
  public state: string;
  public size: number;
  public virtualMachineId: string;
  public snapshots: Array<Snapshot>;
  public type: string;
  public zoneName: string;
}
