import { Component, OnInit } from '@angular/core';
import { SecurityGroupService } from './security-group.service';
import { SecurityGroup } from './security-group.model';

@Component({
  selector: 'cs-security-group-template-list',
  templateUrl: './security-group-template-list.component.html',
  styleUrls: ['./security-group-template-list.component.scss']
})
export class SecurityGroupTemplateListComponent implements OnInit {
  private securityGroupList: Array<SecurityGroup>;

  constructor(private securityGroupService: SecurityGroupService) { }

  public ngOnInit() {
    const securityGroupTemplates = this.securityGroupService.getTemplates();
    const accountSecurityGroups = this.securityGroupService.getList({
      'tags[0].key': 'template',
      'tags[0].value': 'true'
    });

    Promise.all([securityGroupTemplates, accountSecurityGroups])
      .then(([templates, groups]) => {
        this.securityGroupList = templates.concat(groups);
      });
  }
}
