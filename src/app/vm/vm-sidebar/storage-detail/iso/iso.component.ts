import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Iso } from '../../../../template/shared/iso.model';

export const enum IsoEvent {
  isoAttach,
  isoDetach,
}

@Component({
  selector: 'cs-iso',
  templateUrl: 'iso.component.html',
  styleUrls: ['iso.component.scss'],
})
export class IsoComponent {
  @Input()
  public iso: Iso;
  @Output()
  public isoAction = new EventEmitter<IsoEvent>();

  public attachIso(): void {
    this.isoAction.emit(IsoEvent.isoAttach);
  }

  public detachIso(): void {
    this.isoAction.emit(IsoEvent.isoDetach);
  }
}
