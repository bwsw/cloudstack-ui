import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from '../../shared/components/list/list.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { NotificationService } from '../../shared/services/notification.service';
import { SecurityGroupEditAction } from '../sg-actions/sg-edit';
import { SecurityGroup } from '../sg.model';
import { SgTemplateCreationComponent } from './sg-template-creation.component';
import { SecurityGroupViewMode } from '../sg-filter/sg-filter.component';


@Component({
  selector: 'cs-sg-template-create-dialog',
  template: ``
})
export class SgTemplateCreationDialogComponent implements OnInit {
  constructor(
    private dialog: MdDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private listService: ListService,
    private securityGroupEditAction: SecurityGroupEditAction,
    private storageService: LocalStorageService
  ) {}

  public ngOnInit() {
    this.dialog.open(SgTemplateCreationComponent, <MdDialogConfig>{
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
          preserveQueryParams: true,
          relativeTo: this.activatedRoute
        });
      });
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
      translationToken: 'NOTIFICATIONS.TEMPLATE.CREATED',
      interpolateParams: { name: securityGroup.name }
    });
    this.showRulesDialog(securityGroup);

  }

  private onCancel(): void {
    this.router.navigate(['../'], {
      preserveQueryParams: true,
      relativeTo: this.activatedRoute
    });
  }
}
