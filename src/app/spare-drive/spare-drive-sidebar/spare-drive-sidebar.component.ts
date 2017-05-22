import { Component, HostBinding, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Volume } from '../../shared/models';
import { VolumeTypes } from '../../shared/models/volume.model';
import { DiskOfferingService } from '../../shared/services/disk-offering.service';
import { VolumeService } from '../../shared/services/volume.service';


@Component({
  selector: 'cs-spare-drive-sidebar',
  templateUrl: 'spare-drive-sidebar.component.html'
})
export class SpareDriveSidebarComponent {
  public description: string;

  @Input() public volume: Volume;
  @HostBinding('class.grid') public grid = true;

  constructor(
    private route: ActivatedRoute,
    private volumeService: VolumeService,
    private diskOfferingService: DiskOfferingService
  ) {
    this.route.params.pluck('id')
      .subscribe((id: string) => {
        if (id) {
          Observable.forkJoin(
            this.diskOfferingService.getList({ type: VolumeTypes.DATADISK }),
            this.volumeService.get(id)
          ).subscribe(([diskOfferings, volume]) => {
            this.volumeService.getDescription(volume)
              .subscribe(description => {
                volume.diskOffering = diskOfferings.find(
                  offering => offering.id === volume.diskOfferingId
                );
                this.volume = volume;
                this.description = description;
              });
          });
        }
    });
  }

  public changeDescription(newDescription: string): void {
    this.volumeService
      .updateDescription(this.volume, newDescription)
      .onErrorResumeNext()
      .subscribe();
  }
}
