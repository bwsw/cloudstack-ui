import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import * as uniqBy from 'lodash/uniqBy';

import { TemplateFilters, TemplateResourceType } from '../../../template/shared/base-template.service';
import { AuthService } from '../../../shared/services/auth.service';
import { SnackBarService } from '../../../core/services';
import { State } from '../../../reducers/index';
import { TemplateTagService } from '../../../shared/services/tags/template-tag.service';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { BaseTemplateModel, Iso, IsoService, Template, TemplateService } from '../../../template/shared';
import { MatDialog } from '@angular/material';
import * as template from './template.actions';
import * as templateGroup from './template-group.actions';
import * as fromTemplateGroups from './template-group.reducers';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';

@Injectable()
export class TemplateEffects {
  @Effect()
  loadTemplates$: Observable<Action> = this.actions$
    .ofType(template.LOAD_TEMPLATE_REQUEST)
    .switchMap((action: template.LoadTemplatesRequest) => {
      let filters = [
        TemplateFilters.featured,
        TemplateFilters.self
      ];

      if (this.authService.isAdmin()) {
        filters = [TemplateFilters.all];
      } else if (action.payload && action.payload.selectedTypes
        && action.payload.selectedTypes.length) {
        filters = action.payload.selectedTypes;
      }

      return Observable.forkJoin(
        this.templateService.getGroupedTemplates<Template>({}, filters, true)
          .map(_ => _.toArray()),
        this.isoService.getGroupedTemplates<Iso>({}, filters, true)
          .map(_ => _.toArray())
      )
        .withLatestFrom(this.store.select(fromTemplateGroups.selectAll))
        .map(([[templates, isos], groups]) =>
          [[uniqBy(templates, 'id'), uniqBy(isos, 'id')], groups])
        .switchMap(([[templates, isos], groups]) => {
          return groups && groups.length
            ? Observable.of(new template.LoadTemplatesResponse([...templates, ...isos]))
            : [
              new template.LoadTemplatesResponse([...templates, ...isos]),
              new templateGroup.LoadTemplateGroupsRequest()
            ];
        })
        .catch(error => Observable.of(new template.LoadTemplatesResponse([])));
    });

