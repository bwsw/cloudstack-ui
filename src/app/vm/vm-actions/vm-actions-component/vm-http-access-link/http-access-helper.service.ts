import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { VirtualMachine } from '../../..';
import { HttpAccessService } from '../../../services';
import { VmReachability } from './vm-reachability.enum';

export interface HttpAccessHelperResponse {
  url: string;
  reachable: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class HttpAccessHelperService {
  constructor(private http: HttpClient, private httpAccess: HttpAccessService) {}

  getReachibility(vm: VirtualMachine): Observable<VmReachability> {
    const address = this.httpAccess.getAddress(vm);
    return this.http
      .get('cs-extensions/http-access-helper/', {
        params: { url: address },
      })
      .pipe(
        map((resp: HttpAccessHelperResponse) =>
          resp.reachable ? VmReachability.Reachable : VmReachability.Unreachable,
        ),
        // If request failed, we treat this as Http Address Helper being down
        catchError(() => of(VmReachability.ServiceUnresponsive)),
      );
  }
}
