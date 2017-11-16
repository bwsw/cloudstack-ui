import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { VirtualMachine } from '../../shared/vm.model';
import { VmService } from '../../shared/vm.service';


@Component({
  selector: 'cs-statistics',
  templateUrl: 'statistics.component.html',
  styleUrls: ['statistics.component.scss']
})
export class StatisticsComponent {
  @Input() public vm: VirtualMachine;
  @Output() public onStatsUpdate = new EventEmitter();

  constructor(private vmService: VmService) {}

  public updateStats(): void {
    this.onStatsUpdate.emit(this.vm);
  }
}
