import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-module/dialog.service';

import { ListService } from '../../shared/components/list/list.service';
import { NotificationService } from '../../shared/services';
import { SecurityGroupService } from '../../shared/services/security-group.service';
import { SgRulesComponent } from '../sg-rules/sg-rules.component';
import { SgTemplateCreationComponent } from '../sg-template-creation/sg-template-creation.component';
import { SecurityGroup } from '../sg.model';


@Component({
  selector: 'cs-security-group-template-list',
  templateUrl: 'sg-template-list.component.html',
  styleUrls: ['sg-template-list.component.scss'],
  providers: [ListService]
})
export class SgTemplateListComponent implements OnInit {
  public predefinedSecurityGroupList: Array<SecurityGroup>;
  public customSecurityGroupList: Array<SecurityGroup>;

  constructor(
    private securityGroupService: SecurityGroupService,
    private dialogService: DialogService,
    private dialog: MdDialog,
    private notificationService: NotificationService,
    private listService: ListService
  ) { }

  public ngOnInit(): void {
    const securityGroupTemplates = this.securityGroupService.getTemplates();
    const accountSecurityGroups = this.securityGroupService.getList({
      'tags[0].key': 'template',
      'tags[0].value': 'true'
    });

    this.listService.onAction.subscribe(() => this.showCreationDialog());

    Observable.forkJoin([securityGroupTemplates, accountSecurityGroups])
      .subscribe(([templates, groups]) => {
        this.predefinedSecurityGroupList = templates;
        this.customSecurityGroupList = groups;
      });
  }

  public deleteSecurityGroupTemplate(securityGroup: SecurityGroup): void {
    this.dialogService.confirm('CONFIRM_DELETE_TEMPLATE', 'NO', 'YES')
      .onErrorResumeNext()
      .switchMap(() => this.securityGroupService.deleteTemplate(securityGroup.id))
      .subscribe(
        res => {
          if (res && res.success === 'true') {
            this.customSecurityGroupList = this.customSecurityGroupList.filter(sg => sg.id !== securityGroup.id);
            this.notificationService.message({
              translationToken: 'TEMPLATE_DELETED',
              interpolateParams: { name: securityGroup.name }
            });
          }
        }
      );
  }

  public showCreationDialog(): void {
    this.dialog.open(SgTemplateCreationComponent, {
      disableClose: true,
      panelClass: 'sg-template-creation-dialog'
    })
      .afterClosed()
      .subscribe((template: SecurityGroup) => {
        if (!template) {
          return;
        }
        this.customSecurityGroupList.push(template);
        this.notificationService.message({
          translationToken: 'TEMPLATE_CREATED',
          interpolateParams: { name: template.name }
        });
        this.showRulesDialog(template);
      });
  }

  public showRulesDialog(group: SecurityGroup): void {
    this.dialog.open(SgRulesComponent, {
      panelClass: 'sg-rules-dialog',
      data: group
    });
  }
}
