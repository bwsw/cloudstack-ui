import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {
  MatDialog,
  MatDialogConfig
} from '@angular/material';
import { AffinityGroupSelectorComponent } from 'app/vm/vm-sidebar/affinity-group-selector/affinity-group-selector.component';
import { DateTimeFormatterService } from '../../../../shared/services/date-time-formatter.service';
import { VirtualMachine } from '../../../shared/vm.model';


@Component({
  selector: 'cs-affinity-group',
  templateUrl: 'affinity-group.component.html'
})
export class AffinityGroupComponent {
  @Input() public vm: VirtualMachine;
  @Output() public onAffinityGroupChange = new EventEmitter();

  constructor(
    public dateTimeFormatterService: DateTimeFormatterService,
    private dialog: MatDialog
  ) {
  }

  public changeAffinityGroup(): void {
    this.showAffinityGroupDialog();
  }

  private showAffinityGroupDialog(): void {
    this.dialog.open( AffinityGroupSelectorComponent, <MatDialogConfig>{
      width: '350px' ,
      data: { vm: this.vm },
      disableClose: true
    }).afterClosed()
      .subscribe((groupId?: string) => {
        if (groupId || groupId === '') {
          this.onAffinityGroupChange.emit(groupId);
        }
      });
  }
}
