import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';


@FieldMapper({
  displaytext: 'displayText',
  iscustomized: 'isCustomized',
  miniops: 'minIops',
  maxiops: 'maxIops',
  storagetype: 'storageType',
  provisioningtype: 'provisioningType'
})
export abstract class Offering extends BaseModel {
  public id: string;
  public name: string;
  public displayText: string;
  public diskBytesReadRate: number;
  public diskBytesWriteRate: number;
  public diskIopsReadRate: number;
  public diskIopsWriteRate: number;
  public isCustomized: boolean;
  public minIops: number;
  public maxIops: number;
  public storageType: string;
  public provisioningType: string;
}
// disk[..] properties don't need to be in field mapper because they are already in camel case in the response
