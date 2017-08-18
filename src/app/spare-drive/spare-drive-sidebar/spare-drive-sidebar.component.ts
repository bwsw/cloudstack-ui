import { Component, HostBinding, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Volume } from '../../shared/models';
import { VolumeTypes } from '../../shared/models/volume.model';
import { DateTimeFormatterService } from '../../shared/services/date-time-formatter.service';
import { DiskOfferingService } from '../../shared/services/disk-offering.service';
import { VolumeService } from '../../shared/services/volume.service';


@Component({
  selector: 'cs-spare-drive-sidebar',
  templateUrl: 'spare-drive-sidebar.component.html'
})
export class SpareDriveSidebarComponent {
  public description: string;
  public volumeNotFound: boolean;

  @Input() public volume: Volume;
  @HostBinding('class.grid') public grid = true;

  constructor(
    public dateTimeFormatterService: DateTimeFormatterService,
    private route: ActivatedRoute,
    private volumeService: VolumeService,
    private diskOfferingService: DiskOfferingService
  ) {
    this.volumeNotFound = false;
    this.route.params.pluck('id')
      .subscribe((id: string) => this.loadVolume(id));
  }

  public changeDescription(newDescription: string): void {
    this.volumeService
      .updateDescription(this.volume, newDescription)
      .onErrorResumeNext()
      .subscribe();
  }

  private loadVolume(id: string): void {
    Observable.forkJoin(
      this.diskOfferingService.getList({ type: VolumeTypes.DATADISK }),
      this.volumeService.get(id)
    )
      .subscribe(
        ([diskOfferings, volume]) => {
          this.volumeService.getDescription(volume)
            .subscribe(description => {
              volume.diskOffering = diskOfferings.find(
                offering => offering.id === volume.diskOfferingId
              );
              this.volume = volume;
              this.description = description;
            });
        },
        () => this.volumeNotFound = true
      );
  }
}
