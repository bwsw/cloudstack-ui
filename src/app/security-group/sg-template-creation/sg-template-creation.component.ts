import { Component } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';

@Component({
  selector: 'cs-security-group-template-creation',
  templateUrl: 'sg-template-creation.component.html',
  styleUrls: ['sg-template-creation.component.scss']
})
export class SgTemplateCreationComponent {
  public name: string;
  public description: string;

  constructor(public dialog: MdlDialogReference) {
    this.name = '';
    this.description = '';
  }

  public onSubmit(e: Event): void {
    e.preventDefault();
    this.dialog.hide({
      name: this.name,
      description: this.description,
    });
  }
}
