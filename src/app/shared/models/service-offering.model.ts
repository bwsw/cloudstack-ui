import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';


@FieldMapper({
  cpunumber: 'cpuNumber',
  cpuspeed: 'cpuSpeed',
  networkrate: 'networkRate',
  displaytext: 'displayText',
  storagetype: 'storageType',
  provisioningtype: 'provisioningType',
  offerha: 'offerHa',
  limitcpuuse: 'limitCpu',
  isvolatile: 'isVolatile',
  hypervisorsnapshotreserve: 'hypervisorSnapshotReserve',
  deploymentplanner: 'deploymentPlanner',
  issystem: 'isSystem',
  iscustomized: 'isCustomized',
  defaultuse: 'defaultUse'
})
export class ServiceOffering extends BaseModel {
  public id: string;
  public name: string;
  public cpuNumber: number;
  public cpuSpeed: number;
  public memory: number;
  public networkRate: string;
  public displayText: string;
  public storageType: string;
  public provisioningType: string;
  public offerHa: boolean;
  public limitCpu: boolean;
  public isVolatile: boolean;
  public isSystem: boolean;
  public defaultUse: boolean;
  public isCustomized: boolean;
  public diskBytesReadRate: number;
  public diskBytesWriteRate: number;
  public diskIopsReadRate: number;
  public diskIopsWriteRate: number;
  public deploymentPlanner: string;
  public domain: string;
}
