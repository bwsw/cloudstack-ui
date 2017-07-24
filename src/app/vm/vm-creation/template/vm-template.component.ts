import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../dialog/dialog-module/dialog.service';
import { BaseTemplateModel, Iso, Template } from '../../../template/shared';
import { ISOS, PRESELECTED_TEMPLATE_TOKEN, TEMPLATES, ZONE } from './injector-token';
import { VmTemplateDialogComponent } from './vm-template-dialog.component';


@Component({
  selector: 'cs-vm-creation-template',
  templateUrl: 'vm-template.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VmTemplateComponent),
      multi: true
    }
  ]
})
export class VmTemplateComponent {
  @Input() public templates: Array<Template>;
  @Input() public isos: Array<Iso>;
  @Input() public zoneId: string;
  @Output() public change: EventEmitter<BaseTemplateModel>;

  private _template: BaseTemplateModel;

  constructor(private dialogService: DialogService) {
    this.change = new EventEmitter();
  }

  public onClick(): void {
    this.showTemplateSelectionDialog()
      .subscribe(template => {
        if (template) {
          this.template = template;
          this.change.next(this.template);
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
    return this.dialogService.showCustomDialog({
      component: VmTemplateDialogComponent,
      classes: 'vm-template-dialog',
      providers: [
        { provide: PRESELECTED_TEMPLATE_TOKEN, useValue: this.template },
        { provide: TEMPLATES, useValue: this.templates },
        { provide: ISOS, useValue: this.isos },
        { provide: ZONE, useValue: this.zoneId }
      ],
    })
      .switchMap(res => res.onHide());
  }
}
