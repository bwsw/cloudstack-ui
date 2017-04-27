import { Component, Inject, OnInit } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';


export class SShFormData {
  constructor(
    public name = '',
    public publicKey = '',
  ) {}
}

@Component({
  selector: 'cs-ssh-key-creation-dialog',
  templateUrl: 'ssh-key-creation-dialog.component.html',
  styleUrls: ['ssh-key-creation-dialog.component.scss']
})
export class SShKeyCreationDialogComponent implements OnInit {
  public sshFormData: SShFormData;

  constructor(
    public dialog: MdlDialogReference,
    @Inject('formData') public formData: SShFormData
  ) {}

  public ngOnInit(): void {
    this.sshFormData = this.formData || new SShFormData();
  }

  public onSubmit(e): void {
    e.preventDefault();
    this.dialog.hide(this.sshFormData);
  }
}
