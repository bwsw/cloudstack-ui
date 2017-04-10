import { Component } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';


@Component({
  selector: 'cs-ssh-key-creation-dialog',
  templateUrl: 'ssh-key-creation-dialog.component.html',
  styleUrls: ['ssh-key-creation-dialog.component.scss']
})
export class SShKeyCreationDialogComponent {
  public name: string;
  public publicKey: string;

  constructor(public dialog: MdlDialogReference) { }

  public onSubmit(e): void {
    e.preventDefault();
    this.dialog.hide({
      name: this.name,
      publicKey: this.publicKey
    });
  }
}
