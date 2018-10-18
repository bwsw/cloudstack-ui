/* tslint:disable:use-input-property-decorator use-host-property-decorator no-attribute-parameter-decorator */
/* tslint:disable:variable-name */
import { Directionality } from '@angular/cdk/bidi';
import { ViewportRuler } from '@angular/cdk/overlay';
import {
  AfterContentInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  NgZone,
  Optional,
  Self,
  ViewEncapsulation,
} from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import {
  ErrorStateMatcher,
  MAT_OPTION_PARENT_COMPONENT,
  MAT_SELECT_SCROLL_STRATEGY,
  MatFormField,
  MatFormFieldControl,
  MatSelect,
  matSelectAnimations,
} from '@angular/material';
import { DragulaService } from 'ng2-dragula';
import * as uuid from 'uuid';

@Component({
  selector: 'cs-draggable-select',
  templateUrl: 'draggable-select.component.html',
  styleUrls: ['draggable-select.component.scss'],
  inputs: ['disabled', 'disableRipple', 'tabIndex'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  providers: [
    { provide: MatFormFieldControl, useExisting: DraggableSelectComponent },
    { provide: MAT_OPTION_PARENT_COMPONENT, useExisting: DraggableSelectComponent },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'listbox',
    '[attr.id]': 'id',
    '[attr.tabindex]': 'tabIndex',
    '[attr.aria-label]': '_ariaLabel',
    '[attr.aria-labelledby]': 'ariaLabelledby',
    '[attr.aria-required]': 'required.toString()',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.aria-invalid]': 'errorState',
    '[attr.aria-owns]': '_optionIds',
    '[attr.aria-multiselectable]': 'multiple',
    '[attr.aria-describedby]': '_ariaDescribedby || null',
    '[attr.aria-activedescendant]': '_getAriaActiveDescendant()',
    '[class.mat-select-disabled]': 'disabled',
    '[class.mat-select-invalid]': 'errorState',
    '[class.mat-select-required]': 'required',
    class: 'mat-select',
    '(keydown)': '_handleKeydown($event)',
    '(focus)': '_onFocus()',
    '(blur)': '_onBlur()',
  },
  animations: [matSelectAnimations.transformPanel, matSelectAnimations.fadeInContent],
})
export class DraggableSelectComponent extends MatSelect
  implements AfterContentInit, MatFormFieldControl<any> {
  @Input()
  public dragItems: any[];
  public bagId: string = uuid.v4();

  constructor(
    private dragula: DragulaService,
    _viewportRuler: ViewportRuler,
    _changeDetectorRef: ChangeDetectorRef,
    _ngZone: NgZone,
    _defaultErrorStateMatcher: ErrorStateMatcher,
    elementRef: ElementRef,
    @Optional() _dir: Directionality,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    @Optional() _parentFormField: MatFormField,
    @Self()
    @Optional()
    _control: NgControl,
    @Attribute('tabindex') tabIndex: string,
    @Inject(MAT_SELECT_SCROLL_STRATEGY) _scrollStrategyFactory,
  ) {
    super(
      _viewportRuler,
      _changeDetectorRef,
      _ngZone,
      _defaultErrorStateMatcher,
      elementRef,
      _dir,
      _parentForm,
      _parentFormGroup,
      _parentFormField,
      _control,
      tabIndex,
      _scrollStrategyFactory,
    );
  }

  public ngAfterContentInit(): void {
    super.ngAfterContentInit();
    this.dragula.dropModel.subscribe(() => setTimeout(() => (this as any)._propagateChanges()));
  }
}
