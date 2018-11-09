import { Component, EventEmitter, Input, Output } from '@angular/core';

export const listScrollContainerId = 'list-scroll-container';

@Component({
  selector: 'cs-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.scss'],
})
export class ListComponent {
  @Input()
  public creationEnabled = true;
  @Output()
  public action = new EventEmitter();
}
