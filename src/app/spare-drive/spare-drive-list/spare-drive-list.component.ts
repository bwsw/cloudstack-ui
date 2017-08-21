import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ListService } from '../../shared/components/list/list.service';
import { Volume } from '../../shared/models';
import {
  VolumeAttachmentData,
  VolumeResizeData
} from '../../shared/services/volume.service';
import { SpareDriveItemComponent } from '../spare-drive-item/spare-drive-item.component';


@Component({
  selector: 'cs-spare-drive-list',
  templateUrl: 'spare-drive-list.component.html'
})
export class SpareDriveListComponent {
  @Input() public volumes: Array<Volume>;
  @Input() public groupings: Array<any>;
  @Output() public onDelete = new EventEmitter();
  @Output() public onVolumeAttached = new EventEmitter();
  @Output() public onResize = new EventEmitter();
  public inputs;
  public outputs;

  public SpareDriveItemComponent = SpareDriveItemComponent;

  constructor(public listService: ListService) {
    this.inputs = {
      isSelected: (item: Volume) => this.listService.isSelected(item.id)
    };

    this.outputs = {
      onClick: this.selectVolume.bind(this),
      onVolumeAttached: this.attach.bind(this),
      onDelete: this.remove.bind(this),
      onResize: this.resize.bind(this)
    };
  }

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
