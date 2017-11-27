import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { SecurityGroupService } from '../../../security-group/services/security-group.service';
import { SecurityGroupViewMode } from '../../../security-group/sg-filter/containers/sg-filter.container';
import { Rules } from '../../../shared/components/security-group-builder/rules';
import { SecurityGroup, SecurityGroupType } from '../../../security-group/sg.model';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import * as securityGroup from './sg.actions';

@Injectable()
export class SecurityGroupEffects {
  @Effect()
  loadSecurityGroups$: Observable<Action> = this.actions$
    .ofType(securityGroup.LOAD_SECURITY_GROUP_REQUEST)
    .switchMap((action: securityGroup.LoadSecurityGroupRequest) => {
      return Observable.forkJoin([
        this.securiryGroupService.getList(),
        Observable.of(this.securiryGroupService.getPredefinedTemplates())
      ])
        .map(([groups, templates]) => new securityGroup
          .LoadSecurityGroupResponse(groups.concat(templates)))
        .catch(() => Observable.of(new securityGroup.LoadSecurityGroupResponse([])));
    });

  @Effect()
  createSecurityGroup$: Observable<Action> = this.actions$
    .ofType(securityGroup.CREATE_SECURITY_GROUP)
    .switchMap((action: securityGroup.CreateSecurityGroup) => {
      return this.createSecurityGroup(action.payload)
        .map(sg => new securityGroup.CreateSecurityGroupSuccess(sg))
        .catch(error => Observable.of(new securityGroup.CreateSecurityGroupError(error)));
    });

  @Effect({ dispatch: false })
  createSecurityGroupSuccess$: Observable<Action> = this.actions$
    .ofType(securityGroup.CREATE_SECURITY_GROUP_SUCCESS)
    .do((action: securityGroup.CreateSecurityGroupSuccess) =>
      this.onSecurityGroupCreated(action.payload));

  @Effect({ dispatch: false })
  createSecurityGroupError$: Observable<Action> = this.actions$
    .ofType(securityGroup.CREATE_SECURITY_GROUP_ERROR)
    .do((action: securityGroup.CreateSecurityGroupError) => this.handleError(action.payload));

  @Effect()
  deleteSecurityGroup$: Observable<Action> = this.actions$
    .ofType(securityGroup.DELETE_SECURITY_GROUP)
    .switchMap((action: securityGroup.DeleteSecurityGroup) => {
      return this.deleteSecurityGroup(action.payload)
        .map(result => new securityGroup.DeleteSecurityGroupSuccess(action.payload))
        .catch(error => Observable.of(new securityGroup.DeleteSecurityGroupError(error)));
    });

  @Effect({ dispatch: false })
  deleteSecurityGroupError$: Observable<Action> = this.actions$
    .ofType(securityGroup.DELETE_SECURITY_GROUP_ERROR)
    .do((action: securityGroup.DeleteSecurityGroupError) => this.handleError(action.payload));

  constructor(
    private actions$: Actions,
    private securiryGroupService: SecurityGroupService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private router: Router,
    private dialog: MatDialog
  ) {
  }

  public createSecurityGroup({ mode, data, rules }): Observable<SecurityGroup> {
    return this.getSecurityGroupCreationRequest(mode, data, rules)
      .switchMap(securityGroup => rules
        ? this.securiryGroupService.get(securityGroup.id)
        : Observable.of(securityGroup));
  }

  private getSecurityGroupCreationRequest(
    mode: string,
    data: any,
    rules: Rules
  ): Observable<SecurityGroup> {
    if (mode === SecurityGroupViewMode.Templates) {
      return this.securiryGroupService.createTemplate(data, rules);
    } else {
      return this.securiryGroupService.createShared(data, rules);
    }
  }

  private handleError(error): void {
    this.dialogService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params
      }
    });
  }

  private onNotify(securityGroup: SecurityGroup) {
    this.notificationService.message({
      translationToken: this.getSuccessCreationToken(securityGroup),
      interpolateParams: { name: securityGroup.name }
    });
  }

  private onSecurityGroupCreated(securityGroup: SecurityGroup): void {
    this.onNotify(securityGroup);
    this.dialog.closeAll();
    this.router.navigate(['../security-group', securityGroup.id], {
      queryParamsHandling: 'preserve'
    });
  }

  private deleteSecurityGroup(securityGroup: SecurityGroup): Observable<any> {
    return this.dialogService.confirm({message: 'DIALOG_MESSAGES.TEMPLATE.CONFIRM_DELETION'})
      .onErrorResumeNext()
      .switchMap((res) => {
        if (res) {
          return this.onDeleteConfirmation(securityGroup);
        } else {
          return Observable.of(null);
        }
      });
  }

  public onDeleteConfirmation(securityGroup: SecurityGroup): Observable<any> {
    return this.securiryGroupService.deleteGroup(securityGroup)
      .map(() => {
        this.notificationService.message({
          translationToken: this.getSuccessDeletionToken(securityGroup),
          interpolateParams: {name: securityGroup.name}
        });
      });
  }

  private getSuccessDeletionToken(securityGroup: SecurityGroup): string {
    if (securityGroup.type === SecurityGroupType.CustomTemplate) {
      return 'NOTIFICATIONS.TEMPLATE.CUSTOM_TEMPLATE_DELETED';
    }

    if (securityGroup.type === SecurityGroupType.Shared) {
      return 'NOTIFICATIONS.TEMPLATE.SHARED_GROUP_DELETED';
    }
  }

  private getSuccessCreationToken(securityGroup: SecurityGroup): string {
    if (securityGroup.type === SecurityGroupType.CustomTemplate) {
      return 'NOTIFICATIONS.TEMPLATE.CUSTOM_TEMPLATE_CREATED';
    }

    if (securityGroup.type === SecurityGroupType.Shared) {
      return 'NOTIFICATIONS.TEMPLATE.SHARED_GROUP_CREATED';
    }
  }
}
