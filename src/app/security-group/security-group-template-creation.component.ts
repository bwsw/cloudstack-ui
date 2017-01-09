import { Component } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';

@Component({
  selector: 'cs-security-group-template-creation',
  templateUrl: './security-group-template-creation.component.html'
})
export class SecurityGroupTemplateCreationComponent {
  private name: string;
  private description: string;
  private labels: string;

  constructor(private dialog: MdlDialogReference) {
    this.name = '';
    this.description = '';
    this.labels = '';
  }

  public onSubmit(e: Event) {
    e.preventDefault();
    this.dialog.hide({
      name: this.name,
      description: this.description,
      labels: this.labels
    });
  }
}
