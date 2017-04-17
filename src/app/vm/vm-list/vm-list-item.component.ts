import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MdlPopoverComponent } from '@angular2-mdl-ext/popover';

import { AsyncJob, Color } from '../../shared/models';
import { AsyncJobService } from '../../shared/services';
import { IVmAction, VirtualMachine } from '../shared/vm.model';
import { VmService } from '../shared/vm.service';
import { TranslateService } from 'ng2-translate';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'cs-vm-list-item',
  templateUrl: 'vm-list-item.component.html',
  styleUrls: ['vm-list-item.component.scss']
})
export class VmListItemComponent implements OnInit, OnChanges {
  @Input() public vm: VirtualMachine;
  @Input() public isSelected: boolean;
  @Output() public onVmAction = new EventEmitter();
  @Output() public onClick = new EventEmitter();
  @ViewChild(MdlPopoverComponent) public popoverComponent: MdlPopoverComponent;

  public actions: Array<IVmAction>;
  public color: Color;

  constructor(
    private asyncJobService: AsyncJobService,
    private vmService: VmService,
    private translate: TranslateService
  ) { }

  public ngOnInit(): void {
    this.updateColor();

    this.actions = VirtualMachine.actions;
    this.asyncJobService.event.subscribe((job: AsyncJob<any>) => {
      if (job.result && job.result.id === this.vm.id) {
        this.vm.state = job.result.state;
        this.vm.nic[0] = job.result.nic[0];
      }
    });
    this.vmService.vmUpdateObservable.subscribe(() => {
      this.updateColor();
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      if (changes.hasOwnProperty(propName) && propName === 'isSelected') {
        this.isSelected = changes[propName].currentValue;
      }
    }
  }

  public handleClick(e: MouseEvent): void {
    e.stopPropagation();
    if (!this.popoverComponent.isVisible) {
      this.onClick.emit(this.vm);
    } else {
      this.popoverComponent.hide();
    }
  }

  public openConsole(): void {
    window.open(
      `/client/console?cmd=access&vm=${this.vm.id}`,
      this.vm.displayName,
      'resizable=0,width=820,height=640'
    );
  }

  public getAction(event: MouseEvent, act: string): void {
    event.stopPropagation();
    if (act === 'console') {
      this.openConsole();
      return;
    }

    let e = {
      action: this.actions.find(a => a.nameLower === act),
      vm: this.vm
    };

    if (act === 'restore') {
      e['templateId'] = this.vm.templateId;
    }

    this.onVmAction.emit(e);
  }

  public get memory(): Observable<string> {
    const memory = this.vm.memory;
    const gigabyte = Math.pow(2, 10); // vm.memory is in megabytes
    return memory < gigabyte ?
      this.translate.get('MB').map(str => `${memory} ${str}`) :
      this.translate.get('GB').map(str => `${memory / gigabyte} ${str}`);
  }

  private updateColor(): void {
    this.color = this.vmService.getColor(this.vm);
  }
}
