import { Component, Input } from '@angular/core';
import { VirtualMachine } from '../../shared/vm.model';
import { VmService } from '../../shared/vm.service';


@Component({
  selector: 'cs-statistics',
  templateUrl: 'statistics.component.html',
  styleUrls: ['statistics.component.scss']
})
export class StatisticsComponent {
  @Input() public vm: VirtualMachine;

  constructor(private vmService: VmService) {}

  public updateStats(): void {
    this.vmService.getWithDetails(this.vm.id)
      .subscribe(vm => {
        this.vm.cpuUsed = vm.cpuUsed;
        this.vm.networkKbsRead = vm.networkKbsRead;
        this.vm.networkKbsWrite = vm.networkKbsWrite;
        this.vm.diskKbsRead = vm.diskKbsRead;
        this.vm.diskKbsWrite = vm.diskKbsWrite;
        this.vm.diskIoRead = vm.diskIoRead;
        this.vm.diskIoWrite = vm.diskIoWrite;
      });
  }
}
