import { Component } from '@angular/core';
import { ListService } from '../shared/components/list/list.service';
import { ViewMode } from '../shared/components/view-mode-switch/view-mode-switch.component';

@Component({
  selector: 'cs-log-files',
  templateUrl: 'log-files.component.html',
  providers: [ListService]
})
export class LogFilesComponent {
  public vms = [{ id: '334cccb4-2645-41fe-8182-536382519570', name: 'vm-daniil-381' }];

  public mode = ViewMode.LIST;

  public logFiles = [
    'log file 1',
    'log file 2',
  ];

  constructor(
    public listService: ListService,
  ) { }

}
