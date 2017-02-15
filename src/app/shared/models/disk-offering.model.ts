import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';


@FieldMapper({
  iscustomized: 'isCustomized'
})
export class DiskOffering extends BaseModel {
  public id: string;
  public name: string;
  public isCustomized: boolean;
}
