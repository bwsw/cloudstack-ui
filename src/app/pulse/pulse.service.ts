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
  constructor(protected http: Http) {
  }

  public getPermittedIntervals() {
    return this.http.get('pulse/permitted-intervals').map(res => res.json());
  }

  public cpuTime(
    vmId: string,
    params: TimeParams,
    forceUpdate = false
  ): Observable<Array<CpuStats>> {
    return this.request('cputime', vmId, params, forceUpdate);
  }

  public ram(
    vmId: string,
    params: TimeParams,
    forceUpdate = false
  ): Observable<Array<RamStats>> {
    return this.request('ram', vmId, params, forceUpdate);
  }

  public disk(
    vmId: string,
    diskId: string,
    params: TimeParams,
    forceUpdate = false
  ): Observable<Array<DiskStats>> {
    return this.request('disk', `${vmId}/${diskId}`, params, forceUpdate);
  }

  public network(
    vmId: string,
    macAddress: string,
    params: TimeParams,
    forceUpdate = false
  ): Observable<Array<NetworkStats>> {
    return this.request(
      'network-interface',
      `${vmId}/${macAddress}`,
      params,
      forceUpdate
    );
  }

  protected request(
    endpoint: string,
    params: string,
    timeParams: TimeParams,
    forceUpdate = false
  ) {
    const t = `${timeParams.range}/${timeParams.aggregation}/${timeParams.shift}`;

    let search;
    if (forceUpdate) {
      search = { _: `${new Date().getTime()}` };
    }

    return this.http
      .get(`pulse/${endpoint}/${params}/${t}`, { search })
      .map(res => res.json())
      .map(res => res.result);
  }
}
