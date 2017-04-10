import { Component, HostBinding, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cs-fab',
  templateUrl: 'fab.component.html',
  styleUrls: ['fab.component.scss']
})
export class FabComponent {
  @Input() @HostBinding('class.open') public isOpen: boolean;
  @Output() public click = new EventEmitter<Event>();

  public onClick(e: Event): void {
    e.stopPropagation();
    this.click.emit(e);
  }
}
