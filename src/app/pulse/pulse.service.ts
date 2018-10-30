import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CpuStats, DiskStats, NetworkStats, RamStats } from './stats';

interface TimeParams {
  range: string;
  aggregation: string;
  shift: string;
}

export interface Interval {
  scales: Object;
}

@Injectable()
export class PulseService {
  constructor(protected http: HttpClient) {}

  public getPermittedIntervals() {
    return this.http.get(`cs-extensions/pulse/permitted-intervals`);
  }

  public cpuTime(vmId: string, params: TimeParams, forceUpdate = false): Observable<CpuStats[]> {
    return this.request('cputime', vmId, params, forceUpdate);
  }

  public ram(vmId: string, params: TimeParams, forceUpdate = false): Observable<RamStats[]> {
    return this.request('ram', vmId, params, forceUpdate);
  }

  public disk(
    vmId: string,
    diskId: string,
    params: TimeParams,
    forceUpdate = false,
  ): Observable<DiskStats[]> {
    return this.request('disk', `${vmId}/${diskId}`, params, forceUpdate);
  }

  public network(
    vmId: string,
    macAddress: string,
    params: TimeParams,
    forceUpdate = false,
  ): Observable<NetworkStats[]> {
    return this.request('network-interface', `${vmId}/${macAddress}`, params, forceUpdate);
  }

  protected request(endpoint: string, params: string, timeParams: TimeParams, forceUpdate = false) {
    const t = `${timeParams.range}/${timeParams.aggregation}/${timeParams.shift}`;

    let requestParams = new HttpParams();
    if (forceUpdate) {
      requestParams = requestParams.set('_', `${new Date().getTime()}`);
    }

    return this.http
      .get(`cs-extensions/pulse/${endpoint}/${params}/${t}`, { params: requestParams })
      .pipe(map(res => res['result']));
  }
}
