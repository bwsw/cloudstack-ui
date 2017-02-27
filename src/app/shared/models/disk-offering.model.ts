import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';


@FieldMapper({
  disksize: 'diskSize',
  displaytext: 'displayText',
  iscustomized: 'isCustomized',
  miniops: 'minIops',
  maxIops: 'maxIops'
})
export class DiskOffering extends BaseModel {
  public id: string;
  public name: string;
  public displayText: string;
  public diskSize: number;
  public minIops: number;
  public maxIops: number;
  public diskBytesReadRate: number;
  public diskBytesWriteRate: number;
  public diskIopsReadRate: number;
  public diskIopsWriteRate: number;
  public isCustomized: boolean;
}
