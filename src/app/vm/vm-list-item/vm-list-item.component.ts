import {
  EventEmitter,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  VirtualMachine,
  VmState
} from '../shared/vm.model';
import { MdMenuTrigger } from '@angular/material';
import { Color } from '../../shared/models/color.model';
import { VmTagService } from '../../shared/services/tags/vm-tag.service';
import { Utils } from '../../shared/services/utils/utils.service';


const stateTranslations = {
  RUNNING: 'VM_STATE.RUNNING',
  STOPPED: 'VM_STATE.STOPPED',
  STARTING: 'VM_STATE.STARTING',
  STOPPING: 'VM_STATE.STOPPING',
  REBOOTING: 'VM_STATE.REBOOTING',
  RESTORING: 'VM_STATE.RESTORING',
  DESTROYING: 'VM_STATE.DESTROYING',
  DESTROYED: 'VM_STATE.DESTROYED',
  DEPLOYING: 'VM_STATE.DEPLOYING',
  ERROR: 'VM_STATE.ERROR',
  START_IN_PROGRESS: 'VM_STATE.START_IN_PROGRESS',
  STOP_IN_PROGRESS: 'VM_STATE.STOP_IN_PROGRESS',
  REBOOT_IN_PROGRESS: 'VM_STATE.REBOOT_IN_PROGRESS',
  RESTORE_IN_PROGRESS: 'VM_STATE.RESTORE_IN_PROGRESS',
  DESTROY_IN_PROGRESS: 'VM_STATE.DESTROY_IN_PROGRESS',
  DEPLOY_IN_PROGRESS: 'VM_STATE.DEPLOY_IN_PROGRESS',
  RESET_PASSWORD_IN_PROGRESS: 'VM_STATE.RESET_PASSWORD_IN_PROGRESS'
};

export class VmListItemComponent implements OnInit, OnChanges {
  public item: VirtualMachine;
  public isSelected: (vm: VirtualMachine) => boolean;
  public onClick = new EventEmitter();
  public mdMenuTrigger: MdMenuTrigger;

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
    return stateTranslations[this.item.state.toUpperCase()];
  }

  public get statusClass() {
    const { state } = this.item;
    const running = state === VmState.Running;
    const stopped = state === VmState.Stopped;
    const error = state === VmState.Error;
    const destroyed = state === VmState.Destroyed;

    return {
      running,
      stopped,
      error,
      destroyed,
      'in-progress': !running && !stopped && !destroyed
    };
  }

  public get cardClass() {
    const { state } = this.item;
    const error = state === VmState.Error;
    const destroyed =
      state === VmState.Destroyed || (state as any) === 'VM_STATE.EXPUNGE_IN_PROGRESS';

    return {
      'card-selected': this.isSelected(this.item),
      'has-text-color': !!this.color && !!this.color.textColor,
      'dark-background':  !!this.color && Utils.isColorDark(this.color.value),
      'light-background': !this.color || !Utils.isColorDark(this.color.value),
      error,
      destroyed
    };
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
