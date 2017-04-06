import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';


@FieldMapper({
  securitygroupsenabled: 'securityGroupsEnabled',
  networktype: 'networkType',
  localstorageenabled: 'localStorageEnabled'
})
export class Zone extends BaseModel {
  public id: string;
  public name: string;
  public securityGroupsEnabled: boolean;
  public networkType: string;
  public localStorageEnabled: boolean;

  public get networkTypeIsBasic(): boolean {
    return this.localStorageEnabled;
  }
}
