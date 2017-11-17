import { Store } from '@ngrx/store';
import { State } from '../../../../reducers/index';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BaseTemplateModel } from '../../../../template/shared/base-template.model';
import * as fromTemplates from '../../../../template/redux/template.reducers';
import * as templateActions from '../../../../template/redux/template.actions';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'cs-vm-creation-template-dialog-container',
  template: `
    <cs-vm-creation-template-dialog
      [templates]="templates$ | async"
      [preselectedTemplate]="preselectedTemplate"
      (close)="onClose($event)"
    ></cs-vm-creation-template-dialog>`
})
export class VmTemplateDialogContainerComponent implements OnInit, AfterViewInit {
  public templates$ = this.store.select(fromTemplates.selectTemplatesForVmCreation);
  public zoneId: string;
  public preselectedTemplate: BaseTemplateModel;

  constructor(
    private store: Store<State>,
    private dialogRef: MatDialogRef<VmTemplateDialogContainerComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private cd: ChangeDetectorRef
  ) {
    this.zoneId = data.zoneId;
    this.preselectedTemplate = data.template;
  }

  public ngOnInit() {

    this.store.dispatch(new templateActions.LoadTemplatesRequest());
    //
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public onClose(template: BaseTemplateModel) {
    this.dialogRef.close(template);
  }
}
