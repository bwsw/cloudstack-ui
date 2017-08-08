import { MdlPopoverComponent } from '@angular-mdl/popover';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Color } from '../../shared/models';
import { VirtualMachine } from '../shared/vm.model';
import { VmActionsService } from '../shared/vm-actions.service';
import { VirtualMachineAction } from '../vm-actions/vm-action';
import { VmTagService } from '../../shared/services/tags/vm-tag.service';


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

  public firstRowActions: Array<VirtualMachineAction>;
  public secondRowActions: Array<VirtualMachineAction>;

  public color: Color;
  public gigabyte = Math.pow(2, 10); // to compare with RAM which is in megabytes

  constructor(
    public vmActionsService: VmActionsService,
    private vmTagService: VmTagService
  ) {
    this.firstRowActions = this.vmActionsService.actions.slice(0, 7);
    this.secondRowActions = this.vmActionsService.actions.slice(7, 8);
  }

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

  public onAction(action: VirtualMachineAction, vm: VirtualMachine): void {
    action.activate(vm).subscribe();
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
    this.color = this.vmTagService.getColorSync(this.item);
  }
}
