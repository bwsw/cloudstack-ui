import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cs-create-volume-from-snapshot',
  templateUrl: './create-volume.component.html',
})
export class CreateVolumeFromSnapshotComponent {
  public name: string;

  @Input()
  isLoading: boolean;
  @Output()
  public volumeCreate = new EventEmitter<string>();

  public onSubmit() {
    this.volumeCreate.emit(this.name);
  }
}
