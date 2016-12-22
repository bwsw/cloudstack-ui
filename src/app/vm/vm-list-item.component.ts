import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { VirtualMachine, IVmAction } from './vm.model';
import { JobStreamService } from '../shared/services/job-stream.service';
import { AsyncVmJob } from '../shared/models/async-job.model';


@Component({
  selector: 'cs-vm-list-item',
  templateUrl: './vm-list-item.component.html',
  styleUrls: ['./vm-list-item.component.scss']
})
export class VmListItemComponent implements OnInit {
  @Input() public vm: VirtualMachine;
  @Output() public onVmAction = new EventEmitter();

  public actionsInfo: Array<IVmAction>;

  constructor(private jobStreamService: JobStreamService) {
    this.jobStreamService.subscribe((job: AsyncVmJob) => {
      if (job.jobResult.id === this.vm.id) {
        this.vm.state = job.jobResult.state;
      }
    });
  }

  public ngOnInit() {
    this.actionsInfo = this.vm.actions.map(a => this.vm.getActionInfo(a));
  }

  public action(act: string) {
    let e = {
      id: this.vm.id,
      action: this.actionsInfo.find(a => a.nameLower === act),
      vm: this.vm
    };

    if (act === 'restore') {
      e['templateId'] = this.vm.templateId;
    }

    this.onVmAction.emit(e);
  }
}
