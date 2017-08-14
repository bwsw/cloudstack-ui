import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Iso } from '../../../template/shared';


export const enum IsoEvent {
  isoAttach,
  isoDetach
}

@Component({
  selector: 'cs-iso',
  templateUrl: 'iso.component.html',
  styleUrls: ['iso.component.scss']
})
export class IsoComponent {
  @Input() public iso: Iso;
  @Input() public isoOperationInProgress: boolean;
  @Output() public onIsoAction = new EventEmitter<IsoEvent>();

  public attachIso(): void {
    this.onIsoAction.emit(IsoEvent.isoAttach);
  }

  public detachIso(): void {
    this.onIsoAction.emit(IsoEvent.isoDetach);
  }
}

