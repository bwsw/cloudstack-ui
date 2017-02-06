import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators';

export interface ITag {
  key: string;
  value: string;
}

@FieldMapper({
  displaytext: 'displayText',
  isextractable: 'isExtractable',
  isfeatured: 'isFeatured',
  ispublic: 'isPublic',
  isready: 'isReady',
  ostypeid: 'osTypeId',
  ostypename: 'osTypeName',
  templatetype: 'type'
})
export class Template extends BaseModel {
  public id: string;
  public format: string;
  public name: string;
  public displayText: string;
  public isExtractable: boolean;
  public isFeatured: boolean;
  public isPublic: boolean;
  public isReady: boolean;
  public osTypeId: string;
  public osTypeName: string;
  public size: number;
  public status: string;
  public tags: Array<ITag>;
  public type: string;
}
