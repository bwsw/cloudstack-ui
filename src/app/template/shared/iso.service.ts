import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { BackendResource } from '../../shared/decorators/backend-resource.decorator';
import { BaseBackendService } from '../../shared/services/base-backend.service';
import { Iso } from './iso.model';
import { AsyncJobService } from '../../shared/services/async-job.service';
import { OsTypeService } from '../../shared/services/os-type.service';


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
    private osTypeService: OsTypeService
  ) {
    super();
  }

  public get(id: string, params?: IsoRequestParams): Observable<Iso> {
    const isofilter = params && params.isofilter ? params.isofilter : 'featured';
    return Observable.forkJoin([
      this.getList({ isofilter, id }),
      this.osTypeService.getList()
    ])
      .map(([isos, osTypes]) => {
        isos[0].osType = osTypes.find(osType => osType.id === isos[0].osTypeId);
        return isos[0];
      })
      .catch(error => Observable.throw(error));
  }

  public getList(params: IsoRequestParams): Observable<Array<Iso>> {
    return Observable.forkJoin([
      super.getList(params),
      this.osTypeService.getList()
    ])
      .map(([isos, osTypes]) => {
        isos.forEach(iso => {
          iso.osType = osTypes.find(osType => osType.id === iso.osTypeId);
        });
        return isos;
      });
  }

  public addOsTypeData(iso: Iso): Observable<Iso> {
    return this.osTypeService.getList()
      .map(osTypes => {
        iso.osType = osTypes.find(osType => osType.id === iso.osTypeId);
        return iso;
      });
  }

  public register(iso: Iso, url: string): Observable<Iso> {
    let params = {};
    params['displaytext'] = iso.displayText;
    params['name'] = iso.name;
    params['ostypeid'] = iso.osTypeId;
    params['zoneid'] = iso.zoneId;
    params['url'] = url;

    return this.getRequest('register', params)
      .map(result => new Iso(result['registerisoresponse'].iso[0]));
  }

  public delete(iso: Iso): Observable<any> {
    return this.getRequest('delete', {
      id: iso.id,
      zoneid: iso.zoneId
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

  public attach(vmId: string, iso: Iso): Observable<Iso> {
    return this.getRequest('attach', {
      virtualmachineid: vmId,
      id: iso.id
    })
      .switchMap(response => {
        return this.asyncJobService.addJob(response['attachisoresponse'].jobid);
      })
      .switchMap(jobResult => {
        if (jobResult.jobStatus === 2) {
          return Observable.throw(jobResult.jobResult.errortext);
        }
        return Observable.of(iso);
      });
  }

  public detach(id: string): Observable<any> {
    return this.getRequest('detach', {
      virtualmachineid: id
    })
      .switchMap(response => {
        return this.asyncJobService.addJob(response['detachisoresponse'].jobid);
      })
      .switchMap(jobResult => {
        if (jobResult.jobStatus === 2) {
          return Observable.throw(jobResult.jobResult.errortext);
        }
        return Observable.of(null);
      });
  }

}
