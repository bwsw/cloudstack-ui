import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

@Component({
  selector: 'cs-fab',
  templateUrl: 'fab.component.html',
  styleUrls: ['fab.component.scss'],
})
export class FabComponent {
  @Input()
  @HostBinding('class.open')
  public isOpen: boolean;
  @Output()
  public clicked = new EventEmitter<Event>();

  public onClick(e: Event): void {
    e.stopPropagation();
    this.clicked.emit(e);
  }
}
