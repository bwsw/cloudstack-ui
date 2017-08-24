import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { ListService } from '../../shared/components/list/list.service';
import { NotificationService } from '../../shared/services/notification.service';
import { SecurityGroupService } from '../../shared/services/security-group.service';
import { SecurityGroup } from '../sg.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityGroupTagKeys } from '../../shared/services/tags/security-group-tag-keys';


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
    private securityGroupService: SecurityGroupService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  public ngOnInit(): void {
    this.update();
  }

  public deleteSecurityGroupTemplate(securityGroup: SecurityGroup): void {
    this.dialogService.confirm(
      'DIALOG_MESSAGES.TEMPLATE.CONFIRM_DELETION',
      'COMMON.NO',
      'COMMON.YES'
    )
      .onErrorResumeNext()
      .switchMap(() => this.securityGroupService.deleteTemplate(securityGroup.id))
      .subscribe(
        res => {
          if (res && res.success === 'true') {
            this.customSecurityGroupList = this.customSecurityGroupList
              .filter(sg => {
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
    this.listService.onUpdate.subscribe(() => {
      this.update();
    });

    this.router.navigate(['./create'], {
      preserveQueryParams: true,
      relativeTo: this.activatedRoute
    });
  }

  private update() {
    const securityGroupTemplates = this.securityGroupService.getTemplates();
    const accountSecurityGroups = this.securityGroupService.getList({
      'tags[0].key': SecurityGroupTagKeys.template,
      'tags[0].value': 'true'
    });

    accountSecurityGroups
      .subscribe(groups => {
        this.predefinedSecurityGroupList = securityGroupTemplates;
        this.customSecurityGroupList = groups;
      });
  }
}
