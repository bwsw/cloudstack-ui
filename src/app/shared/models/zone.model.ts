import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';
import * as _ from 'lodash';


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

  public static sortByName(array: Array<Zone>): Array<Zone> {
    return _.sortBy(array, 'name');
  }

  public get networkTypeIsBasic(): boolean {
    return this.localStorageEnabled;
  }
}
