import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { BaseTemplateModel, Iso, Template } from '../../../template/shared';
import { VmTemplateDialogComponent } from './vm-template-dialog.component';


@Component({
  selector: 'cs-vm-creation-template',
  templateUrl: 'vm-template.component.html',
  styleUrls: ['vm-template.component.scss'],
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

  constructor(private dialog: MdDialog) {
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
    return this.dialog.open(VmTemplateDialogComponent, {
      width: '780px',
      data: {
        template: this.template,
        templates: this.templates,
        isos: this.isos,
        zoneId: this.zoneId
      },
    })
      .afterClosed();
  }
}
