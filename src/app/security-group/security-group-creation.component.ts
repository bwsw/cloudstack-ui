import { Component, OnInit } from '@angular/core';
import { SecurityGroupService } from './security-group.service';
import { SecurityGroup } from './security-group.model';

@Component({
  selector: 'cs-security-group-creation',
  templateUrl: './security-group-creation.component.html',
  styleUrls: ['./security-group-creation.component.scss']
})
export class SecurityGroupCreationComponent implements OnInit {
  private items: Array<Array<SecurityGroup>>;
  private selectedGroupIndex: number;
  private selectedColumnIndex: number;

  constructor(private securityGroupService: SecurityGroupService) {
    this.items = [[], []];
  }

  public ngOnInit() {
    const securityGroupTemplates = this.securityGroupService.getTemplates();
    const accountSecurityGroups = this.securityGroupService.getList();

    Promise.all([securityGroupTemplates, accountSecurityGroups])
      .then(([templates, groups]) => {
        this.items[0] = templates.concat(groups);
      });
  }

  public selectGroup(index: number, left: boolean) {
    this.selectedGroupIndex = index;
    this.selectedColumnIndex = left ? 0 : 1;
  }

  public move(left: boolean) {
    if (this.selectedGroupIndex === -1) {
      return;
    }

    const moveToIndex = left ? 0 : 1;
    const moveFromIndex = this.items.length - moveToIndex - 1;

    this.items[moveToIndex].push(this.items[moveFromIndex][this.selectedGroupIndex]);
    this.items[moveFromIndex].splice(this.selectedGroupIndex, 1);
    this.selectedGroupIndex = -1;
    this.selectedColumnIndex = -1;
  }
}
