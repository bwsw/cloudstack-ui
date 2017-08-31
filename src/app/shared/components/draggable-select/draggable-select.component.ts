import { Directionality } from '@angular/cdk/bidi';
import { Overlay } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import {
  AfterContentInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Renderer2,
  Self,
  ViewEncapsulation
} from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import {
  fadeInContent,
  MD_PLACEHOLDER_GLOBAL_OPTIONS,
  MD_SELECT_SCROLL_STRATEGY,
  MdSelect,
  PlaceholderOptions,
  transformPanel,
  transformPlaceholder,
  ViewportRuler
} from '@angular/material';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs/Subscription';
import * as uuid from 'uuid';

@Component({
  selector: 'cs-draggable-select',
  templateUrl: 'draggable-select.component.html',
  styleUrls: ['draggable-select.component.scss'],
  inputs: ['color', 'disabled'], // tslint:disable-line
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { // tslint:disable-line
    'role': 'listbox',
    '[attr.tabindex]': 'tabIndex',
    '[attr.aria-label]': '_ariaLabel',
    '[attr.aria-labelledby]': 'ariaLabelledby',
    '[attr.aria-required]': 'required.toString()',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.aria-invalid]': '_isErrorState()',
    '[attr.aria-owns]': '_optionIds',
    '[attr.aria-multiselectable]': 'multiple',
    '[class.mat-select-disabled]': 'disabled',
    '[class.mat-select-invalid]': '_isErrorState()',
    '[class.mat-select-required]': 'required',
    'class': 'mat-select',
    '(keydown)': '_handleClosedKeydown($event)',
    '(blur)': '_onBlur()',
  },
  animations: [
    transformPlaceholder,
    transformPanel,
    fadeInContent
  ]
})
export class DraggableSelectComponent extends MdSelect implements AfterContentInit, OnDestroy {
  @Input() public dragItems: Array<any>;
  public bagId: string = uuid.v4();

  private onDrop: Subscription;

  constructor(
    private dragula: DragulaService,
    _viewportRuler: ViewportRuler,
    _changeDetectorRef: ChangeDetectorRef,
    _overlay: Overlay,
    _platform: Platform,
    renderer: Renderer2,
    elementRef: ElementRef,
    @Optional() _dir: Directionality,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    @Self() @Optional() _control: NgControl,
    @Attribute('tabindex') tabIndex: string,
    @Optional() @Inject(MD_PLACEHOLDER_GLOBAL_OPTIONS) placeholderOptions: PlaceholderOptions,
    @Inject(MD_SELECT_SCROLL_STRATEGY) _scrollStrategyFactory
  ) {
    super(
      _viewportRuler,
      _changeDetectorRef,
      _overlay,
      _platform,
      renderer,
      elementRef,
      _dir,
      _parentForm,
      _parentFormGroup,
      _control,
      tabIndex,
      placeholderOptions,
      _scrollStrategyFactory
    );
  }

  public ngAfterContentInit(): void {
    super.ngAfterContentInit();
    this.dragula.dropModel.subscribe(() =>
      setTimeout(() => (this as any)._propagateChanges())
    );
  }

  public ngOnDestroy(): void {
    if (this.onDrop) {
      this.onDrop.unsubscribe();
    }
  }
}
