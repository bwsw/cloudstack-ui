import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Action, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, filter, first, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { SecurityGroupService } from '../../../security-group/services/security-group.service';
import { Rules } from '../../../shared/components/security-group-builder/rules';
import { getType, SecurityGroup, SecurityGroupType } from '../../../security-group/sg.model';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { SnackBarService } from '../../../core/services';
import { SecurityGroupCreationParams } from '../../../security-group/sg-creation/security-group-creation.component';
import { State } from '../../index';
import * as securityGroup from './sg.actions';
import * as fromSecurityGroups from './sg.reducers';
import { SecurityGroupViewMode } from '../../../security-group/sg-view-mode';
import { SecurityGroupTagService } from '../../../shared/services/tags/security-group-tag.service';
import { configSelectors } from '../../../root-store';

@Injectable()
export class SecurityGroupEffects {
  @Effect()
  loadSecurityGroups$: Observable<Action> = this.actions$.pipe(
    ofType(securityGroup.LOAD_SECURITY_GROUP_REQUEST),
    switchMap(() => {
      return forkJoin([
        this.securityGroupService.getList(),
        this.store.pipe(select(configSelectors.get('securityGroupTemplates')), first())
      ]).pipe(
        map(([groups, templates]) => new securityGroup
          .LoadSecurityGroupResponse(groups.concat(templates))),
        catchError(() => of(new securityGroup.LoadSecurityGroupResponse([]))));
    }));

  @Effect()
  createSecurityGroup$: Observable<Action> = this.actions$.pipe(
    ofType(securityGroup.CREATE_SECURITY_GROUP),
    mergeMap((action: securityGroup.CreateSecurityGroup) => {
      return this.createSecurityGroup(action.payload).pipe(
        tap(() => {
          const message = this.getCreateSuccessMessage(action.payload.mode);
          this.showNotificationsOnFinish(message);
        }),
        map(sg => new securityGroup.CreateSecurityGroupSuccess(sg)),
        catchError(error => {
          this.showNotificationsOnFail(error);
          return of(new securityGroup.CreateSecurityGroupError(error))
        }));
    }));

  @Effect({ dispatch: false })
  createSecurityGroupSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(securityGroup.CREATE_SECURITY_GROUP_SUCCESS),
    tap(() => this.dialog.closeAll()));

  @Effect()
  deleteSecurityGroup$: Observable<Action> = this.actions$.pipe(
    ofType(securityGroup.DELETE_SECURITY_GROUP),
    mergeMap((action: securityGroup.DeleteSecurityGroup) => {
      return this.deleteSecurityGroup(action.payload).pipe(
        tap(() => {
          const message = this.getDeleteSuccessMessage(action.payload);
          this.showNotificationsOnFinish(message);
        }),
        map(() => new securityGroup.DeleteSecurityGroupSuccess(action.payload)),
        catchError(error => {
          this.showNotificationsOnFail(error);
          return of(new securityGroup.DeleteSecurityGroupError(error))
        }));
    }));

  @Effect()
  deletePrivateSecurityGroup$: Observable<Action> = this.actions$.pipe(
    ofType(securityGroup.DELETE_PRIVATE_SECURITY_GROUP),
    withLatestFrom(this.store.pipe(select(fromSecurityGroups.selectAll))),
    map(([action, groups]: [securityGroup.DeletePrivateSecurityGroup, Array<SecurityGroup>]) => {
      const vmGroup = groups.find((group: SecurityGroup) =>
        action.payload.securityGroup &&
        !!action.payload.securityGroup.find(sg => sg.id === group.id) &&
        getType(group) === SecurityGroupType.Private
      );
      return vmGroup;
    }),
    filter((group: SecurityGroup) => !!group),
    mergeMap((group: SecurityGroup) => {
      return this.deleteSecurityGroup(group).pipe(
        tap(() => {
          const message = 'NOTIFICATIONS.FIREWALL.PRIVATE_GROUP_DELETE_DONE';
          this.showNotificationsOnFinish(message);
        }),
        map(() => new securityGroup.DeleteSecurityGroupSuccess(group)),
        catchError(error => {
          this.showNotificationsOnFail(error);
          return of(new securityGroup.DeleteSecurityGroupError(error));
        }));
    }));

  @Effect({ dispatch: false })
  deleteSecurityGroupSuccessNavigate$ = this.actions$.pipe(
    ofType(securityGroup.DELETE_SECURITY_GROUP_SUCCESS),
    map((action: securityGroup.DeleteSecurityGroupSuccess) => action.payload),
    filter((sg: SecurityGroup) => {
      return this.router.isActive(`/security-group/${sg.id}`, false);
    }),
    tap(() => {
      this.router.navigate(['./security-group'], {
        queryParamsHandling: 'preserve'
      });
    }));

  @Effect()
  convertSecurityGroup$: Observable<Action> = this.actions$.pipe(
    ofType(securityGroup.CONVERT_SECURITY_GROUP),
    mergeMap((action: securityGroup.ConvertSecurityGroup) => {
      return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.SECURITY_GROUPS.CONFIRM_CONVERT' })
        .pipe(
          filter(res => Boolean(res)),
          switchMap(() => {
            return this.sgTagService.convertToShared(action.payload)
              .pipe(
                tap(() => {
                  const message = 'NOTIFICATIONS.FIREWALL.CONVERT_PRIVATE_TO_SHARED_DONE';
                  this.showNotificationsOnFinish(message);
                }),
                map((response: SecurityGroup) => {
                  return new securityGroup.ConvertSecurityGroupSuccess(response);
                }),
                catchError(error => {
                  this.showNotificationsOnFail(error);
                  return of(new securityGroup.ConvertSecurityGroupError(error));
                })
              )
          })
        );
    })
  );


  private deleteSuccessMessage = {
    [SecurityGroupType.CustomTemplate]: 'NOTIFICATIONS.FIREWALL.TEMPLATE_DELETE_DONE',
    [SecurityGroupType.Shared]: 'NOTIFICATIONS.FIREWALL.SHARED_GROUP_DELETE_DONE',
    [SecurityGroupType.Private]: 'NOTIFICATIONS.FIREWALL.PRIVATE_GROUP_DELETE_DONE'
  };

  constructor(
    private store: Store<State>,
    private actions$: Actions,
    private securityGroupService: SecurityGroupService,
    private dialogService: DialogService,
    private snackBarService: SnackBarService,
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

  private deleteSecurityGroup(securityGroup: SecurityGroup): Observable<any> {
    return this.securityGroupService.deleteGroup(securityGroup);
  }

  private getCreateSuccessMessage(mode: SecurityGroupViewMode): string {
    switch (mode) {
      case SecurityGroupViewMode.Templates:
        return 'NOTIFICATIONS.FIREWALL.TEMPLATE_CREATION_DONE';
      case SecurityGroupViewMode.Shared:
        return 'NOTIFICATIONS.FIREWALL.SHARED_GROUP_CREATION_DONE';
    }
  }

  private getDeleteSuccessMessage(securityGroup: SecurityGroup): string {
    return this.deleteSuccessMessage[getType(securityGroup)];
  }

  private showNotificationsOnFinish(message: string) {
    this.snackBarService.open(message).subscribe();
  }

  private showNotificationsOnFail(error: any) {
    this.dialogService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params
      }
    });
  }
}
