import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators';


@FieldMapper({
  displaytext: 'displayText',
  ostypeid: 'osTypeId',
  ostypename: 'osTypeName'
})
export class Iso extends BaseModel {
  public id: string;
  public size: number;
}
