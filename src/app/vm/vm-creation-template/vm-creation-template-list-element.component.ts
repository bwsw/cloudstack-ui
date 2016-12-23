import { Component, Input } from '@angular/core';
import { Template } from '../../shared/models';

@Component({
  selector: 'cs-vm-creation-template-list-element',
  templateUrl: 'vm-creation-template-list-element.component.html',
  styleUrls: ['vm-creation-template-list-element.component.scss']
})
export class VmCreationTemplateListElementComponent {
  @Input() public template: Template;
  private radioOption: any;

  constructor() {
    this.radioOption = false;
  }
}
