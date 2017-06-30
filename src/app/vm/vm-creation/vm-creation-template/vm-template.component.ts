import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../dialog/dialog-module/dialog.service';
import { BaseTemplateModel, Iso, Template, TemplateService } from '../../../template/shared';
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
export class VmTemplateComponent implements OnInit, ControlValueAccessor {
  @Input() public templates: Array<Template>;
  @Input() public isos: Array<Iso>;
  @Input() public zoneId: string;

  private _template: BaseTemplateModel;

  constructor(
    private dialogService: DialogService,
    private templateService: TemplateService
  ) {}

  public ngOnInit(): void {
    if (!this.template) {
      this.loadDefaultTemplate();
    }
  }

  public onClick(): void {
    this.showTemplateSelectionDialog().subscribe(template => {
      if (template) {
        this.template = template;
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

  private loadDefaultTemplate(): void {
    this.templateService.getDefault(this.zoneId)
      .subscribe(template => this.template = template);
  }

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
