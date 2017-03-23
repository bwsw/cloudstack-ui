import { Component, Inject, HostListener, OnInit } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';

import { Volume, DiskStorageService } from '../../shared';


@Component({
  selector: 'cs-volume-resize',
  templateUrl: 'volume-resize.component.html',
  styleUrls: ['volume-resize.component.scss']
})
export class VolumeResizeComponent implements OnInit {
  public newSize: number;
  public maxSize: number;

  constructor(
    public dialog: MdlDialogReference,
    @Inject('volume') public volume: Volume,
    private diskStorageService: DiskStorageService
  ) {
    this.newSize = this.volume.size / Math.pow(2, 30);
    this.maxSize = 0; // to prevent mdl-slider from incorrect initial rendering
  }

  public ngOnInit(): void {
    this.diskStorageService.getAvailablePrimaryStorage()
      .subscribe((limit: number) => this.maxSize = limit);
  }

  public resizeVolume(): void {
    this.dialog.hide(this.newSize);
  }

  @HostListener('click', ['$event'])
  public onClick(e: Event): void {
    e.stopPropagation();
  }
}
