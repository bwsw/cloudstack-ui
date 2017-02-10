import { Component, Inject, HostListener, OnInit } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';

import { Volume } from '../../shared/models/volume.model';
import { DiskStorageService, VolumeService } from '../../shared/services';

@Component({
  selector: 'cs-volume-resize',
  templateUrl: 'volume-resize.component.html',
  styles: [':host mdl-textfield { width: 100% }']
})
export class VolumeResizeComponent implements OnInit {
  public newSize: number;
  public maxSize: number;

  constructor(
    public dialog: MdlDialogReference,
    @Inject('volume') public volume: Volume,
    private volumeService: VolumeService,
    private diskStorageService: DiskStorageService
  ) {
    this.newSize = this.volume.size / Math.pow(2, 30);
    this.maxSize = 0; // to prevent mdl-slider from incorrect initial rendering
  }

  public ngOnInit(): void {
    this.diskStorageService.getAvailablePrimaryStorage()
      .subscribe((limit: number) => this.maxSize = limit);
  }

  public resizeVolume() {
    const volumeResizeObservable = this.volumeService.resize(this.volume.id, {
      size: this.newSize
    });

    this.dialog.hide(volumeResizeObservable);
  }

  @HostListener('click', ['$event'])
  public onClick(e: Event) {
    e.stopPropagation();
  }
}
