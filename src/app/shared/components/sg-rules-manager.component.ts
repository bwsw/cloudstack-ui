import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdDialog } from '@angular/material';

import { Rules, SgCreationComponent } from '../../security-group/sg-creation/sg-creation.component';


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
  @Input() public header = 'VM_CREATION_FORM.SECURITY_GROUPS';
  public savedRules: Rules;

  private _rules: Rules;

  constructor(private dialog: MdDialog) {
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

  public set rules(value: Rules) {
    this._rules = value;
    this.propagateChange(value);
  }

  public writeValue(value: Rules): void {
    this.updateRules(value);
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void { }

  public showDialog(): void {
    this.dialog.open(SgCreationComponent, {
      panelClass: 'sg-creation-dialog',
      data: this.savedRules
    })
      .afterClosed()
      .subscribe((data: any) => {
        this.onDialogHide(data);
      });
  }

  private onDialogHide(data?: Rules): void {
    this.updateRules(data);
  }

  private updateRules(rules?): void {
    if (!rules) {
      return;
    }

    this.savedRules = rules;
    this.rules = this.savedRules;
  }
}

