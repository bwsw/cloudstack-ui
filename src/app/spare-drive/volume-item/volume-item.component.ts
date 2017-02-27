import { Component, Input, EventEmitter, Output, HostBinding } from '@angular/core';
import { Volume } from '../../shared/models/volume.model';

@Component({
  selector: 'cs-volume-item',
  templateUrl: 'volume-item.component.html',
  styleUrls: ['volume-item.component.scss']
})
export class VolumeItemComponent {
  @Input() public isSelected: boolean;
  @Input() public volume: Volume;
  @Output() public onClick = new EventEmitter();
  @Output() public onDelete = new EventEmitter();
  @HostBinding('class.grid') public grid = true;

  public handleClick(): void {
    this.onClick.emit(this.volume);
  }

  public attach(): void {}

  public resize(): void {}

  public remove(): void {
    this.onDelete.next(this.volume);
  }
}
