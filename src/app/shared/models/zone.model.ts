import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';

@FieldMapper({
  securitygroupsenabled: 'securityGroupsEnabled'
})
export class Zone extends BaseModel {
  public id: string;
  public name: string;
  public securityGroupsEnabled: boolean;
}
