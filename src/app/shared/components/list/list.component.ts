import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'cs-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.scss']
})
export class ListComponent {
  @Output() onAction = new EventEmitter();
  @Input() isOpen = false;

  constructor() {
  }
}