  @Effect()
  removeTemplate$: Observable<Action> = this.actions$
    .ofType(template.TEMPLATE_REMOVE)
    .mergeMap((action: template.RemoveTemplate) => {
      const isIso = action.payload.resourceType === TemplateResourceType.iso.toUpperCase();
      const progressMessage = isIso
        ? 'NOTIFICATIONS.ISO.DELETION_IN_PROGRESS'
        : 'NOTIFICATIONS.TEMPLATE.DELETION_IN_PROGRESS';
      const notificationId = this.jobsNotificationService.add(progressMessage);
      return (isIso ? this.isoService.remove(action.payload) : this.templateService.remove(action.payload))
        .do(() => {
          const message = isIso
            ? 'NOTIFICATIONS.ISO.DELETION_DONE'
            : 'NOTIFICATIONS.TEMPLATE.DELETION_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        })
        .map(removedTemplate => new template.RemoveTemplateSuccess(removedTemplate))
        .catch((error: Error) => {
          const message = isIso
            ? 'NOTIFICATIONS.ISO.DELETION_FAILED'
            : 'NOTIFICATIONS.TEMPLATE.DELETION_FAILED';
          this.showNotificationsOnFail(error, message, notificationId);
          return Observable.of(new template.RemoveTemplateError(error))
        });
    });

  @Effect({ dispatch: false })
  removeTemplateSuccess$: Observable<BaseTemplateModel> = this.actions$
    .ofType(template.TEMPLATE_REMOVE_SUCCESS)
    .map((action: template.RemoveTemplateSuccess) => action.payload)
    .filter((template: BaseTemplateModel) => {
      return this.router.isActive(`/templates/${template.path}/${template.id}`, false);
    })
    .do(() => {
      this.router.navigate(['./templates'], {
        queryParamsHandling: 'preserve'
      });
    });

  @Effect()
  registerTemplate$: Observable<Action> = this.actions$
    .ofType(template.TEMPLATE_REGISTER)
    .switchMap((action: template.RegisterTemplate) => {
      const isIso = action.payload.entity === TemplateResourceType.iso;
      return (isIso ? this.isoService.register(action.payload) : this.templateService.register(action.payload))
        .do(() => {
          const message = isIso
            ? 'NOTIFICATIONS.ISO.REGISTER_DONE'
            : 'NOTIFICATIONS.TEMPLATE.REGISTER_DONE';
          this.showNotificationsOnFinish(message);
        })
        .map(createdTemplate => new template.RegisterTemplateSuccess(createdTemplate))
        .catch((error: Error) => {
          this.showNotificationsOnFail(error);
          return Observable.of(new template.RegisterTemplateError(error))
        });
    });

  @Effect()
  createTemplate$: Observable<Action> = this.actions$
    .ofType(template.TEMPLATE_CREATE)
    .mergeMap((action: template.CreateTemplate) => {
      const notificationId = this.jobsNotificationService.add('NOTIFICATIONS.TEMPLATE.CREATION_IN_PROGRESS');
      return this.templateService.create(action.payload)
        .do(() => {
          const message = 'NOTIFICATIONS.TEMPLATE.CREATION_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        })
        .map(createdTemplate => new template.CreateTemplateSuccess(createdTemplate))
        .catch((error: Error) => {
          const message = 'NOTIFICATIONS.TEMPLATE.CREATION_FAILED';
          this.showNotificationsOnFail(error, message, notificationId);
          return Observable.of(new template.CreateTemplateError(error))
        });
    });

  @Effect({ dispatch: false })
  registerAndCreateTemplateSuccess$: Observable<Action> = this.actions$
    .ofType(
      template.TEMPLATE_REGISTER_SUCCESS,
      template.TEMPLATE_CREATE_SUCCESS
    )
    .do(() => this.dialog.closeAll());

  @Effect()
  setTemplateGroup$: Observable<Action> = this.actions$
    .ofType(template.SET_TEMPLATE_GROUP)
    .mergeMap((action: template.SetTemplateGroup) => this.templateTagService.setGroup(
      action.payload.template,
      action.payload.templateGroup
    )
      .map(temp => new template.SetTemplateGroupSuccess(temp))
      .catch(error => Observable.of(new template.SetTemplateGroupError(error))));

  @Effect()
  resetTemplateGroup$: Observable<Action> = this.actions$
    .ofType(template.RESET_TEMPLATE_GROUP)
    .mergeMap((action: template.ResetTemplateGroup) =>
      this.templateTagService.resetGroup(action.payload)
        .map(temp => new template.ResetTemplateGroupSuccess(action.payload))
        .catch(error => Observable.of(new template.SetTemplateGroupError(error))));


  constructor(
    private actions$: Actions,
    private templateService: TemplateService,
    private isoService: IsoService,
    private authService: AuthService,
    private store: Store<State>,
    private templateTagService: TemplateTagService,
    private router: Router,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private snackBarService: SnackBarService,
    private jobsNotificationService: JobsNotificationService
  ) {
  }

  private showNotificationsOnFinish(message: string, jobNotificationId?: string) {
    if (jobNotificationId) {
      this.jobsNotificationService.finish({
        id: jobNotificationId,
        message
      });
    }
    this.snackBarService.open(message).subscribe();
  }

  private showNotificationsOnFail(error: any, message?: string, jobNotificationId?: string) {
    if (jobNotificationId) {
      this.jobsNotificationService.fail({
        id: jobNotificationId,
        message
      });
    }
    this.dialogService.alert({ message: {
        translationToken: error.message,
        interpolateParams: error.params
      }
    });
  }
}
