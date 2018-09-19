import { Component, Input, OnInit } from '@angular/core';
import { SecurityGroup, isDefault } from '../../../../../security-group/sg.model';
import { Store } from '@ngrx/store';
import { State, configSelectors } from '../../../../../root-store';
import { first } from 'rxjs/operators';

@Component({
  selector: 'cs-security-group-manager-existing-group',
  templateUrl: 'security-group-manager-existing-group.component.html',
  styleUrls: ['security-group-manager-existing-group.component.scss']
})
export class SecurityGroupManagerExistingGroupComponent implements OnInit {
  @Input() public securityGroups: Array<SecurityGroup>;
  public defaultGroupName: string;

  constructor(private store: Store<State>) {
  }

  public ngOnInit() {
    this.store.select(configSelectors.get('defaultGroupName')).pipe(first())
      .subscribe(groupName => this.defaultGroupName = groupName)
  }

  public get securityGroupsLine(): string {
    return this.securityGroups.map(securityGroup => {
      if (isDefault(securityGroup)) {
        return this.defaultGroupName;
      } else {
        return securityGroup.name;
      }
    })
      .join(', ');
  }
}
