import { Injectable } from '@angular/core';
import {
  Actions,
  Effect
} from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import {
  Action,
  Store
} from '@ngrx/store';
import { TemplateService } from '../shared/template.service';
import {
  TemplateFilters,
  TemplateResourceType
} from '../shared/base-template.service';
import { AuthService } from '../../shared/services/auth.service';
import { IsoService } from '../shared/iso.service';
import { Template } from '../shared/template.model';
import { Iso } from '../shared/iso.model';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { NotificationService } from '../../shared/services/notification.service';
import { State } from '../../reducers/index';
import { TemplateGroup } from '../../shared/models/template-group.model';
import { TemplateTagService } from '../../shared/services/tags/template-tag.service';

import * as template from './template.actions';
import * as templateGroup from './template-group.actions';
import * as fromTemplateGroups from './template-group.reducers';

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
      return (action.payload.resourceType === TemplateResourceType.iso.toUpperCase()
        ? this.isoService.remove(action.payload)
        : this.templateService.remove(action.payload))
        .map((removedTemplate) => new template.RemoveTemplateSuccess(removedTemplate))
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
      const groupId = action.payload.groupId;
     
      const setGroup = (temp, groupId) => {
        return this.templateTagService.setGroup(temp, { id: groupId })
          .switchMap(newTemplate =>{
            this.store.dispatch(new template.SetTemplateGroupSuccess(newTemplate));
            return Observable.of(newTemplate);
          })
          .catch(error => Observable.of(new template.SetTemplateGroupError(error)));
      };

      if (action.payload.entity === TemplateResourceType.iso) {
        return this.isoService.register(action.payload);
      } else if (action.payload.snapshotId) {
        return this.templateService.create(action.payload)
          .switchMap(newTemplate => setGroup(newTemplate, groupId));
      } else {
        return this.templateService.register(action.payload);
      }
    })
    .map(createdTemplate => new template.CreateTemplateSuccess(createdTemplate))
    .catch((error: Error) => Observable.of(new template.CreateTemplateError(error)));

  /*
  * @Effect()
  changeServiceOffering$: Observable<Action> = this.actions$
    .ofType(vmActions.VM_CHANGE_SERVICE_OFFERING)
    .switchMap((action: vmActions.ChangeServiceOffering) => {
      const vmState = action.payload.vm.state;

      const change = (action) => {
        const notificationId = this.jobsNotificationService.add('JOB_NOTIFICATIONS.VM.CHANGE_SERVICE_OFFERING_IN_PROGRESS');

        return this.vmService
          .changeServiceOffering(action.payload.offering, action.payload.vm)
          .switchMap((newVm) => {
            if (vmState === VmState.Running) {
              this.store.dispatch(new vmActions.UpdateVM(new VirtualMachine(newVm), {
                id: notificationId,
                message: 'JOB_NOTIFICATIONS.VM.CHANGE_SERVICE_OFFERING_DONE'
              }));
              return this.start(newVm);
            }
            return Observable.of(new vmActions.UpdateVM(new VirtualMachine(newVm), {
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VM.CHANGE_SERVICE_OFFERING_DONE'
            }));
          })
          .catch((error: Error) => {
            return Observable.of(new vmActions.VMUpdateError(error,  {
              id: notificationId,
              message: 'JOB_NOTIFICATIONS.VM.CHANGE_SERVICE_OFFERING_FAILED'
            }));
          });
      };

      if (!this.isVMStopped(action.payload.vm)) {
        return this.stop(action.payload.vm)
          .switchMap(() => change(action));
      } else {
        return change(action);
      }

    });
  * */

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
    .do((action: template.SetTemplateGroupError) => {
      this.onErrorNotify(this.errorTemplateGroupSet);
    });


  private successTemplateCreate = 'NOTIFICATIONS.TEMPLATE.CUSTOM_TEMPLATE_CREATED';
  private successTemplateRemove = 'NOTIFICATIONS.TEMPLATE.CUSTOM_TEMPLATE_DELETED';
  private errorTemplateGroupSet = 'NOTIFICATIONS.TEMPLATE.TEMPLATE_GROUP_SET_ERROR';

  constructor(
    private actions$: Actions,
    private templateService: TemplateService,
    private isoService: IsoService,
    private authService: AuthService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private store: Store<State>,
    private templateTagService: TemplateTagService
  ) {
  }

  private onNotify(template: any, message: string) {
    this.notificationService.message({
      translationToken: message,
      interpolateParams: { name: template.name }
    });
  }

  private onErrorNotify(message: string) {
    this.notificationService.error(message);
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
