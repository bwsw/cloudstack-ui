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
  hypervisorsnapshotreserve: 'hypervisorSnapshotReverse',
})
export class ServiceOffering extends BaseModel {
  public id: string;
  public name: string;
  public cpuNumber: string;
  public cpuSpeed: string;
  public memory: string;
  public networkRate: string;
  public displayText: string;
  public storageType: string;
  public provisioningType: string;
  public offerHa: boolean;
  public limitCpu: boolean;
  public isVolatile: boolean;

  public _list: any;
  private _map: any;

  constructor(params?: {}) {
    super(params);

    this._list = [];
    this._map = {
      'name': true,
      'cpuNumber': true,
      'cpuSpeed': true,
      'memory': true,
      'displayText': true,
      'storageType': true,
      'provisioningType': true,
      'offerHa': true,
      'networkRate': true,
      'minIops': true,
      'maxIops': true,
      'limitCpu': true,
      'isVolatile': true,
      'hypervisorsnapshotreserve': true,
      'diskBytesReadRate': true,
      'diskBytesWriteRate': true,
      'diskIopsReadRate': true,
      'diskIopsWriteRate': true,
      'deploymentplanner': true,
      'domain': true
    };

    this.createList();
  }

  public set(key: string, val: string): void {
    super.set(key, val);

    if (!this._list) {
      return;
    }
    const ind = this._list.findIndex((el) => el.label === key);

    if (ind === -1) {
      return;
    }

    this._list[ind] = val;
  }

  private createList() {
    const result = [];

    for (let key in this) {
      if (!this.hasOwnProperty(key) || typeof key === 'function' || key.startsWith('_')) {
        continue;
      }

      if (this._map[key] === undefined) {
        continue;
      }

      let value = this[key];

      if (value === true) {
        value = 'Yes';
      } else if (value === false) {
        value = 'No';
      }

      result.push({
        key,
        value
      });
    }

    this._list = result;
  }
}
