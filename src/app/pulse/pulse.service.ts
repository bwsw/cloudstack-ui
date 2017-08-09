import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CpuStats, DiskStats, NetworkStats, RamStats } from './stats';

interface TimeParams {
  range: string;
  aggregation: string;
  shift: string;
}

@Injectable()
export class PulseService {
  constructor(protected http: Http) {}

  public getPermittedIntervals() {
    return this.http.get('pulse/permitted-intervals').map(res => res.json());
  }

  public cpuTime(vmId: string, params: TimeParams): Observable<Array<CpuStats>> {
    return this.request('cputime', vmId, params);
  }

  public ram(vmId: string, params: TimeParams): Observable<Array<RamStats>> {
    return this.request('ram', vmId, params);
  }

  public disk(
    vmId: string,
    diskId: string,
    params: TimeParams
  ): Observable<Array<DiskStats>> {
    return this.request('disk', `${vmId}/${diskId}`, params);
  }

  public network(
    vmId: string,
    macAddress: string,
    params: TimeParams
  ): Observable<Array<NetworkStats>> {
    return this.request('network-interface', `${vmId}/${macAddress}`, params);
  }

  protected request(endpoint: string, params: string, timeParams: TimeParams) {
    const t = `${timeParams.range}/${timeParams.aggregation}/${timeParams.shift}`;

    return this.http
      .get(`pulse/${endpoint}/${params}/${t}?_=${new Date().getTime()}`)
      .map(res => res.json())
      .map(res => res.result);
  }
}
