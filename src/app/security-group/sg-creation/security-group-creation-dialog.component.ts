import { Component } from '@angular/core';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from '../../shared/components/list/list.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { NotificationService } from '../../shared/services/notification.service';
import { SecurityGroupEditAction } from '../sg-actions/sg-edit';
import { SecurityGroupViewMode } from '../sg-filter/sg-filter.component';
import { SecurityGroup, SecurityGroupType } from '../sg.model';
import { SecurityGroupCreationComponent } from './security-group-creation.component';


@Component({
  selector: 'cs-security-group-create-dialog',
  template: ``
})
export class SecurityGroupCreationDialogComponent {
  constructor(
    private dialog: MdDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private listService: ListService,
    private securityGroupEditAction: SecurityGroupEditAction,
    private storageService: LocalStorageService
  ) {
    this.dialog.open(SecurityGroupCreationComponent, <MdDialogConfig>{
      data: { mode: this.viewMode },
      disableClose: true,
      width: '450px'
    })
      .afterClosed()
      .subscribe(securityGroup => {
        return this.onCreationDialogClosed(securityGroup);
      });
  }

  public showRulesDialog(group: SecurityGroup): void {
    this.securityGroupEditAction.activate(group)
      .subscribe(() => {
        this.router.navigate(['../'], {
          queryParamsHandling: 'preserve',
          relativeTo: this.activatedRoute
        });
      });
  }

  private getSuccessCreationToken(securityGroup: SecurityGroup): string {
    if (securityGroup.type === SecurityGroupType.CustomTemplate) {
      return 'NOTIFICATIONS.TEMPLATE.CUSTOM_TEMPLATE_CREATED';
    }

    if (securityGroup.type === SecurityGroupType.Shared) {
      return 'NOTIFICATIONS.TEMPLATE.SHARED_GROUP_CREATED';
    }
  }

  private get viewMode(): string {
    return this.storageService.read('securityGroupDisplayMode') || SecurityGroupViewMode.Templates;
  }

  private onCreationDialogClosed(securityGroup: SecurityGroup): void {
    if (securityGroup) {
      this.onSecurityGroupCreated(securityGroup);
    } else {
      this.onCancel();
    }
  }

  private onSecurityGroupCreated(securityGroup: SecurityGroup): void {
    this.listService.onUpdate.emit(securityGroup);
    this.notificationService.message({
      translationToken: this.getSuccessCreationToken(securityGroup),
      interpolateParams: { name: securityGroup.name }
    });
    this.showRulesDialog(securityGroup);
  }

  private onCancel(): void {

    this.router.navigate(['../'], {
      queryParamsHandling: 'preserve',
      relativeTo: this.activatedRoute
    });

  }
}
