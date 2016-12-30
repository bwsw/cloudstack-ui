import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdlDialogService, MdlDialogReference } from 'angular2-mdl';
import { SecurityGroupCreationComponent, IRules } from './security-group-creation.component';
import { SecurityGroupService } from './security-group.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'cs-security-group-rules-manager',
  templateUrl: './security-group-rules-manager.component.html',
  styleUrls: ['./security-group-rules-manager.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SecurityGroupRulesManagerComponent),
      multi: true
    }
  ]
})
export class SecurityGroupRulesManagerComponent implements OnInit, ControlValueAccessor {
  @Input() public mode: 'create' | 'edit';
  public savedRules: IRules;

  private _rules;
  private dialogObservable: Observable<MdlDialogReference>;

  constructor(private dialogService: MdlDialogService) {
    this.savedRules = {
      templates: [],
      ingress: [],
      egress: []
    };
  }

  public ngOnInit() {
    if (!this.mode) {
      this.mode = 'create';
    }
  }

  public propagateChange: any = () => {};

  @Input()
  public get rules() {
    return this._rules;
  }

  public set rules(value) {
    this._rules = value;
    this.propagateChange(value);
  }

  public writeValue(value) {
    if (value) {
      this.rules = value;
    }
  }

  public registerOnChange(fn) {
    this.propagateChange = fn;
  }

  public registerOnTouched() { }

  public showDialog() {
    this.dialogObservable = this.dialogService.showCustomDialog({
      component: SecurityGroupCreationComponent,
      providers: [SecurityGroupService, { provide: 'rules', useValue: this.savedRules }],
      isModal: true,
      styles: { 'width': '800px' },
      clickOutsideToClose: true,
      enterTransitionDuration: 400,
      leaveTransitionDuration: 400
    });

    this.dialogObservable
      .switchMap(res => res.onHide())
      .subscribe((data: any) => {
        this.onDialogHide(data);
      });
  }

  private onDialogHide(data?) {
    this.updateRules(data);
  }

  private updateRules(rules?) {
    if (!rules) {
      return;
    }

    this.savedRules = rules;

    const temp = Object.assign({}, rules);
    delete temp.templates;
    this.rules = temp;
  }
}

