import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VirtualMachine } from '../../shared/vm.model';


@Component({
  selector: 'cs-statistics',
  templateUrl: 'statistics.component.html',
  styleUrls: ['statistics.component.scss']
})
export class StatisticsComponent {
  @Input() public vm: VirtualMachine;
  @Output() public onStatsUpdate = new EventEmitter();

  public updateStats(): void {
    this.onStatsUpdate.emit(this.vm);
  }
}
