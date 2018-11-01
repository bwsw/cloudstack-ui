import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cs-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.scss'],
})
export class ListComponent {
  @Input()
  public isOpen = false;
  @Input()
  public creationEnabled = true;
  @Output()
  public action = new EventEmitter();
}
