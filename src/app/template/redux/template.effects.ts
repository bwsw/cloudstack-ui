import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { TemplateService } from '../shared/template.service';
import { TemplateFilters, TemplateResourceType } from '../shared/base-template.service';
import { AuthService } from '../../shared/services/auth.service';
import { IsoService } from '../shared/iso.service';
import { Template } from '../shared/template.model';
import { Iso } from '../shared/iso.model';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { NotificationService } from '../../shared/services/notification.service';

import * as template from './template.actions';
import * as templateGroup from './template-group.actions';
import * as fromTemplateGroups from './template-group.reducers';
import { State } from '../../reducers/index';
import { TemplateGroup } from '../../shared/models/template-group.model';

@Injectable()
export class TemplateEffects {
  private templateGroups$ = this.store.select(fromTemplateGroups.selectAll);

  @Effect()
  loadTemplates$: Observable<Action> = this.actions$
    .ofType(template.LOAD_TEMPLATE_REQUEST)
    .switchMap((action: template.LoadTemplatesRequest) => {
      this.loadTemplateGroups();

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
  loadTemplatesByZoneId$: Observable<Action> = this.actions$
    .ofType(template.DIALOG_LOAD_TEMPLATE_REQUEST)
    .map((action: template.DialogLoadTemplatesRequest) =>
      new template.LoadTemplatesRequest());

  @Effect()
  removeTemplate$: Observable<Action> = this.actions$
    .ofType(template.TEMPLATE_REMOVE)
    .switchMap((action: template.RemoveTemplate) => {
      return (action.payload.entity === TemplateResourceType.iso
        ? this.isoService.remove(action.payload)
        : this.templateService.remove(action.payload))
        .map(() => new template.RemoveTemplateSuccess(action.payload))
        .catch((error: Error) => Observable.of(new template.RemoveTemplateError(error)));
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
      if (action.payload.entity === TemplateResourceType.iso) {
        return this.isoService.register(action.payload);
      } else if (action.payload.snapshotId) {
        return this.templateService.create(action.payload);
      } else {
        return this.templateService.register(action.payload);
      }
    })
    .map(createdTemplate => new template.CreateTemplateSuccess(createdTemplate))
    .catch((error: Error) => Observable.of(new template.CreateTemplateError(error)));

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
    private notificationService: NotificationService,
    private store: Store<State>
  ) {
  }

  private onNotify(template: any, message: string) {
    this.notificationService.message({
      translationToken: message,
      interpolateParams: { name: template.name }
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

  private loadTemplateGroups() {
    this.templateGroups$.subscribe((templates: TemplateGroup[]) => {
      if (!templates.length) {
        this.store.dispatch(new templateGroup.LoadTemplateGroupsRequest());
      }
    });
  }
}
