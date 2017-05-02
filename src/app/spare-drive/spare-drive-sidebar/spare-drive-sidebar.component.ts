import { Component, Input, HostBinding, OnChanges } from '@angular/core';
import { Volume } from '../../shared/models/volume.model';
import { VolumeService } from '../../shared/services/volume.service';


@Component({
  selector: 'cs-spare-drive-sidebar',
  templateUrl: 'spare-drive-sidebar.component.html'
})
export class SpareDriveSidebarComponent implements OnChanges {
  public description: string;

  @Input() public volume: Volume;
  @HostBinding('class.grid') public grid = true;

  constructor(private volumeService: VolumeService) {}

  public ngOnChanges(): void {
    if (this.volume) {
      this.volumeService.getDescription(this.volume)
        .subscribe(description => this.description = description);
    }
  }

  public changeDescription(newDescription: string): void {
    this.volumeService
      .updateDescription(this.volume, newDescription)
      .onErrorResumeNext()
      .subscribe();
  }
}
