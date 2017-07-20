import * as uuid from 'uuid';
import { Directionality } from '@angular/cdk';
import {
  AfterContentInit,
  Attribute,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  Optional,
  Renderer2,
  Self,
  ViewEncapsulation
} from '@angular/core';
import { NgControl } from '@angular/forms';
import {
  fadeInContent,
  MD_PLACEHOLDER_GLOBAL_OPTIONS,
  MdSelect,
  PlaceholderOptions,
  transformPanel,
  transformPlaceholder,
  ViewportRuler
} from '@angular/material';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'cs-draggable-select',
  templateUrl: 'draggable-select.component.html',
  styleUrls: ['draggable-select.component.scss'],
  inputs: ['color', 'disabled'], // tslint:disable-line
  encapsulation: ViewEncapsulation.None,
  host: { // tslint:disable-line
    'role': 'listbox',
    '[attr.tabindex]': 'tabIndex',
    '[attr.aria-label]': '_ariaLabel',
    '[attr.aria-labelledby]': 'ariaLabelledby',
    '[attr.aria-required]': 'required.toString()',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.aria-invalid]': '_control?.invalid || "false"',
    '[attr.aria-owns]': '_optionIds',
    '[class.mat-select-disabled]': 'disabled',
    'class': 'mat-select',
    '[class.draggable-select]': 'true',
    '(keydown)': '_handleClosedKeydown($event)',
    '(blur)': '_onBlur()',
  },
  animations: [
    transformPlaceholder,
    transformPanel,
    fadeInContent
  ]
})
export class DraggableSelectComponent extends MdSelect implements AfterContentInit {
  @Input() public dragItems: Array<any>;
  public bagId: string = uuid.v4();

  constructor(
    private dragula: DragulaService,
    _viewportRuler: ViewportRuler,
    _changeDetectorRef: ChangeDetectorRef,
    renderer: Renderer2,
    elementRef: ElementRef,
    @Optional() _dir: Directionality,
    @Self() @Optional() _control: NgControl,
    @Attribute('tabindex') tabIndex: string,
    @Optional() @Inject(MD_PLACEHOLDER_GLOBAL_OPTIONS) placeholderOptions: PlaceholderOptions
  ) {
    super(
      _viewportRuler,
      _changeDetectorRef,
      renderer,
      elementRef,
      _dir,
      _control,
      tabIndex,
      placeholderOptions
    );
  }

  public ngAfterContentInit(): void {
    super.ngAfterContentInit();
    this.dragula.dropModel.subscribe(() =>
      setTimeout(() => (this as any)._propagateChanges())
    );
  }
}
