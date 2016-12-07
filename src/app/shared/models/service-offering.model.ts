import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';

// @FieldMapper({
//   cpuNumber: 'cpunumber',
//   cpuSpeed: 'cpuspeed',
//   networkRate: 'networkrate'
// })
@FieldMapper({
  cpunumber: 'cpuNumber',
  cpuspeed: 'cpuSpeed',
  networkrate: 'networkRate'
})
export class ServiceOffering extends BaseModel {
  public name: string;
  public cpunumber: string;
  public cpuspeed: string;
  public memory: string;
  public networkrate: string;
}
