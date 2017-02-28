import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Volume } from '../../shared/models/volume.model';

@Component({
  selector: 'cs-volume-list',
  templateUrl: 'volume-list.component.html',
  styleUrls: ['volume-list.component.scss']
})
export class VolumeListComponent {
  @Input() public volumes: Array<Volume>;
  @Input() public selectedVolume: Volume;
  @Output() public onVolumeSelected = new EventEmitter();
  @Output() public onDelete = new EventEmitter();

  public selectVolume(volume: Volume): void {
    this.selectedVolume = volume;
    this.onVolumeSelected.emit(this.selectedVolume);
  }

  public remove(volume: Volume): void {
    this.onDelete.emit(volume);
  }
}
