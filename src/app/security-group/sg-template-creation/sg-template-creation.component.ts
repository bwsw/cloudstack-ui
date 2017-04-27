import { Component, Inject, OnInit } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';


export class SgTemplateFormData {
  constructor(
    public name = '',
    public description = ''
  ) {}
}

@Component({
  selector: 'cs-security-group-template-creation',
  templateUrl: 'sg-template-creation.component.html',
  styleUrls: ['sg-template-creation.component.scss']
})
export class SgTemplateCreationComponent implements OnInit {
  public sgTemplateFormData: SgTemplateFormData;

  constructor(
    public dialog: MdlDialogReference,
    @Inject('formData') public formData: SgTemplateFormData
  ) {}

  public ngOnInit(): void {
    this.sgTemplateFormData = this.formData || new SgTemplateFormData();
  }

  public onSubmit(e: Event): void {
    e.preventDefault();
    this.dialog.hide(this.sgTemplateFormData);
  }
}
