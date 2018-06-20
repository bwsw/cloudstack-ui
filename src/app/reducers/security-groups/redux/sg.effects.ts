import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { SecurityGroupService } from '../../../security-group/services/security-group.service';
import { Rules } from '../../../shared/components/security-group-builder/rules';
import { getType, SecurityGroup, SecurityGroupType } from '../../../security-group/sg.model';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SecurityGroupCreationParams } from '../../../security-group/sg-creation/security-group-creation.component';
import { State } from '../../index';
import * as securityGroup from './sg.actions';
import * as fromSecurityGroups from './sg.reducers';
import { SecurityGroupViewMode } from '../../../security-group/sg-view-mode';
import { SecurityGroupTagService } from '../../../shared/services/tags/security-group-tag.service';

@Injectable()
export class SecurityGroupEffects {
  @Effect()
  loadSecurityGroups$: Observable<Action> = this.actions$
    .ofType(securityGroup.LOAD_SECURITY_GROUP_REQUEST)
    .switchMap(() => {
      return Observable.forkJoin([
        this.securityGroupService.getList(),
        Observable.of(this.securityGroupService.getPredefinedTemplates())
      ])
        .map(([groups, templates]) => new securityGroup
          .LoadSecurityGroupResponse(groups.concat(templates)))
        .catch(() => Observable.of(new securityGroup.LoadSecurityGroupResponse([])));
    });

  @Effect()
  createSecurityGroup$: Observable<Action> = this.actions$
    .ofType(securityGroup.CREATE_SECURITY_GROUP)
    .mergeMap((action: securityGroup.CreateSecurityGroup) => {
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
    .mergeMap((action: securityGroup.DeleteSecurityGroup) => {
      return this.onDeleteConfirmation(action.payload)
        .map(() => new securityGroup.DeleteSecurityGroupSuccess(action.payload))
        .catch(error => Observable.of(new securityGroup.DeleteSecurityGroupError(error)));
    });

  @Effect()
  deletePrivateSecurityGroup$: Observable<Action> = this.actions$
    .ofType(securityGroup.DELETE_PRIVATE_SECURITY_GROUP)
    .withLatestFrom(this.store.select(fromSecurityGroups.selectAll))
    .map(([action, groups]: [securityGroup.DeletePrivateSecurityGroup, Array<SecurityGroup>]) => {
      const vmGroup = groups.find((group: SecurityGroup) =>
        action.payload.securityGroup &&
        !!action.payload.securityGroup.find(sg => sg.id === group.id) &&
        getType(group) === SecurityGroupType.Private
      );
      return vmGroup;
    })
    .filter((group: SecurityGroup) => !!group)
    .mergeMap((group: SecurityGroup) => {
      return this.deleteSecurityGroup(group)
        .map(() => new securityGroup.DeleteSecurityGroupSuccess(group));
    });

  @Effect({ dispatch: false })
  deleteSecurityGroupSuccessNavigate$ = this.actions$
    .ofType(securityGroup.DELETE_SECURITY_GROUP_SUCCESS)
    .map((action: securityGroup.DeleteSecurityGroupSuccess) => action.payload)
    .filter((sg: SecurityGroup) => {
      return this.router.isActive(`/security-group/${sg.id}`, false);
    })
    .do(() => {
      this.router.navigate(['./security-group'], {
        queryParamsHandling: 'preserve'
      });
    });

  @Effect({ dispatch: false })
  deleteSecurityGroupError$: Observable<Action> = this.actions$
    .ofType(securityGroup.DELETE_SECURITY_GROUP_ERROR)
    .do((action: securityGroup.DeleteSecurityGroupError) => this.handleError(action.payload));

  @Effect()
  convertSecurityGroup$: Observable<Action> = this.actions$
    .ofType(securityGroup.CONVERT_SECURITY_GROUP)
    .mergeMap((action: securityGroup.ConvertSecurityGroup) => {
      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.SECURITY_GROUPS.CONFIRM_CONVERT' })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .switchMap(() => {
          return this.sgTagService.convertToShared(action.payload)
            .map(newSG => {
              return new securityGroup.UpdateSecurityGroup(newSG)
            })
            .catch(error => Observable.of(new securityGroup.UpdateSecurityGroupError(error)));
        });
    });

  private createSuccessMessage = {
    [SecurityGroupType.CustomTemplate]: 'NOTIFICATIONS.TEMPLATE.CUSTOM_TEMPLATE_CREATED',
    [SecurityGroupType.Shared]: 'NOTIFICATIONS.TEMPLATE.SHARED_GROUP_CREATED'
  };

  private deleteSuccessMessage = {
    [SecurityGroupType.CustomTemplate]: 'NOTIFICATIONS.TEMPLATE.CUSTOM_TEMPLATE_DELETED',
    [SecurityGroupType.Shared]: 'NOTIFICATIONS.TEMPLATE.SHARED_GROUP_DELETED',
    [SecurityGroupType.Private]: 'NOTIFICATIONS.TEMPLATE.PRIVATE_GROUP_DELETED'
  };

  constructor(
    private store: Store<State>,
    private actions$: Actions,
    private securityGroupService: SecurityGroupService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private router: Router,
    private dialog: MatDialog,
    private sgTagService: SecurityGroupTagService
  ) {
  }

  public createSecurityGroup({ mode, data, rules }: SecurityGroupCreationParams): Observable<SecurityGroup> {
    return this.getSecurityGroupCreationRequest(mode, data, rules);
  }

  private getSecurityGroupCreationRequest(
    mode: string,
    data: any,
    rules: Rules
  ): Observable<SecurityGroup> {
    if (mode === SecurityGroupViewMode.Templates) {
      return this.securityGroupService.createTemplate(data, rules);
    } else {
      return this.securityGroupService.createShared(data, rules);
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

  private onSecurityGroupCreated(securityGroup: SecurityGroup): void {
    this.notificationService.message(this.createSuccessMessage[getType(securityGroup)]);
    this.dialog.closeAll();
    this.router.navigate(['../security-group', securityGroup.id], {
      queryParamsHandling: 'preserve'
    });
  }

  public onDeleteConfirmation(securityGroup: SecurityGroup): Observable<any> {
    return this.deleteSecurityGroup(securityGroup)
      .map(() => {
        this.notificationService.message(this.deleteSuccessMessage[getType(securityGroup)]);
      });
  }

  private deleteSecurityGroup(securityGroup: SecurityGroup): Observable<any> {
    return this.securityGroupService.deleteGroup(securityGroup);
  }
}
