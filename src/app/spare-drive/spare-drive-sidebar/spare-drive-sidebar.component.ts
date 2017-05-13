import { Component, Input, HostBinding } from '@angular/core';
import { Volume } from '../../shared/models';
import { ActivatedRoute } from '@angular/router';
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
    private volumeService: VolumeService
  ) {
    this.route.params.pluck('id')
      .subscribe((id: string) => {
        if (id) {
        this.volumeService.get(id)
          .subscribe(vm => this.volume = vm);
      }
    });
  }
}
