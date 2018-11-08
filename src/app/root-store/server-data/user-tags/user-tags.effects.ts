import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, exhaustMap, first, map, mergeMap, switchMap } from 'rxjs/operators';
import { Utils } from '../../../shared/services/utils/utils.service';

import {
  IncrementLastVMId,
  IncrementLastVMIdError,
  IncrementLastVMIdSuccess,
  LoadUserTags,
  LoadUserTagsError,
  LoadUserTagsSuccess,
  SetSavePasswordForAllVMs,
  SetSavePasswordForAllVMsError,
  SetSavePasswordForAllVMsSuccess,
  UpdateAskToCreateVM,
  UpdateAskToCreateVMError,
  UpdateAskToCreateVMSuccess,
  UpdateAskToCreateVolume,
  UpdateAskToCreateVolumeError,
  UpdateAskToCreateVolumeSuccess,
  UpdateCustomServiceOfferingParams,
  UpdateFirstDayOfWeek,
  UpdateFirstDayOfWeekError,
  UpdateFirstDayOfWeekSuccess,
  UpdateInterfaceLanguage,
  UpdateInterfaceLanguageError,
  UpdateInterfaceLanguageSuccess,
  UpdateKeyboardLayoutForVms,
  UpdateKeyboardLayoutForVmsError,
  UpdateKeyboardLayoutForVmsSuccess,
  UpdateLastVMId,
  UpdateLastVMIdError,
  UpdateLastVMIdSuccess,
  UpdateSavePasswordForAllVMs,
  UpdateSavePasswordForAllVMsError,
  UpdateSavePasswordForAllVMsSuccess,
  UpdateSessionTimeout,
  UpdateSessionTimeoutError,
  UpdateSessionTimeoutSuccess,
  UpdateShowSystemTags,
  UpdateShowSystemTagsError,
  UpdateShowSystemTagsSuccess,
  UpdateTheme,
  UpdateThemeError,
  UpdateThemeSuccess,
  UpdateTimeFormat,
  UpdateTimeFormatError,
  UpdateTimeFormatSuccess,
  UpdateVmLogsFilters,
  UpdateVmLogsFiltersError,
  UpdateVmLogsFiltersSuccess,
  UserTagsActionTypes,
} from './user-tags.actions';
import { TagService } from '../../../shared/services/tags/tag.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ServiceOffering, Tag } from '../../../shared/models';
import { userTagKeys } from '../../../tags/tag-keys';
import { State } from '../../state';
import * as userTagsSelectors from './user-tags.selectors';
import {
  StartIdleMonitor,
  UpdateIdleMonitorTimeout,
} from '../../idle-monitor/idle-monitor.actions';

interface TagCreationParams {
  key: string;
  value: string;
}

@Injectable()
export class UserTagsEffects {
  @Effect()
  loadUserTags$: Observable<Action> = this.actions$.pipe(
    ofType<LoadUserTags>(UserTagsActionTypes.LoadUserTags),
    switchMap(() =>
      this.loadTags().pipe(
        map((tags: Tag[]) => new LoadUserTagsSuccess({ tags })),
        catchError(error => of(new LoadUserTagsError({ error }))),
      ),
    ),
  );

  @Effect()
  startIdleMonitor$: Observable<Action> = this.actions$.pipe(
    ofType<LoadUserTagsSuccess>(UserTagsActionTypes.LoadUserTagsSuccess),
    map(() => new StartIdleMonitor()),
  );

