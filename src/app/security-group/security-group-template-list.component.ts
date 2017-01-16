import { Component, OnInit } from '@angular/core';
import { MdlDialogService } from 'angular2-mdl';
import { SecurityGroupService } from './security-group.service';
import { SecurityGroup } from './security-group.model';
import { SecurityGroupRulesComponent } from './security-group-rules.component';
import { AsyncJobService } from '../shared/services/async-job.service';

@Component({
  selector: 'cs-security-group-template-list',
  templateUrl: './security-group-template-list.component.html',
  styleUrls: ['./security-group-template-list.component.scss']
})
export class SecurityGroupTemplateListComponent implements OnInit {
  private securityGroupList: Array<SecurityGroup>;

  constructor(
    private securityGroupService: SecurityGroupService,
    private dialogService: MdlDialogService
  ) { }

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

  public showDialog(group: SecurityGroup) {
    this.dialogService.showCustomDialog({
      component: SecurityGroupRulesComponent,
      providers: [SecurityGroupService, AsyncJobService, { provide: 'securityGroup', useValue: group }],
      isModal: true,
      styles: { 'width': '880px', 'padding': '12.8px' },
      enterTransitionDuration: 400,
      leaveTransitionDuration: 400
    });
  }
}
