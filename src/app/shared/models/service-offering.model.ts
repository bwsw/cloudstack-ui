import { FieldMapper } from '../decorators/field-mapper.decorator';
import { Offering } from './offering.model';


@FieldMapper({
  cpunumber: 'cpuNumber',
  cpuspeed: 'cpuSpeed',
  networkrate: 'networkRate',
  displaytext: 'displayText',
  offerha: 'offerHa',
  limitcpuuse: 'limitCpu',
  isvolatile: 'isVolatile',
  hypervisorsnapshotreserve: 'hypervisorSnapshotReserve',
  deploymentplanner: 'deploymentPlanner',
  issystem: 'isSystem',
  defaultuse: 'defaultUse'
})
export class ServiceOffering extends Offering {
  public cpuNumber: number;
  public cpuSpeed: number;
  public memory: number;
  public networkRate: string;
  public offerHa: boolean;
  public limitCpu: boolean;
  public isVolatile: boolean;
  public isSystem: boolean;
  public defaultUse: boolean;
  public deploymentPlanner: string;
  public domain: string;
}
