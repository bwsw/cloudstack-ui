import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { Volume } from '../../shared/models';
import { VolumeType } from '../../shared/models/volume.model';
import { DateTimeFormatterService } from '../../shared/services/date-time-formatter.service';
import { DiskOfferingService } from '../../shared/services/disk-offering.service';
import { NotificationService } from '../../shared/services/notification.service';
import { VolumeTagService } from '../../shared/services/tags/volume-tag.service';
import { VolumeService } from '../../shared/services/volume.service';


@Component({
  selector: 'cs-spare-drive-sidebar',
  templateUrl: 'spare-drive-sidebar.component.html'
})
export class SpareDriveSidebarComponent extends SidebarComponent<Volume> {
  @HostBinding('class.grid') public grid = true;
  public description: string;
  public item: Volume;

  constructor(
    public dateTimeFormatterService: DateTimeFormatterService,
    protected notificationService: NotificationService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected volumeService: VolumeService,
    protected volumeTagService: VolumeTagService,
    private diskOfferingService: DiskOfferingService
  ) {
    super(volumeService, notificationService, route, router);
  }

  public changeDescription(newDescription: string): void {
    this.volumeTagService.setDescription(this.entity, newDescription)
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
          this.volumeTagService.getDescription(volume)
        );
      })
      .map(([volume, diskOfferings, description]) => {
        volume.diskOffering = diskOfferings.find(_ => _.id === volume.diskOfferingId);
        volume.description = description;
        return volume;
      });
  }
}
