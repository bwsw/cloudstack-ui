import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Iso } from '../../../template/shared';


@Component({
  selector: 'cs-iso',
  templateUrl: 'iso.component.html',
  styleUrls: ['iso.component.scss']
})
export class IsoComponent {
  @Input() public iso: Iso;
  @Output() public onIsoAction = new EventEmitter<IsoEvent>();

  public attachIso(): void {
    this.onIsoAction.emit(IsoEvent.isoAttach);
  }

  public detachIso(): void {
    this.onIsoAction.emit(IsoEvent.isoDetach);
  }
}

export const enum IsoEvent {
  isoAttach,
  isoDetach
}
