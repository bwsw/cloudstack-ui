import moment = require('moment');

import { BaseModel, Tag } from '../../shared/models';
import { FieldMapper } from '../../shared/decorators/field-mapper.decorator';
import { OsType } from '../../shared/models/os-type.model';


@FieldMapper({
  displaytext: 'displayText',
  domainid: 'domainId',
  isdynamicallyscalable: 'isDynamicallyScalable',
  isextractable: 'isExtractable',
  isfeatured: 'isFeatured',
  ispublic: 'isPublic',
  isready: 'isReady',
  ostypeid: 'osTypeId',
  ostypename: 'osTypeName',
  zoneid: 'zoneId',
  zonename: 'zoneName',
})
export class BaseTemplateModel extends BaseModel {
  public path: string;

  public id: string;
  public account: string;
  public created: Date;
  public crossZones: boolean;
  public displayText: string;
  public domain: string;
  public domainId: string;
  public isDynamicallyScalable: boolean;
  public isExtractable: boolean;
  public isFeatured: boolean;
  public isPublic: boolean;
  public isReady: boolean;
  public name: string;
  public osTypeId: string;
  public osTypeName: string;
  public osType: OsType;
  public size: number;
  public tags: Array<Tag>;
  public zoneId: string;
  public zoneName: string;

  constructor(json) {
    super(json);
    this.created = moment(json.created).toDate();
  }
}
