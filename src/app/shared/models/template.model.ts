import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators';

export interface ITag {
  key: string;
  value: string;
}

@FieldMapper({
  displaytext: 'displayText',
  ostypeid: 'osTypeId',
  ostypename: 'osTypeName'
})
export class Template extends BaseModel {
  public id: string;
  public name: string;
  public displayText: string;
  public osTypeId: string;
  public osTypeName: string;
  public size: number;
  public tags: Array<ITag>;
}
