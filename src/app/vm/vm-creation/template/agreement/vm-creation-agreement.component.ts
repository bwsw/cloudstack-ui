import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Http } from '@angular/http';

import { Converter } from 'showdown';
import { TemplateTagService } from '../../../../shared/services/tags/template-tag.service';
import { BaseTemplateModel } from '../../../../template/shared/base-template.model';
import { UserTagService } from '../../../../shared/services/tags/user-tag.service';


@Component({
  selector: 'cs-vm-creation-template-agreement',
  templateUrl: 'vm-creation-agreement.component.html'
})
export class VmCreationAgreementComponent implements OnInit {
  private agreement: string;
  private template: BaseTemplateModel;
  private lang: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<VmCreationAgreementComponent>,
    private http: Http,
    private templateTagService: TemplateTagService,
    private userTagService: UserTagService
  ) {
    this.template = data;
  }

  public ngOnInit() {
    this.userTagService.getLang().subscribe(res => this.lang = res);
    this.readFile();
  }

  public onCancel() {
    this.dialogRef.close();
  }

  public onAgree() {
    this.dialogRef.close(true);
  }

  protected readFile() {
    this.templateTagService.getAgreement(this.template, this.lang).subscribe(path => {
      return this.http.get(path)
        .map(response => response.text())
        .map(text => {
          const converter = new Converter();
          return converter.makeHtml(text);
        })
        .subscribe(agreement => {
          this.agreement = agreement;
        })
    });
  }
}
