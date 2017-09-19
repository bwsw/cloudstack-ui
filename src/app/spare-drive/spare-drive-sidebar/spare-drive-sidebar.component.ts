import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { Volume } from '../../shared/models';
import { VolumeType } from '../../shared/models/volume.model';
import { DateTimeFormatterService } from '../../shared/services/date-time-formatter.service';
import { DiskOfferingService } from '../../shared/services/disk-offering.service';
import { NotificationService } from '../../shared/services/notification.service';
import { ServiceOfferingService } from '../../shared/services/service-offering.service';
import { VolumeService } from '../../shared/services/volume.service';
import { EntityDoesNotExistError } from '../../shared/components/sidebar/entity-does-not-exist-error';


@Component({
  selector: 'cs-spare-drive-sidebar',
  templateUrl: 'spare-drive-sidebar.component.html',
  styleUrls: ['spare-drive-sidebar.component.scss']
})
export class SpareDriveSidebarComponent extends SidebarComponent<Volume> {
  @HostBinding('class.grid') public grid = true;

  constructor(
    public dateTimeFormatterService: DateTimeFormatterService,
    protected notificationService: NotificationService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected serviceOfferingService: ServiceOfferingService,
    protected volumeService: VolumeService,
    private diskOfferingService: DiskOfferingService
  ) {
    super(volumeService, notificationService, route, router);
  }

  protected loadEntity(id: string): Observable<Volume> {
    return this.volumeService.get(id)
      .switchMap(volume => {
        if (volume) {
          return Observable.of(volume);
        } else {
          return Observable.throw(new EntityDoesNotExistError());
        }
      })
      .switchMap(volume => {
        if (volume.isRoot) {
          return this.serviceOfferingService.getList()
            .map(serviceOfferings => {
              volume.serviceOffering = serviceOfferings.find(_ => _.id === volume.serviceOfferingId);
              return volume;
            });
        } else {
          return this.diskOfferingService.getList({ type: VolumeType.DATADISK })
            .map(diskOfferings => {
              volume.diskOffering = diskOfferings.find(_ => _.id === volume.diskOfferingId);
              return volume;
            });
        }
      });
  }
}
