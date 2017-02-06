import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators';


@FieldMapper({
  displaytext: 'displayText',
  isextractable: 'isExtractable',
  isfeatured: 'isFeatured',
  ispublic: 'isPublic',
  isready: 'isReady',
  ostypeid: 'osTypeId',
  ostypename: 'osTypeName'
})
export class Iso extends BaseModel {
  public id: string;
  public bootable: boolean;
  public displayText: string;
  public isExtractable: boolean;
  public isFeatured: boolean;
  public isPublic: boolean;
  public isReady: boolean;
  public osTypeId: string;
  public osTypeName: string;
  public name: string;
  public status: string;
  public size: number;
}
