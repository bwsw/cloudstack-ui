import { Component, EventEmitter, Input, Output } from '@angular/core';

export const listScrollContainerId = 'list-scroll-container';

@Component({
  selector: 'cs-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.scss'],
})
export class ListComponent {
  @Input()
  isOpen = false;
  @Input()
  creationEnabled = true;
  @Output()
  action = new EventEmitter();
}
