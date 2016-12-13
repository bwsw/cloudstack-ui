import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';

@FieldMapper({
  virtualmachineid: 'virtualMachineId'
})
export class Volume extends BaseModel {
  public name: string;
  public size: number;
  public virtualMachineId: string;
}
