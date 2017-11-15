import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { TemplateService } from '../shared/template.service';
import { TemplateFilters } from '../shared/base-template.service';
import { AuthService } from '../../shared/services/auth.service';
import { IsoService } from '../shared/iso.service';
import { Template } from '../shared/template.model';
import { Iso } from '../shared/iso.model';

import * as template from './template.actions';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable()
export class TemplateEffects {
  @Effect()
  loadFilterTemplatesByGroupings$: Observable<Action> = this.actions$
    .ofType(template.TEMPLATE_FILTER_UPDATE)
    .map((action: template.TemplatesFilterUpdate) =>
      new template.LoadTemplatesRequest(action.payload));

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
      } else if (action.payload.selectedTypes && action.payload.selectedTypes.length) {
        filters = action.payload.selectedTypes;
      }

      return Observable.forkJoin(
        this.templateService.getGroupedTemplates<Template>({}, filters, true)
          .map(_ => _.toArray()),
        this.isoService.getGroupedTemplates<Iso>({}, filters, true)
          .map(_ => _.toArray())
      )
        .map(([templates, isos]) => {
          return new template.LoadTemplatesResponse([
            ...templates,
            ...isos
          ]);
        });
    });

  @Effect()
  removeTemplate$: Observable<Action> = this.actions$
    .ofType(template.TEMPLATE_REMOVE)
    .switchMap((action: template.RemoveTemplate) => {
      return this.templateService.remove(action.payload)
        .map(() => {
          return new template.RemoveTemplateSuccess(action.payload);
        })
        .catch((error: Error) => {
          return Observable.of(new template.RemoveTemplateError(action.payload));
        })
    });

  @Effect({ dispatch: false })
  removeTemplateError$: Observable<Action> = this.actions$
    .ofType(template.TEMPLATE_REMOVE_ERROR)
    .do((action: template.RemoveTemplateError) => {
      this.handleError(action.payload);
    });

  @Effect({ dispatch: false })
  removeTemplateSuccess$: Observable<Action> = this.actions$
    .ofType(template.TEMPLATE_REMOVE_SUCCESS)
    .do((action: template.RemoveTemplateSuccess) => {
      this.onNotify(action.payload, this.successTemplateRemove);
    });

  @Effect()
  createTemplate$: Observable<Action> = this.actions$
    .ofType(template.TEMPLATE_CREATE)
    .switchMap((action: template.CreateTemplate) => {
      if (action.payload.entity === 'Iso') {
        this.isoService.register(action.payload);
      } else if (action.payload.snapshotId) {
        return this.templateService.create(action.payload);
      } else {
        return this.templateService.register(action.payload);
      }
    })
    .map(createdTemplate => new template.CreateTemplateSuccess(createdTemplate))
    .catch((error: Error) => {
      return Observable.of(new template.CreateTemplateError(error));
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
    .do((action: template.CreateTemplateSuccess) => {
      this.onNotify(action.payload, this.successTemplateCreate);
    });

  private successTemplateCreate = 'NOTIFICATIONS.TEMPLATE.CUSTOM_TEMPLATE_CREATED';
  private successTemplateRemove = 'NOTIFICATIONS.TEMPLATE.CUSTOM_TEMPLATE_DELETED';

  constructor(
    private actions$: Actions,
    private templateService: TemplateService,
    private isoService: IsoService,
    private authService: AuthService,
    private dialogService: DialogService,
    private notificationService: NotificationService
  ) {
  }

  private onNotify(template: any, message: string) {
    this.notificationService.message({
      translationToken: message,
      interpolateParams: { name:  template.name}
    });
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
