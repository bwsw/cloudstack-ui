import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { Observable } from 'rxjs';
import { DialogsService } from '../../dialog/dialog-service/dialog.service';

import { ListService } from '../../shared/components/list/list.service';
import { NotificationService } from '../../shared/services/notification.service';
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
    private dialogsService: DialogsService,
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

    accountSecurityGroups
      .subscribe(groups => {
        this.predefinedSecurityGroupList = securityGroupTemplates;
        this.customSecurityGroupList = groups;
      });
  }

  public deleteSecurityGroupTemplate(securityGroup: SecurityGroup): void {
    this.dialogsService.confirm({ message: 'CONFIRM_DELETE_TEMPLATE' })
      .onErrorResumeNext()
      .switchMap((res) => {
        if (res) {
          return this.securityGroupService.deleteTemplate(securityGroup.id);
        } else {
          return Observable.of(null);
        }
      })
      .subscribe(
        res => {
          if (res && res.success === 'true') {
            this.customSecurityGroupList = this.customSecurityGroupList.filter(sg => sg.id !== securityGroup.id);
            this.notificationService.message({
              translationToken: 'NOTIFICATIONS.TEMPLATE.DELETED',
              interpolateParams: { name: securityGroup.name }
            });
          }
        }
      );
  }

  public showCreationDialog(): void {
    this.dialog.open(SgTemplateCreationComponent, <MdDialogConfig>{
       disableClose: true,
       panelClass: 'sg-template-creation-dialog'
    }).afterClosed()
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
    this.dialog.open(SgRulesComponent, <MdDialogConfig>{
      panelClass: 'sg-rules-dialog',
      data: { securityGroup: group }
    });
  }
}
