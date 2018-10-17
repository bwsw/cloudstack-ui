import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VirtualMachine } from '../../shared/vm.model';

@Component({
  selector: 'cs-statistics',
  templateUrl: 'statistics.component.html',
  styleUrls: ['statistics.component.scss'],
})
export class StatisticsComponent {
  @Input()
  public vm: VirtualMachine;
  @Output()
  public statsUpdated = new EventEmitter();

  public updateStats(): void {
    this.statsUpdated.emit(this.vm);
  }
}
