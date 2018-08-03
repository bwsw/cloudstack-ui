import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { HttpClient } from '@angular/common/http';

import { Converter } from 'showdown';
import { TemplateTagService } from '../../../../shared/services/tags/template-tag.service';
import { BaseTemplateModel } from '../../../../template/shared/base-template.model';
import { UserTagService } from '../../../../shared/services/tags/user-tag.service';


@Component({
  selector: 'cs-vm-creation-template-agreement',
  templateUrl: 'vm-creation-agreement.component.html',
  styles: [`
    .agreement-wrapper {
      max-height: 70vh;
      overflow-y: auto;
    }
  `]
})
export class VmCreationAgreementComponent implements OnInit {
  private _agreement: string;
  private template: BaseTemplateModel;

  public get agreement(): string {
    return this._agreement;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<VmCreationAgreementComponent>,
    private http: HttpClient,
    private templateTagService: TemplateTagService,
    private userTagService: UserTagService
  ) {
    this.template = data;
  }

  public ngOnInit() {
    this.readFile();
  }

  public onCancel() {
    this.dialogRef.close();
  }

  public onAgree() {
    this.dialogRef.close(true);
  }

  protected readFile() {
    this.userTagService.getLang()
      .switchMap(res => this.templateTagService.getAgreement(this.template, res))
      .switchMap(path => this.http.get(path, { responseType: 'text' }))
      .map(text => {
        const converter = new Converter();
        return converter.makeHtml(text);
      })
      .subscribe(agreement => {
        this._agreement = agreement;
      });
  }
}
