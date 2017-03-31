import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';
import { Sort } from '../decorators/sort.decorator';


@Sort('name')
@FieldMapper({
  securitygroupsenabled: 'securityGroupsEnabled',
  networktype: 'networkType',
  localstorageenabled: 'localStorageEnabled'
})
export class Zone extends BaseModel {
  public static sortByName: any;

  public id: string;
  public name: string;
  public securityGroupsEnabled: boolean;
  public networkType: string;
  public localStorageEnabled: boolean;

  public get networkTypeIsBasic(): boolean {
    return this.localStorageEnabled;
  }
}
