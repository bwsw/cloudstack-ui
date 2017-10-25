import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { BaseTemplateModel, Iso, Template } from '../../../template/shared';
import { VmTemplateDialogComponent } from './vm-template-dialog.component';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'cs-vm-creation-template',
  templateUrl: 'vm-creation-template.component.html',
  styleUrls: ['vm-creation-template.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VmCreationTemplateComponent),
      multi: true
    }
  ]
})
export class VmCreationTemplateComponent implements OnChanges {
  @Input() public templates: Array<Template>;
  @Input() public isos: Array<Iso>;
  @Input() public zoneId: string;
  @Output() public change: EventEmitter<BaseTemplateModel>;

  private _template: BaseTemplateModel | null;

  constructor(private dialog: MatDialog, private translateService: TranslateService) {
    this.change = new EventEmitter();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.templates || changes.isos) {
      if (!this.templates.length && !this.isos.length) {
        this.template = null;
      }
    }
  }

  public get templateName(): Observable<string> {
    if (!this.template) {
      return Observable.of('');
    }

    return this.translateService.get(['VM_PAGE.VM_CREATION.OS_TEMPLATE'])
      .map(translations => {
        return `${translations['VM_PAGE.VM_CREATION.OS_TEMPLATE']}: ${this.template.name}`;
      });
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
