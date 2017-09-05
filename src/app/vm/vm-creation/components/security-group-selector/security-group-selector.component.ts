import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SecurityGroupService } from '../../../../security-group/services/security-group.service';
import { SecurityGroup } from '../../../../security-group/sg.model';


@Component({
  selector: 'cs-security-group-selector',
  templateUrl: 'security-group-selector.component.html',
  styleUrls: ['security-group-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SecurityGroupSelectorComponent),
      multi: true
    }
  ]
})
export class SecurityGroupSelectorComponent implements OnInit {
  @Input() public securityGroup: SecurityGroup;
  @Output() public onChange = new EventEmitter<SecurityGroup>();
  public securityGroups: Array<SecurityGroup>;
  public selectedSecurityGroup: SecurityGroup;

  constructor(private securityGroupService: SecurityGroupService) {}

  public ngOnInit(): void {
    this.securityGroupService.getSharedGroups()
      .subscribe(sharedGroups => {
        this.securityGroups = sharedGroups;
        this.selectedSecurityGroup = this.securityGroup;

        if (!this.selectedSecurityGroup && this.securityGroups) {
          this.selectSecurityGroup(this.securityGroups[0]);
        }
      });
  }

  public selectSecurityGroup(securityGroup: SecurityGroup): void {
    this.selectedSecurityGroup = securityGroup;
    this.onChange.emit(this.selectedSecurityGroup);
  }
}
