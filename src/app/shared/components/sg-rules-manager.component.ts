import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { SgCreationComponent, Rules } from '../../security-group/sg-creation/sg-creation.component';
import { DialogService } from '../../dialog/dialog-module/dialog.service';


@Component({
  selector: 'cs-security-group-rules-manager',
  templateUrl: 'sg-rules-manager.component.html',
  styleUrls: ['sg-rules-manager.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SgRulesManagerComponent),
      multi: true
    }
  ]
})
export class SgRulesManagerComponent implements OnInit, ControlValueAccessor {
  @Input() public mode: 'create' | 'edit';
  public savedRules: Rules;

  private _rules: Rules;

  constructor(private dialogService: DialogService) {
    this.savedRules = new Rules();
  }

  public ngOnInit(): void {
    if (!this.mode) {
      this.mode = 'create';
    }
  }

  public propagateChange: any = () => {};

  @Input()
  public get rules(): Rules {
    return this._rules;
  }

  public set rules(value) {
    this._rules = value;
    this.propagateChange(value);
  }

  public writeValue(value): void {
    this.updateRules(value);
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void { }

  public showDialog(): void {
    this.dialogService.showCustomDialog({
      component: SgCreationComponent,
      classes: 'sg-creation-dialog',
      providers: [{ provide: 'rules', useValue: this.savedRules }]
    })
      .switchMap(res => res.onHide())
      .subscribe((data: any) => {
        this.onDialogHide(data);
      });
  }

  private onDialogHide(data?): void {
    this.updateRules(data);
  }

  private updateRules(rules?): void {
    if (!rules) {
      return;
    }

    this.savedRules = rules;

    const temp = Object.assign({}, rules);
    delete temp.templates;
    this.rules = temp;
  }
}

