import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import * as uniqBy from 'lodash/uniqBy';

import { TemplateService } from '../../../template/shared/template.service';
import { TemplateFilters, TemplateResourceType } from '../../../template/shared/base-template.service';
import { AuthService } from '../../../shared/services/auth.service';
import { IsoService } from '../../../template/shared/iso.service';
import { Template } from '../../../template/shared/template.model';
import { Iso } from '../../../template/shared/iso.model';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { State } from '../../../reducers/index';
import { TemplateTagService } from '../../../shared/services/tags/template-tag.service';
import { BaseTemplateModel } from '../../../template/shared/base-template.model';
import { MatDialog } from '@angular/material';
import * as template from './template.actions';
import * as templateGroup from './template-group.actions';
import * as fromTemplateGroups from './template-group.reducers';

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
    .switchMap((action: template.RemoveTemplate) => {
      return (action.payload.resourceType === TemplateResourceType.iso.toUpperCase()
        ? this.isoService.remove(action.payload)
        : this.templateService.remove(action.payload))
        .map(removedTemplate => new template.RemoveTemplateSuccess(removedTemplate))
        .catch((error: Error) => Observable.of(new template.RemoveTemplateError(error)));
    });

  @Effect({ dispatch: false })
  removeTemplateError$: Observable<Action> = this.actions$
    .ofType(template.TEMPLATE_REMOVE_ERROR)
    .do((action: template.RemoveTemplateError) => {
      this.handleError(action.payload);
    });

  @Effect({ dispatch: false })
  removeTemplateSuccess$: Observable<BaseTemplateModel> = this.actions$
    .ofType(template.TEMPLATE_REMOVE_SUCCESS)
    .do(() => {
      this.notificationService.message('NOTIFICATIONS.TEMPLATE.CUSTOM_TEMPLATE_DELETED');
    })
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
  createTemplate$: Observable<Action> = this.actions$
    .ofType(template.TEMPLATE_CREATE)
    .switchMap((action: template.CreateTemplate) => {
      return (action.payload.entity === TemplateResourceType.iso
        ? this.isoService.register(action.payload)
        : action.payload.snapshotId
          ? this.templateService.create(action.payload)
          : this.templateService.register(action.payload))
        .map(createdTemplate => new template.CreateTemplateSuccess(createdTemplate))
        .catch((error: Error) => Observable.of(new template.CreateTemplateError(error)));
    });

  @Effect({ dispatch: false })
  createTemplateError$: Observable<Action> = this.actions$
    .ofType(template.TEMPLATE_CREATE_ERROR)
    .do((action: template.CreateTemplateError) => {
      this.handleError(action.payload);
    });

  @Effect({ dispatch: false })
  createTemplateSuccess$: Observable<Action> = this.actions$
    .ofType(template.TEMPLATE_CREATE_SUCCESS)
    .do(() => {
      this.notificationService.message('NOTIFICATIONS.TEMPLATE.CUSTOM_TEMPLATE_CREATED');
      this.dialog.closeAll();
    });

  @Effect()
  setTemplateGroup$: Observable<Action> = this.actions$
    .ofType(template.SET_TEMPLATE_GROUP)
    .switchMap((action: template.SetTemplateGroup) => this.templateTagService.setGroup(
      action.payload.template,
      action.payload.templateGroup
    )
      .map(temp => new template.SetTemplateGroupSuccess(temp))
      .catch(error => Observable.of(new template.SetTemplateGroupError(error))));

  @Effect()
  resetTemplateGroup$: Observable<Action> = this.actions$
    .ofType(template.RESET_TEMPLATE_GROUP)
    .switchMap((action: template.ResetTemplateGroup) =>
      this.templateTagService.resetGroup(action.payload)
        .map(temp => new template.ResetTemplateGroupSuccess(action.payload))
        .catch(error => Observable.of(new template.SetTemplateGroupError(error))));

  @Effect({ dispatch: false })
  setTemplateGroupError$: Observable<Action> = this.actions$
    .ofType(template.SET_TEMPLATE_GROUP_ERROR)
    .do(() => {
      this.notificationService.error('NOTIFICATIONS.TEMPLATE.TEMPLATE_GROUP_SET_ERROR');
    });


  constructor(
    private actions$: Actions,
    private templateService: TemplateService,
    private isoService: IsoService,
    private authService: AuthService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private store: Store<State>,
    private templateTagService: TemplateTagService,
    private router: Router,
    private dialog: MatDialog
  ) {
  }

  private handleError(error: any): void {
    this.dialogService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params
      }
    });
  }
}
