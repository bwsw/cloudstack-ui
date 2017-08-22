import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { ListService } from '../../shared/components/list/list.service';
import { NotificationService } from '../../shared/services/notification.service';
import { SecurityGroupService } from '../../shared/services/security-group.service';
import { SecurityGroupTagKeys } from '../../shared/services/tags/security-group-tag.service';
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
    private dialogService: DialogService,
    private listService: ListService,
    private notificationService: NotificationService,
    private securityGroupService: SecurityGroupService
  ) { }

  public ngOnInit(): void {
    const securityGroupTemplates = this.securityGroupService.getTemplates();
    const accountSecurityGroups = this.securityGroupService.getList({
      'tags[0].key': SecurityGroupTagKeys.template,
      'tags[0].value': 'true'
    });

    this.listService.onAction.subscribe(() => this.showCreationDialog());

    accountSecurityGroups
      .subscribe(groups => {
        this.predefinedSecurityGroupList = securityGroupTemplates;
        this.customSecurityGroupList = groups;
      });
  }

  public deleteSecurityGroupTemplate(securityGroup: SecurityGroup): void {
    this.dialogService.confirm('CONFIRM_DELETE_TEMPLATE', 'COMMON.NO', 'COMMON.YES')
      .onErrorResumeNext()
      .switchMap(() => this.securityGroupService.deleteTemplate(securityGroup.id))
      .subscribe(
        res => {
          if (res && res.success === 'true') {
            this.customSecurityGroupList = this.customSecurityGroupList.filter(sg => {
              return sg.id !== securityGroup.id;
            });
            this.notificationService.message({
              translationToken: 'NOTIFICATIONS.TEMPLATE.DELETED',
              interpolateParams: { name: securityGroup.name }
            });
          }
        }
      );
  }

  public showCreationDialog(): void {
    this.dialogService.showCustomDialog({
      component: SgTemplateCreationComponent,
      clickOutsideToClose: false,
      classes: 'sg-template-creation-dialog'
    })
      .switchMap(res => res.onHide())
      .subscribe((template: SecurityGroup) => {
        if (!template) {
          return;
        }
        this.customSecurityGroupList.push(template);
        this.notificationService.message({
          translationToken: 'NOTIFICATIONS.TEMPLATE.CREATED',
          interpolateParams: { name: template.name }
        });
        this.showRulesDialog(template);
      });
  }

  public showRulesDialog(group: SecurityGroup): void {
    this.dialogService.showCustomDialog({
      component: SgRulesComponent,
      classes: 'sg-rules-dialog',
      providers: [{ provide: 'securityGroup', useValue: group }],
    });
  }
}
