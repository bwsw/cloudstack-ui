import { Component, HostBinding, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Volume } from '../../shared/models';
import { VolumeType } from '../../shared/models/volume.model';
import { DateTimeFormatterService } from '../../shared/services/date-time-formatter.service';
import { DiskOfferingService } from '../../shared/services/disk-offering.service';
import { VolumeService } from '../../shared/services/volume.service';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { NotificationService } from '../../shared/services/notification.service';


@Component({
  selector: 'cs-spare-drive-sidebar',
  templateUrl: 'spare-drive-sidebar.component.html'
})
export class SpareDriveSidebarComponent extends SidebarComponent<Volume> {
  @HostBinding('class.grid') public grid = true;

  constructor(
    public dateTimeFormatterService: DateTimeFormatterService,
    protected notificationService: NotificationService,
    protected route: ActivatedRoute,
    protected volumeService: VolumeService,
    private diskOfferingService: DiskOfferingService
  ) {
    super(volumeService, notificationService, route);
  }

  public changeDescription(newDescription: string): void {
    this.volumeService
      .updateDescription(this.entity, newDescription)
      .onErrorResumeNext()
      .subscribe();
  }

  protected loadEntity(id: string): Observable<Volume> {
    return this.volumeService.get(id)
      .switchMap(volume => {
        if (volume) {
          return Observable.of(volume);
        } else {
          return Observable.throw('ENTITY_DOES_NOT_EXIST');
        }
      })
      .switchMap(volume => {
        return Observable.forkJoin(
          Observable.of(volume),
          this.diskOfferingService.getList({ type: VolumeType.DATADISK }),
          this.volumeService.getDescription(volume)
        );
      })
      .map(([volume, diskOfferings, description]) => {
        volume.diskOffering = diskOfferings.find(_ => _.id === volume.diskOfferingId);
        volume.description = description;
        return volume;
      });
  }
}
