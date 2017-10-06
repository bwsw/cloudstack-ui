import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MdMenuTrigger } from '@angular/material';

@Component({
  selector: 'cs-account-item',
  templateUrl: 'account-item.component.html',
  styleUrls: ['account-item.component.scss']
})
export class AccountItemComponent {
  @Input() public item: Account;
  @Input() public isSelected: (account) => boolean;
  @Output() public onClick = new EventEmitter<Account>();
  @Output() public onAccountChanged = new EventEmitter<Account>();
  @ViewChild(MdMenuTrigger) public mdMenuTrigger: MdMenuTrigger;

  public handleClick(e: MouseEvent): void {
    e.stopPropagation();
    if (!this.mdMenuTrigger.menuOpen) {
      this.onClick.emit(this.item);
    }
  }
}
