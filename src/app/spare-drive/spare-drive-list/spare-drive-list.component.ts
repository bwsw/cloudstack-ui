import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { ListService } from '../../shared/components/list/list.service';
import { Volume } from '../../shared/models';
import { VolumeAttachmentData, VolumeResizeData } from '../../shared/services';


@Component({
  selector: 'cs-spare-drive-list',
  templateUrl: 'spare-drive-list.component.html'
})
export class SpareDriveListComponent implements OnInit {
  @Input() public volumes: Array<Volume>;
  @Input() public selectedVolume: Volume;
  @Output() public onSelected = new EventEmitter();
  @Output() public onDelete = new EventEmitter();
  @Output() public onVolumeAttached = new EventEmitter();
  @Output() public onResize = new EventEmitter();

  constructor(private listService: ListService) {}

  public ngOnInit(): void {
    this.listService.onDeselected.subscribe(() => {
      this.selectedVolume = null;
    });
  }

  public selectVolume(volume: Volume): void {
    this.selectedVolume = volume;
    this.listService.onSelected.next(volume);
  }

  public remove(volume: Volume): void {
    this.onDelete.emit(volume);
  }

  public resize(data: VolumeResizeData): void {
    this.onResize.emit(data);
  }

  public attach(data: VolumeAttachmentData): void {
    this.onVolumeAttached.emit(data);
  }
}
