import { BaseModel } from '../../shared/models/base.model';
import { FieldMapper } from '../../shared/decorators/';


@FieldMapper({
  displaytext: 'displayText',
  ostypeid: 'osTypeId',
  ostypename: 'osTypeName'
})
export class Iso extends BaseModel {
  public id: string;
  public size: number;
}