  @Effect()
  updateAskToCreateVM$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateAskToCreateVM>(UserTagsActionTypes.UpdateAskToCreateVM),
    map(action => `${action.payload.value}`),
    mergeMap((value: string) => {
      const key = userTagKeys.askToCreateVM;
      return this.upsertTag({ key, value }).pipe(
        map(() => new UpdateAskToCreateVMSuccess({ key, value })),
        catchError(error => of(new UpdateAskToCreateVMError({ error }))),
      );
    }),
  );

  @Effect()
  updateAskToCreateVolume$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateAskToCreateVolume>(UserTagsActionTypes.UpdateAskToCreateVolume),
    map(action => `${action.payload.value}`),
    mergeMap((value: string) => {
      const key = userTagKeys.askToCreateVolume;
      return this.upsertTag({ key, value }).pipe(
        map(() => new UpdateAskToCreateVolumeSuccess({ key, value })),
        catchError(error => of(new UpdateAskToCreateVolumeError({ error }))),
      );
    }),
  );

  @Effect()
  updateSPFAVM$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateSavePasswordForAllVMs>(UserTagsActionTypes.UpdateSPFAVM),
    map(action => `${action.payload.value}`),
    mergeMap((value: string) => {
      const key = userTagKeys.savePasswordForAllVMs;
      return this.upsertTag({ key, value }).pipe(
        map(() => new UpdateSavePasswordForAllVMsSuccess({ key, value })),
        catchError(error => of(new UpdateSavePasswordForAllVMsError({ error }))),
      );
    }),
  );

  @Effect()
  updateFirstDayOfWeek$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateFirstDayOfWeek>(UserTagsActionTypes.UpdateFirstDayOfWeek),
    map(action => `${action.payload.value}`),
    mergeMap((value: string) => {
      const key = userTagKeys.firstDayOfWeek;
      return this.upsertTag({ key, value }).pipe(
        map(() => new UpdateFirstDayOfWeekSuccess({ key, value })),
        catchError(error => of(new UpdateFirstDayOfWeekError({ error }))),
      );
    }),
  );

  @Effect()
  updateInterfaceLanguage$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateInterfaceLanguage>(UserTagsActionTypes.UpdateInterfaceLanguage),
    map(action => action.payload.value),
    mergeMap((value: string) => {
      const key = userTagKeys.lang;
      return this.upsertTag({ key, value }).pipe(
        map(() => new UpdateInterfaceLanguageSuccess({ key, value })),
        catchError(error => of(new UpdateInterfaceLanguageError({ error }))),
      );
    }),
  );

  @Effect()
  updateLastVmId$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateLastVMId>(UserTagsActionTypes.UpdateLastVMId),
    map(action => `${action.payload.value}`),
    mergeMap((value: string) => {
      const key = userTagKeys.lastVMId;
      return this.upsertTag({ key, value }).pipe(
        map(() => new UpdateLastVMIdSuccess({ key, value })),
        catchError(error => of(new UpdateLastVMIdError({ error }))),
      );
    }),
  );

  @Effect()
  updateSessionTimeout$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateSessionTimeout>(UserTagsActionTypes.UpdateSessionTimeout),
    map(action => `${action.payload.value}`),
    mergeMap((value: string) => {
      const key = userTagKeys.sessionTimeout;
      return this.upsertTag({ key, value }).pipe(
        map(() => new UpdateSessionTimeoutSuccess({ key, value })),
        catchError(error => of(new UpdateSessionTimeoutError({ error }))),
      );
    }),
  );

  @Effect()
  updateIdleMonitor$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateSessionTimeoutSuccess>(UserTagsActionTypes.UpdateSessionTimeoutSuccess),
    map(action => new UpdateIdleMonitorTimeout({ timeout: +action.payload.value })),
  );

  @Effect()
  updateShowSystemTags$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateShowSystemTags>(UserTagsActionTypes.UpdateShowSystemTags),
    map(action => `${action.payload.value}`),
    mergeMap((value: string) => {
      const key = userTagKeys.showSystemTags;
      return this.upsertTag({ key, value }).pipe(
        map(() => new UpdateShowSystemTagsSuccess({ key, value })),
        catchError(error => of(new UpdateShowSystemTagsError({ error }))),
      );
    }),
  );

  @Effect()
  updateTimeFormat$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateTimeFormat>(UserTagsActionTypes.UpdateTimeFormat),
    map(action => action.payload.value),
    mergeMap((value: string) => {
      const key = userTagKeys.timeFormat;
      return this.upsertTag({ key, value }).pipe(
        map(() => new UpdateTimeFormatSuccess({ key, value })),
        catchError(error => of(new UpdateTimeFormatError({ error }))),
      );
    }),
  );

  @Effect()
  updateTheme$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateTheme>(UserTagsActionTypes.UpdateTheme),
    map(action => action.payload.value),
    mergeMap((value: string) => {
      const key = userTagKeys.theme;
      return this.upsertTag({ key, value }).pipe(
        map(() => new UpdateThemeSuccess({ key, value })),
        catchError(error => of(new UpdateThemeError({ error }))),
      );
    }),
  );

  @Effect()
  setSavePasswordForAllVms$: Observable<Action> = this.actions$.pipe(
    ofType<SetSavePasswordForAllVMs>(UserTagsActionTypes.SetSPFAVM),
    map(action => `${action.payload.value}`),
    exhaustMap((value: string) => {
      const key = userTagKeys.savePasswordForAllVMs;
      return this.createTag({ key, value }).pipe(
        map(() => new SetSavePasswordForAllVMsSuccess({ key, value })),
        catchError(error => of(new SetSavePasswordForAllVMsError({ error }))),
      );
    }),
  );

  @Effect()
  incrementLastVMId$: Observable<Action> = this.actions$.pipe(
    ofType<IncrementLastVMId>(UserTagsActionTypes.IncrementLastVMId),
    mergeMap(() =>
      this.store.pipe(
        select(userTagsSelectors.getLastVMId),
        first(),
      ),
    ),
    mergeMap(id => {
      const key = userTagKeys.lastVMId;
      const value = `${id + 1}`;
      return this.upsertTag({ key, value }).pipe(
        map(() => new IncrementLastVMIdSuccess({ key, value })),
        catchError(error => of(new IncrementLastVMIdError({ error }))),
      );
    }),
  );

  @Effect()
  updateKeyboardLayoutForVms$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateKeyboardLayoutForVms>(UserTagsActionTypes.UpdateKeyboardLayoutForVms),
    map(action => action.payload.value),
    mergeMap((value: string) => {
      const key = userTagKeys.keyboardLayoutForVms;
      return this.upsertTag({ key, value }).pipe(
        map(() => new UpdateKeyboardLayoutForVmsSuccess({ key, value })),
        catchError(error => of(new UpdateKeyboardLayoutForVmsError({ error }))),
      );
    }),
  );

  @Effect()
  updateVmLogsFilters$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateVmLogsFilters>(UserTagsActionTypes.UpdateVmLogsFilters),
    map((action: UpdateVmLogsFilters) => action.payload),
    mergeMap(filters => {
      const tags = Object.keys(filters).map(tagKey => {
        const filterNameKebabCase = Utils.convertCamelCaseToKebabCase(tagKey);

        return {
          key: `${userTagKeys.vmLogsFilter}.${filterNameKebabCase}`,
          value: filters[tagKey],
        };
      });

      return this.upsertTag(tags).pipe(
        map(() => new UpdateVmLogsFiltersSuccess({ key, value })),
        catchError(error => of(new UpdateVmLogsFiltersError({ error }))),
      );
    }),
  );

  @Effect({ dispatch: false })
  updateCustomServiceOfferingParams$: Observable<any> = this.actions$.pipe(
    ofType<UpdateCustomServiceOfferingParams>(
      UserTagsActionTypes.UpdateCustomServiceOfferingParams,
    ),
    mergeMap(action => this.setComputeOfferingParams(action.payload.offering)),
  );

  private readonly resourceType = 'User';

  private get resourceId(): string | null {
    return this.authService.user.userid;
  }

  constructor(
    private actions$: Actions,
    private tagService: TagService,
    private authService: AuthService,
    private store: Store<State>,
  ) {}

  private setComputeOfferingParams(offering: ServiceOffering) {
    const cpuNumberKey = `${userTagKeys.computeOfferingParam}.${offering.id}.cpunumber`;
    const cpuSpeedKey = `${userTagKeys.computeOfferingParam}.${offering.id}.cpuspeed`;
    const memoryKey = `${userTagKeys.computeOfferingParam}.${offering.id}.memory`;

    return forkJoin(
      this.upsertTag({
        key: cpuNumberKey,
        value: offering.cpunumber && offering.cpunumber.toString(),
      }),
      this.upsertTag({
        key: cpuSpeedKey,
        value: offering.cpuspeed && offering.cpuspeed.toString(),
      }),
      this.upsertTag({
        key: memoryKey,
        value: offering.memory && offering.memory.toString(),
      }),
    );
  }

  private loadTags() {
    return this.tagService.getList({
      resourceid: this.resourceId,
    });
  }

  private upsertTag(tag: TagCreationParams | TagCreationParams[]) {
    const tagsArray = [].concat(tag);

    return this.deleteTag(tagsArray).pipe(
      switchMap(() => this.createTag(tagsArray)),
      catchError(() => this.createTag(tagsArray)),
    );
  }

  private deleteTag(keys: { key: string }[]) {
    const tagsData = keys.reduce(
      (acc, key, index) => ({
        ...acc,
        [`tags[${index}.key]`]: key,
      }),
      {},
    );

    return this.tagService.remove({
      resourceids: this.resourceId,
      resourcetype: this.resourceType,
      // 'tags[0].key': key,
      ...tagsData,
    });
  }

  private createTag(tag: TagCreationParams | TagCreationParams[]) {
    const tagsArray = [].concat(tag);
    const tagsData = tagsArray.reduce(
      (acc, { key, value }, index) => ({
        ...acc,
        [`tags[${index}].key`]: key,
        [`tags[${index}].value`]: value,
      }),
      {},
    );

    return this.tagService.create({
      resourceids: this.resourceId,
      resourcetype: this.resourceType,
      // 'tags[0].key': key,
      // 'tags[0].value': value,
      ...tagsData,
    });
  }
}
