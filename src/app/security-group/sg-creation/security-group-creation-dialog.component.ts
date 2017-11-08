import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from '../../shared/components/list/list.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { NotificationService } from '../../shared/services/notification.service';
import { SecurityGroup, SecurityGroupType } from '../sg.model';
import { SecurityGroupCreationComponent } from './security-group-creation.component';
import { SecurityGroupViewMode } from '../sg-filter/containers/sg-filter.container';


@Component({
  selector: 'cs-security-group-create-dialog',
  template: ``
})
export class SecurityGroupCreationDialogComponent {
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private listService: ListService,
    private storageService: LocalStorageService
  ) {
    this.dialog.open(SecurityGroupCreationComponent, <MatDialogConfig>{
      data: { mode: this.viewMode },
      disableClose: true,
      width: '450px'
    })
      .afterClosed()
      .subscribe(securityGroup => {
        return this.onCreationDialogClosed(securityGroup);
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
    this.router.navigate(['../', securityGroup.id], {
      queryParamsHandling: 'preserve',
      relativeTo: this.activatedRoute
    });
  }

  private onCancel(): void {
    this.router.navigate(['../'], {
      queryParamsHandling: 'preserve',
      relativeTo: this.activatedRoute
    });

  }
}
