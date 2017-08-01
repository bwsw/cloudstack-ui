import { MdlPopoverComponent } from '@angular-mdl/popover';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Color } from '../../shared/models';
import { IVmAction, VirtualMachine } from '../shared/vm.model';
import { WebShellService } from '../web-shell/web-shell.service';
import { VmActionsService } from '../shared/vm-actions.service';


@Component({
  selector: 'cs-vm-list-item',
  templateUrl: 'vm-list-item.component.html',
  styleUrls: ['vm-list-item.component.scss']
})
export class VmListItemComponent implements OnInit, OnChanges {
  @Input() public item: VirtualMachine;
  @Input() public isSelected: (vm: VirtualMachine) => boolean;
  @Output() public onClick = new EventEmitter();
  @ViewChild(MdlPopoverComponent) public popoverComponent: MdlPopoverComponent;

  public actions: Array<IVmAction>;
  public color: Color;
  public gigabyte = Math.pow(2, 10); // to compare with RAM which is in megabytes

  constructor(public vmActionsService: VmActionsService) {}

  public ngOnInit(): void {
    this.updateColor();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName) && propName === 'isSelected') {
        this.isSelected = changes[propName].currentValue;
      }
    }
  }

  public handleClick(e: MouseEvent): void {
    e.stopPropagation();
    if (!this.popoverComponent.isVisible) {
      this.onClick.emit(this.item);
    } else {
      this.popoverComponent.hide();
    }
  }

  public togglePopover(event): void {
    event.stopPropagation();
    this.popoverComponent.toggle(event);
  }

  public getMemoryInMb(): string {
    return this.item.memory.toFixed(2);
  }

  public getMemoryInGb(): string {
    return (this.item.memory / this.gigabyte).toFixed(2);
  }

  private updateColor(): void {
    this.color = this.item.getColor();
  }
}
