import { Component, EventEmitter, Input, Output } from '@angular/core';

export enum KeyboardLayout {
  us = 'us',
  uk = 'uk',
  jp = 'jp',
  sc = 'sc'
}

@Component({
  selector: 'cs-keyboards',
  templateUrl: 'keyboards.component.html',
})
export class KeyboardsComponent {
  @Input() public keyboardLayout: KeyboardLayout;
  @Output() public keyboardChange = new EventEmitter<string>();

  public keyboardLayouts = [
    {
      value: KeyboardLayout.us,
      name: 'VM_PAGE.VM_CREATION.KB_US'
    },
    {
      value: KeyboardLayout.uk,
      name: 'VM_PAGE.VM_CREATION.KB_UK'
    },
    {
      value: KeyboardLayout.jp,
      name: 'VM_PAGE.VM_CREATION.KB_JP'
    },
    {
      value: KeyboardLayout.sc,
      name: 'VM_PAGE.VM_CREATION.KB_SC'
    }
  ];
}
