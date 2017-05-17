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
            volume.diskOffering = diskOfferings.find(
              offering => offering.id === volume.diskOfferingId
            );
            this.volume = volume;
          });
        }
    });
  }
}
