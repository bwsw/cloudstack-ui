import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators';


export interface AffinityGroupType {
  type: string;
}

@FieldMapper({
  virtualmachineIds: 'virtualMachineIds'
})
export class AffinityGroup extends BaseModel {
  public id: string;
  public name: string;
  public description: string;
  public type: string;
  public virtualMachineIds: Array<string>;

  constructor(params) {
    super(params);

    if (!this.virtualMachineIds) {
      this.virtualMachineIds = [];
    }
  }
}
