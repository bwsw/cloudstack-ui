import { BaseModel, OsType } from '../../shared/models';
import { FieldMapper } from '../../shared/decorators/';

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
export class Template extends BaseModel { // todo: superclass (iso, template)
  public id: string;
  public format: string;
  public name: string;
  public created: string;
  public crossZones: boolean;
  public displayText: string;
  public domain: string;
  public hypervisor: string;
  public isExtractable: boolean;
  public isFeatured: boolean;
  public isPublic: boolean;
  public isReady: boolean;
  public osTypeId: string;
  public osTypeName: string;
  public osType: OsType;
  public size: number;
  public status: string;
  public tags: Array<ITag>;
  public type: string;
  public zoneId: string;
}
