import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { VmService } from '../../vm/shared/vm.service';
import { Volume } from '../models';
import { Offering } from '../models/offering.model';
import { DiskOfferingService } from './';
import { ServiceOfferingService } from './service-offering.service';


@Injectable()
export class VolumeOfferingService {
  constructor(
    private diskOfferingService: DiskOfferingService,
    private serviceOfferingService: ServiceOfferingService,
    private vmService: VmService
  ) {}

  public getVolumeOffering(volume: Volume): Observable<Offering> {
    if (volume.diskOfferingId) {
      return this.diskOfferingService.get(volume.diskOfferingId);
    }

    if (volume.virtualMachineId) {
      return this.vmService.getWithDetails(volume.virtualMachineId)
        .switchMap(vm => this.serviceOfferingService.get(vm.serviceOfferingId));
    }

    return Observable.of(null);
  }
}
