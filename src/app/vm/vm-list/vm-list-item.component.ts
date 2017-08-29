import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MdMenuTrigger } from '@angular/material';
import { Color } from '../../shared/models';
import { VirtualMachine } from '../shared/vm.model';
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
  @ViewChild(MdMenuTrigger) public mdMenuTrigger: MdMenuTrigger;

  public color: Color;
  public gigabyte = Math.pow(2, 10); // to compare with RAM which is in megabytes

  constructor(private vmTagService: VmTagService) {}

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

  public get stateTranslationToken(): string {
    const stateTranslations = {
      'RUNNING': 'VM_STATE.RUNNING',
      'STOPPED': 'VM_STATE.STOPPED',
      'STARTING': 'VM_STATE.STARTING',
      'STOPPING': 'VM_STATE.STOPPING',
      'REBOOTING': 'VM_STATE.REBOOTING',
      'RESTORING': 'VM_STATE.RESTORING',
      'DESTROYING': 'VM_STATE.DESTROYING',
      'DEPLOYING': 'VM_STATE.DEPLOYING',
      'ERROR': 'VM_STATE.ERROR',
      'START_IN_PROGRESS': 'VM_STATE.START_IN_PROGRESS',
      'STOP_IN_PROGRESS': 'VM_STATE.STOP_IN_PROGRESS',
      'REBOOT_IN_PROGRESS': 'VM_STATE.REBOOT_IN_PROGRESS',
      'RESTORE_IN_PROGRESS': 'VM_STATE.RESTORE_IN_PROGRESS',
      'DESTROY_IN_PROGRESS': 'VM_STATE.DESTROY_IN_PROGRESS',
      'DEPLOY_IN_PROGRESS': 'VM_STATE.DEPLOY_IN_PROGRESS',
      'RESET_PASSWORD_IN_PROGRESS': 'VM_STATE.RESET_PASSWORD_IN_PROGRESS'
    };

    return stateTranslations[this.item.state.toUpperCase()];
  }

  public handleClick(e: MouseEvent): void {
    e.stopPropagation();
    if (!this.mdMenuTrigger.menuOpen) {
      this.onClick.emit(this.item);
    }
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
