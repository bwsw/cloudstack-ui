import { EventEmitter, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { Color } from '../../shared/models';
import { VmTagService } from '../../shared/services/tags/vm-tag.service';
import { VirtualMachine, VmState } from '../shared/vm.model';
import { Utils } from '../../shared/services/utils/utils.service';
import { Volume } from '../../shared/models/volume.model';
import { OsType } from '../../shared/models/os-type.model';
import { Dictionary } from '@ngrx/entity/src/models';

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
  RESET_PASSWORD_IN_PROGRESS: 'VM_STATE.RESET_PASSWORD_IN_PROGRESS',
};

export abstract class VmListItemComponent implements OnInit {
  public item: VirtualMachine;
  public volumes: Volume[];
  public osTypesMap: Dictionary<OsType>;
  public isSelected: (vm: VirtualMachine) => boolean;
  public onClick = new EventEmitter();
  public matMenuTrigger: MatMenuTrigger;
  public query: string;

  public color: Color;
  public gigabyte = 1024; // to compare with RAM which is in megabytes

  constructor(private vmTagService: VmTagService) {}

  public ngOnInit(): void {
    this.updateColor();
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
    const inProgress = state === VmState.InProgress;
    const stopping = state === VmState.Stopping;

    return {
      running,
      stopped,
      stopping,
      error,
      destroyed,
      'in-progress': inProgress,
    };
  }

  public get itemClass() {
    const { state } = this.item;
    const error = state === VmState.Error;
    const destroyed =
      state === VmState.Destroyed || (state as any) === 'VM_STATE.EXPUNGE_IN_PROGRESS';

    return {
      error,
      destroyed,
      'card-selected': this.isSelected(this.item),
      'has-text-color': !!this.color && !!this.color.textColor,
      'dark-background': !!this.color && Utils.isColorDark(this.color.value),
      'light-background': !this.color || !Utils.isColorDark(this.color.value),
    };
  }

  public handleClick(e: MouseEvent): void {
    e.stopPropagation();
    if (!this.matMenuTrigger.menuOpen) {
      this.onClick.emit(this.item);
    }
  }

  public getMemoryInMb(): string {
    return this.item.memory.toFixed(2);
  }

  public getMemoryInGb(): string {
    return (this.item.memory / this.gigabyte).toFixed(2);
  }

  public get getDisksSize(): number {
    const filteredVolumes =
      this.volumes &&
      this.volumes.filter((volume: Volume) => volume.virtualmachineid === this.item.id);
    const sizeInBytes =
      (filteredVolumes &&
        filteredVolumes.reduce((acc: number, volume: Volume) => {
          return acc + volume.size;
        }, 0)) ||
      0;
    return sizeInBytes / Math.pow(2, 30);
  }

  public get getOsDescription(): string {
    return (
      this.osTypesMap &&
      this.osTypesMap[this.item.guestosid] &&
      this.osTypesMap[this.item.guestosid].description
    );
  }

  private updateColor(): void {
    this.color = this.vmTagService.getColorSync(this.item);
  }
}
