import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { ListService } from '../../shared/components/list/list.service';
import { NotificationService } from '../../shared/services/notification.service';
import { SecurityGroupService } from '../../shared/services/security-group.service';
import { SecurityGroupTagKeys } from '../../shared/services/tags/security-group/security-group-tag-keys';
import { SgRulesComponent } from '../sg-rules/sg-rules.component';
import { SecurityGroup } from '../sg.model';
import { Observable } from 'rxjs/Observable';


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
    private listService: ListService,
    private dialog: MdDialog,
    private notificationService: NotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.securityGroupService.onSecurityGroupUpdate.subscribe(updatedGroup => {
      this.customSecurityGroupList = this.customSecurityGroupList.map(group => {
        if (group.id === updatedGroup.id) {
          return updatedGroup;
        } else {
          return group;
        }
      });
    });
  }

  public ngOnInit(): void {
    this.update();
  }

  public deleteSecurityGroupTemplate(securityGroup: SecurityGroup): void {
    this.dialogService.confirm({ message: 'DIALOG_MESSAGES.TEMPLATE.CONFIRM_DELETION' })
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

  public showRulesDialog(group: SecurityGroup): void {
    this.dialog.open(SgRulesComponent, <MdDialogConfig>{
      width: '880px',
      data: { securityGroup: group }
    });
  }
}
