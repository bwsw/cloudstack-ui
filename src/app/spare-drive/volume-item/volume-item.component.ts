import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Volume } from '../../shared/models/volume.model';

@Component({
  selector: 'cs-volume-item',
  templateUrl: 'volume-item.component.html',
  styleUrls: ['volume-item.component.scss']
})
export class VolumeItemComponent {
  @Input() public volume: Volume;
  @Output() public onClick = new EventEmitter();

  public handleClick(): void {
    this.onClick.emit(this.volume);
  }

  public attach(): void {}

  public resize(): void {}

  public remove(): void {}
}
