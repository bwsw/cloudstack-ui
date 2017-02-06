import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Template } from '../../../template/shared/';

@Component({
  selector: 'cs-vm-creation-template-dialog-list-element',
  templateUrl: 'vm-template-dialog-item.component.html',
  styleUrls: ['vm-template-dialog-item.component.scss']
})
export class VmTemplateDialogItemComponent {
  @Input() public radioOption: Template;
  @Input() public template: Template;
  @Output() public selected: EventEmitter<Template>;

  constructor() {
    this.selected = new EventEmitter<Template>();
  }

  public onSelect(): void {
    this.selected.emit(this.radioOption);
  }
}
