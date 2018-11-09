import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { KeyboardLayout } from '../../types';

@Component({
  selector: 'cs-keyboards',
  templateUrl: 'keyboards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyboardsComponent {
  @Input()
  public keyboardLayout: KeyboardLayout;
  @Output()
  public keyboardChange = new EventEmitter<string>();

  public keyboardLayouts = [
    {
      value: KeyboardLayout.us,
      name: 'VM_PAGE.VM_CREATION.KB_US',
    },
    {
      value: KeyboardLayout.uk,
      name: 'VM_PAGE.VM_CREATION.KB_UK',
    },
    {
      value: KeyboardLayout.jp,
      name: 'VM_PAGE.VM_CREATION.KB_JP',
    },
    {
      value: KeyboardLayout.sc,
      name: 'VM_PAGE.VM_CREATION.KB_SC',
    },
  ];
}
