import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Volume } from '../../shared/models';
import { DiskOffering } from '../../shared/models/disk-offering.model';
import { VolumeType } from '../../shared/models/volume.model';
import { DateTimeFormatterService } from '../../shared/services/date-time-formatter.service';
import { DiskOfferingService } from '../../shared/services/disk-offering.service';
import { VolumeService } from '../../shared/services/volume.service';
import { ZoneService } from '../../shared/services/zone.service';
import { SpareDriveActionsService } from '../spare-drive-actions.service';
import { SpareDriveItem } from '../spare-drive-item';
import { VolumeTagService } from '../../shared/services/tags/volume-tag.service';


@Component({
  selector: 'cs-spare-drive-sidebar',
  templateUrl: 'spare-drive-sidebar.component.html'
})
export class SpareDriveSidebarComponent extends SpareDriveItem implements OnInit {
  @HostBinding('class.grid') public grid = true;
  public description: string;
  public item: Volume;

  constructor(
    public dateTimeFormatterService: DateTimeFormatterService,
    public spareDriveActionsService: SpareDriveActionsService,
    private route: ActivatedRoute,
    private volumeService: VolumeService,
    private volumeTagService: VolumeTagService,
    protected diskOfferingService: DiskOfferingService,
    protected zoneService: ZoneService
  ) {
    super(diskOfferingService, zoneService);
    this.route.params.pluck('id').subscribe((id: string) => this.loadVolume(id));
  }

  public ngOnInit(): void {
    Observable.merge(
      this.volumeService.onVolumeAttachment,
      this.volumeService.onVolumeResized,
      this.volumeService.onVolumeRemoved
    )
      .subscribe(() => this.loadVolume(this.item.id));
  }

  public changeDescription(newDescription: string): void {
    this.volumeTagService
      .setDescription(this.item, newDescription)
      .onErrorResumeNext()
      .subscribe();
  }

  private loadVolume(id: string): void {
    if (!id) {
      return
    }

    Observable.forkJoin(
      this.diskOfferingService.getList({ type: VolumeType.DATADISK }),
      this.volumeService.get(id)
    )
      .subscribe(([diskOfferings, volume]) => {
        this.volumeTagService.getDescription(volume)
          .subscribe(description => {
            this.setVolume(volume, diskOfferings, description);
            this.loadDiskOfferings();
          });
      });
  }

  private setVolume(volume: Volume, diskOfferings: Array<DiskOffering>, description: string): void {
    volume.diskOffering = diskOfferings.find(
      offering => offering.id === volume.diskOfferingId
    );
    this.item = volume;
    this.description = description;
  }
}
