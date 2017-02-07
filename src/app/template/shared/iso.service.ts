import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { BackendResource } from '../../shared/decorators/backend-resource.decorator';
import { BaseBackendService } from '../../shared/services/base-backend.service';
import { Iso } from './iso.model';
import { AsyncJobService } from '../../shared/services/async-job.service';
import { VmService } from '../../vm';


interface IsoRequestParams {
  isofilter: string;
  [propName: string]: any;
}

@Injectable()
@BackendResource({
  entity: 'Iso',
  entityModel: Iso
})
export class IsoService extends BaseBackendService<Iso> {
  constructor(
    private asyncJobService: AsyncJobService,
    private vmService: VmService
  ) {
    super();
  }

  public get(id: string, params?: IsoRequestParams): Observable<Iso> {
    const isofilter = params && params.isofilter ? params.isofilter : 'featured';
    return this.getList({ isofilter, id })
      .map(data => data[0])
      .catch(error => Observable.throw(error));
  }

  public getList(params: IsoRequestParams): Observable<Array<Iso>> {
    return <Observable<Array<Iso>>>super.getList(params);
  }

  public register(iso: Iso, url: string) {
    let params = {};
    params['displaytext'] = iso.displayText;
    params['name'] = iso.name;
    params['ostypeid'] = iso.osTypeId;
    params['zoneid'] = iso.zoneId;
    params['url'] = url;

    return this.getRequest('register', params)
      .map(result => new Iso(result['registerisoresponse'].iso[0]));
  }

  public delete(iso: Iso): Observable<any> { // todo: circular deps
    return this.vmService.getList()
      .switchMap(vmList => {
        let filteredVms = vmList.filter(vm => vm.isoId === iso.id);
        if (filteredVms.length) {
          return Observable.throw({
            type: 'vmsInUse',
            vms: filteredVms
          });
        }
        return this.getRequest('delete', {
          id: iso.id,
          zoneid: iso.zoneId
        });
      })
      .switchMap(response => {
        return this.asyncJobService.addJob(response['deleteisoresponse'].jobid);
      })
      .switchMap(jobResult => {
        if (jobResult.jobStatus === 2 || jobResult.jobResult && !jobResult.jobResult.success) {
          return Observable.throw(jobResult);
        }
        return Observable.of(null);
      });
  }
}
