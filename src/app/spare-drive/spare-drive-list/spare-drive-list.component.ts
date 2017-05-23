import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ListService } from '../../shared/components/list/list.service';
import { Volume } from '../../shared/models';
import { VolumeAttachmentData, VolumeResizeData } from '../../shared/services';


@Component({
  selector: 'cs-spare-drive-list',
  templateUrl: 'spare-drive-list.component.html'
})
export class SpareDriveListComponent {
  @Input() public volumes: Array<Volume>;
  @Output() public onDelete = new EventEmitter();
  @Output() public onVolumeAttached = new EventEmitter();
  @Output() public onResize = new EventEmitter();

  constructor(public listService: ListService) {}

  public selectVolume(volume: Volume): void {
    this.listService.showDetails(volume.id);
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
