import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { SecurityGroup } from '../../../security-group/sg.model';

@Component({
  selector: 'cs-vms-sg-list',
  templateUrl: 'vms-sg-list.component.html',
  styleUrls: ['vms-sg-list.component.scss']
})
export class VmsSgListComponent implements OnInit {
  @Input() public securityGroups: Array<SecurityGroup>;
  @Input() public isLoading: boolean;
  @Output() public onSave = new EventEmitter<any>(); // todo
  @Output() public onCancel = new EventEmitter();
  public preselected: any;
  private _selectedSecurityGroups: Array<SecurityGroup> = [];

  @Input()
  public get selectedSecurityGroups(): Array<SecurityGroup> {
    return this._selectedSecurityGroups;
  }

  public set selectedSecurityGroups(value: Array<SecurityGroup>) {
    this._selectedSecurityGroups = value;
  }

  public ngOnInit() {
    this.preselected = this.selectedSecurityGroups;
  }

  public checkSelectedSG(securityGroupId: string): boolean {
    const isSelectedItem = this.selectedSecurityGroups.find(securityGroup => securityGroup.id === securityGroupId);
    return !!isSelectedItem;
  }

  public selectSecurityGroup(securityGroup: SecurityGroup): void {
    const tempSG = [...this.selectedSecurityGroups];
    if (this.checkSelectedSG(securityGroup.id)) {
      const index = tempSG.findIndex(_ => _.id === securityGroup.id);
      tempSG.splice(index, 1);
    } else {
      tempSG.push(securityGroup);
    }
    this.selectedSecurityGroups = tempSG;
  }
}
