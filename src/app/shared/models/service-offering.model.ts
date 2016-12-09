import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';

@FieldMapper({
  cpunumber: 'cpuNumber',
  cpuspeed: 'cpuSpeed',
  networkrate: 'networkRate'
})
export class ServiceOffering extends BaseModel {
  public name: string;
  public cpuNumber: string;
  public cpuSpeed: string;
  public memory: string;
  public networkRate: string;
}
