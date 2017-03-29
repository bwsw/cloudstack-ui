import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';
import { StorageTypes } from './service-offering.model';


@FieldMapper({
  disksize: 'diskSize',
  displaytext: 'displayText',
  iscustomized: 'isCustomized',
  miniops: 'minIops',
  maxIops: 'maxIops',
  storagetype: 'storageType'
})
export class DiskOffering extends BaseModel {
  public id: string;
  public displayText: string;
  public diskSize: number;
  public minIops: number;
  public maxIops: number;
  public diskBytesReadRate: number;
  public diskBytesWriteRate: number;
  public diskIopsReadRate: number;
  public diskIopsWriteRate: number;
  public isCustomized: boolean;
  public storageType: string;

  public get isLocal(): boolean {
    return this.storageType === StorageTypes.local;
  }
}
