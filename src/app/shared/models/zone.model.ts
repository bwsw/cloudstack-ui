import { BaseModelInterface } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';


@FieldMapper({
  securitygroupsenabled: 'securityGroupsEnabled',
  networktype: 'networkType',
  localstorageenabled: 'localStorageEnabled'
})
export class Zone implements BaseModelInterface {
  id: string;
  name: string;
  securityGroupsEnabled: boolean;
  networkType: string;
  localStorageEnabled: boolean;
}
