import { BaseModel, OsType } from '../../shared/models';
import { FieldMapper } from '../../shared/decorators/';
import { AuthService } from '../../shared/services';


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
export class Iso extends BaseModel { // todo: superclass (iso, template)
  public id: string;
  public account: string;
  public bootable: boolean;
  public created: string;
  public crossZones: boolean;
  public displayText: string;
  public domain: string;
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
