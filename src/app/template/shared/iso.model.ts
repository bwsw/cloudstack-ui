import { BaseModel, OsType } from '../../shared/models';
import { FieldMapper } from '../../shared/decorators/';


@FieldMapper({
  displaytext: 'displayText',
  isextractable: 'isExtractable',
  isfeatured: 'isFeatured',
  ispublic: 'isPublic',
  isready: 'isReady',
  ostypeid: 'osTypeId',
  ostypename: 'osTypeName',
  zoneid: 'zoneId'
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
  public osType: OsType;
  public name: string;
  public status: string;
  public size: number;
  public zoneId: string;
}
