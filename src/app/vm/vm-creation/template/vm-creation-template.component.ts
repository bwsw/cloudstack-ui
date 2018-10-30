import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseTemplateModel } from '../../../template/shared';
import { InstallationSourceDialogComponent } from './containers/installation-source-dialog.component';

@Component({
  selector: 'cs-vm-creation-template',
  templateUrl: 'vm-creation-template.component.html',
  styleUrls: ['vm-creation-template.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VmCreationTemplateComponent),
      multi: true,
    },
  ],
})
export class VmCreationTemplateComponent {
  @Input()
  public templates: BaseTemplateModel[];
  @Input()
  public numberOfTemplates: number;
  @Output()
  public changed = new EventEmitter<BaseTemplateModel>();

  // tslint:disable-next-line:variable-name
  private _template: BaseTemplateModel | null;

  constructor(private dialog: MatDialog, private translateService: TranslateService) {}

  public get templateName(): Observable<string> {
    if (!this.template) {
      return of('');
    }

    return this.translateService.get(['VM_PAGE.VM_CREATION.OS_TEMPLATE']).pipe(
      map(translations => {
        return `${translations['VM_PAGE.VM_CREATION.OS_TEMPLATE']}: ${this.template.name}`;
      }),
    );
  }

  public onClick(): void {
    this.showTemplateSelectionDialog().subscribe(template => {
      if (template) {
        this.template = template;
        this.changed.next(this.template);
      }
    });
  }

  public propagateChange: any = () => {};

  @Input()
  public get template(): BaseTemplateModel {
    return this._template;
  }

  public set template(template: BaseTemplateModel) {
    this._template = template;
    this.propagateChange(template);
  }

  public writeValue(template: BaseTemplateModel): void {
    if (template) {
      this.template = template;
    }
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {}

  private showTemplateSelectionDialog(): Observable<BaseTemplateModel> {
    return this.dialog
      .open(InstallationSourceDialogComponent, {
        width: '776px',
        data: {
          template: this.template,
        },
      })
      .afterClosed();
  }
}
