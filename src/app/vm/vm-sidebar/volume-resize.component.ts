import { Component, Inject, HostListener } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';
import { Volume } from '../../shared/models/volume.model';
import { VolumeService } from '../../shared/services/volume.service';

@Component({
  selector: 'cs-volume-resize',
  templateUrl: 'volume-resize.component.html',
  styles: [':host mdl-textfield { width: 100% }']
})
export class VolumeResizeComponent {
  public newSize: string;
  public shrink: boolean;

  constructor(
    private dialog: MdlDialogReference,
    @Inject('volume') public volume: Volume,
    private volumeService: VolumeService
  ) { }

  public resizeVolume() {
    const volumeResizeObservable = this.volumeService.resize(this.volume.id, {
      size: +this.newSize,
      shrinkok: this.shrink
    });

    this.dialog.hide(volumeResizeObservable);
  }

  @HostListener('click', ['$event'])
  public onClick(e: Event) {
    e.stopPropagation();
  }
}
