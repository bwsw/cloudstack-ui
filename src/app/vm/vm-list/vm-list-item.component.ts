import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MdlPopoverComponent } from '@angular-mdl/popover';

import { AsyncJob, Color } from '../../shared/models';
import { AsyncJobService } from '../../shared/services';
import { IVmAction, VirtualMachine } from '../shared/vm.model';
import { VmService } from '../shared/vm.service';


@Component({
  selector: 'cs-vm-list-item',
  templateUrl: 'vm-list-item.component.html',
  styleUrls: ['vm-list-item.component.scss']
})
export class VmListItemComponent implements OnInit, OnChanges {
  @Input() public item: VirtualMachine;
  @Input() public isSelected: (vm: VirtualMachine) => boolean;
  @Output() public onVmAction = new EventEmitter();
  @Output() public onClick = new EventEmitter();
  @ViewChild(MdlPopoverComponent) public popoverComponent: MdlPopoverComponent;

  public actions: Array<IVmAction>;
  public color: Color;

  public gigabyte = Math.pow(2, 10); // to compare with RAM which is in megabytes

  constructor(
    private asyncJobService: AsyncJobService,
    private vmService: VmService
  ) { }

  public ngOnInit(): void {
    this.updateColor();

    this.actions = VirtualMachine.actions;
    this.asyncJobService.event.subscribe((job: AsyncJob<any>) => {
      if (job.result && job.result.id === this.item.id) {
        this.item.state = job.result.state;
        if (job.result.nic && job.result.nic.length) {
          this.item.nic[0] = job.result.nic[0];
        }
      }
    });
    this.vmService.vmUpdateObservable.subscribe(() => {
      this.updateColor();
    });
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

  public openConsole(): void {
    window.open(
      `client/console?cmd=access&vm=${this.item.id}`,
      this.item.displayName,
      'resizable=0,width=820,height=640'
    );
  }

  public getAction(event: MouseEvent, act: string): void {
    event.stopPropagation();
    if (act === 'console') {
      this.openConsole();
      return;
    }

    const e = {
      action: this.actions.find(a => a.nameLower === act),
      vm: this.item
    };

    if (act === 'restore') {
      e['templateId'] = this.item.templateId;
    }

    this.onVmAction.emit(e);
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
