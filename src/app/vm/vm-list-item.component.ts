import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { VirtualMachine, IVmAction } from './vm.model';
import { AsyncJobService } from '../shared/services/async-job.service';
import { IAsyncJob } from '../shared/models/async-job.model';


@Component({
  selector: 'cs-vm-list-item',
  templateUrl: './vm-list-item.component.html',
  styleUrls: ['./vm-list-item.component.scss']
})
export class VmListItemComponent implements OnInit {
  @Input() public vm: VirtualMachine;
  @Output() public onVmAction = new EventEmitter();

  public actions: Array<IVmAction>;

  constructor(private asyncJobService: AsyncJobService) {}

  public ngOnInit() {
    this.actions = this.vm.actions.map(a => this.vm.getAction(a));
    this.asyncJobService.event.subscribe((job: IAsyncJob<VirtualMachine>) => {
      if (job.jobResult.id === this.vm.id) {
        this.vm.state = job.jobResult.state;
      }
    });
  }

  public getAction(act: string) {
    let e = {
      id: this.vm.id,
      action: this.actions.find(a => a.nameLower === act),
      vm: this.vm
    };

    if (act === 'restore') {
      e['templateId'] = this.vm.templateId;
    }

    this.onVmAction.emit(e);
  }
}
