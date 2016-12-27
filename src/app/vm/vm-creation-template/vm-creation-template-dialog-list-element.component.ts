import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Template } from '../../shared/models';

@Component({
  selector: 'cs-vm-creation-template-dialog-list-element',
  templateUrl: 'vm-creation-template-dialog-list-element.component.html',
  styleUrls: ['vm-creation-template-dialog-list-element.component.scss']
})
export class VmCreationTemplateDialogListElementComponent {
  @Input() public template: Template;
  @Output() public selected: EventEmitter<string>;

  @Input() public radioOption: string;

  constructor() {
    this.selected = new EventEmitter<string>();
  }

  private onSelect() {
    this.selected.emit(this.radioOption);
  }
}
