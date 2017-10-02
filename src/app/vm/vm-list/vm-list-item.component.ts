import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MdMenuTrigger } from '@angular/material';
import { Color } from '../../shared/models';
import { VmTagService } from '../../shared/services/tags/vm-tag.service';
import { VirtualMachine, VmState } from '../shared/vm.model';

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
    const savedColor = this.vmTagService.getColorSync(this.item);
    this.color = new Color(savedColor.name, savedColor.value);

    this.color.textColor = this.isBackgroundDark(savedColor.value)
      ? 'rgba(255, 255, 255, 0.87)'
      : 'rgba(0, 0, 0, 0.87)';
  }

  private isBackgroundDark(color: string) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const darkness = 1 - ( 0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return darkness > 0.5 ? true : false;
  }
}
