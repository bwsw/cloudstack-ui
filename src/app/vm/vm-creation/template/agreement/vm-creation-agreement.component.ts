import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

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
    this.templateTagService.getAgreement(this.template).subscribe(path => {
      let langPath;
      if (this.lang !== 'en') {
        langPath = `${path.substring(0, path.length - 3)}-${this.lang}.md`;
      }

      this.fileRequest(langPath ? langPath : path)
        .catch(error => {
          this.fileRequest(path)
            .subscribe(agreement => this.agreement = agreement);
          return Observable.throw(error);
        })
        .subscribe(agreement => {
          this.agreement = agreement;
        })
    });
  }

  private fileRequest(path): Observable<any> {
    return this.http.get(path)
      .map(response => response.text())
      .map(text => {
        const converter = new Converter();
        return converter.makeHtml(text);
      })
  }
}
