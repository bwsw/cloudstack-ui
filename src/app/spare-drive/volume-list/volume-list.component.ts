import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Volume } from '../../shared/models/volume.model';

@Component({
  selector: 'cs-volume-list',
  templateUrl: 'volume-list.component.html',
  styleUrls: ['volume-list.component.scss']
})
export class VolumeListComponent {
  @Input() public volumes: Array<Volume>;
  @Output() public onVolumeSelected = new EventEmitter();

  public selectVolume(volume: Volume): void {
    this.onVolumeSelected.emit(volume);
  }
}
