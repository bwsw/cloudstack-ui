import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { configSelectors, State, UserTagsActions } from '../../../root-store';
import { SettingsViewModel } from '../../view-models';
import { getSettingsViewModel } from '../../selectors';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';
import { RouterUtilsService } from '../../../shared/services/router-utils.service';
import { ApiKeys } from '../../../shared/models/account-user.model';
import { BACKEND_API_URL } from '../../../shared/services/base-backend.service';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { SnackBarService } from '../../../core/services';
import { DayOfWeek, Language, TimeFormat } from '../../../shared/types';
import { SettingsPageViewMode } from '../../types/settings-page-view-mode';
import { FilterService } from '../../../shared/services/filter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from '../../../shared/services/session-storage.service';
import * as userTagsSelectors from '../../../root-store/server-data/user-tags/user-tags.selectors';
import * as accountTagsSelectors from '../../../reducers/account-tags/redux/account-tags.reducers';
import { accountResourceType } from '../../../shared/models';
import { TagCreationParams } from '../../../root-store/server-data/user-tags/tag-creation-params';
import * as accountTagActions from '../../../reducers/account-tags/redux/account-tags.actions';

@Component({
  selector: 'cs-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  public settings$: Observable<SettingsViewModel> = this.store.pipe(select(getSettingsViewModel));
  public userKeys: ApiKeys;
  public apiUrl: string;
  public apiDocumentationLink$: Observable<string> = this.store.pipe(
    select(configSelectors.get('apiDocLink')),
  );
  public viewMode: any;
  public viewModeList = SettingsPageViewMode;
  public logViewEnabled$ = this.store.pipe(
    select(configSelectors.get('extensions')),
    map(extensions => extensions.vmLogs),
  );

  public userTags$ = this.store.pipe(select(userTagsSelectors.selectAll));
  public userTagsIsLoading$ = this.store.pipe(
    select(userTagsSelectors.getIsLoaded),
    map(isLoaded => !isLoaded),
  );

  public accountTags$ = this.store.pipe(select(accountTagsSelectors.selectAll));
  public accountTagIsLoading$ = this.store.pipe(
    select(accountTagsSelectors.isLoaded),
    map(isLoaded => !isLoaded),
  );

  private readonly userId: string;

  private filterService = new FilterService(
    {
      viewMode: {
        type: 'string',
        options: [
          SettingsPageViewMode.Security,
          SettingsPageViewMode.API,
          SettingsPageViewMode.VmPreferences,
          SettingsPageViewMode.UserTags,
          SettingsPageViewMode.AccountTags,
          SettingsPageViewMode.LookAndFeel,
          SettingsPageViewMode.LogView,
        ],
        defaultOption: SettingsPageViewMode.Security,
      },
    },
    this.router,
    this.sessionStorage,
    'settingsFilters',
    this.activatedRoute,
  );

  constructor(
    private store: Store<State>,
    private userService: UserService,
    private authService: AuthService,
    private routerUtilsService: RouterUtilsService,
    private dialogService: DialogService,
    private snackBarService: SnackBarService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sessionStorage: SessionStorageService,
  ) {
    this.store.dispatch(
      new accountTagActions.LoadAccountTagsRequest({ resourcetype: accountResourceType }),
    );
    this.viewMode = this.filterService.getParams().viewMode;
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['viewMode']) {
        this.viewMode = params['viewMode'];
      }
    });
    this.userId = this.authService.user.userid;
    this.userService.getUserKeys(this.userId).subscribe(keys => (this.userKeys = keys));
    this.apiUrl = this.getApiUrl();
  }

  public onRegenerateKeys() {
    this.askToRegenerateKeys()
      .pipe(filter(Boolean))
      .subscribe(() =>
        this.userService
          .registerKeys(this.userId)
          .subscribe(keys => (this.userKeys = keys), this.handleError),
      );
  }

  public onPasswordChange(password: string) {
    this.askToUpdatePassword()
      .pipe(filter(Boolean))
      .subscribe(() =>
        this.userService
          .updatePassword(this.userId, password)
          .subscribe(
            () =>
              this.snackBarService
                .open('SETTINGS.SECURITY.PASSWORD_CHANGED_SUCCESSFULLY')
                .subscribe(),
            this.handleError,
          ),
      );
  }

  public onSessionTimeoutChange(timeout: number) {
    this.store.dispatch(new UserTagsActions.UpdateSessionTimeout({ value: timeout }));
  }

  public onIsSavePasswordForVMsChange(value: boolean) {
    this.store.dispatch(new UserTagsActions.UpdateSavePasswordForAllVMs({ value }));
  }

  public onInterfaceLanguageChange(lang: Language) {
    this.store.dispatch(new UserTagsActions.UpdateInterfaceLanguage({ value: lang }));
  }

  public onFirstDayOfWeekChange(day: DayOfWeek) {
    this.store.dispatch(new UserTagsActions.UpdateFirstDayOfWeek({ value: day }));
  }

  public onTimeFormatChange(timeFormat: TimeFormat) {
    this.store.dispatch(new UserTagsActions.UpdateTimeFormat({ value: timeFormat }));
  }

  public onThemeChange(theme: string) {
    this.store.dispatch(new UserTagsActions.UpdateTheme({ value: theme }));
  }

  public onKeyboardLayoutChange(keyboard: string) {
    this.store.dispatch(new UserTagsActions.UpdateKeyboardLayoutForVms({ value: keyboard }));
  }

  public onVmLogsMessagesChange(messages: number) {
    this.store.dispatch(new UserTagsActions.UpdateVmLogsShowLastMessages({ value: messages }));
  }

  public onVmLogsMinutesChange(minutes: number) {
    this.store.dispatch(new UserTagsActions.UpdateVmLogsShowLastMinutes({ value: minutes }));
  }

  public onViewModeChange(viewMode: SettingsPageViewMode) {
    this.filterService.update({ viewMode });
  }

  public onAddUserTag(tag: TagCreationParams) {
    this.store.dispatch(new UserTagsActions.CreateTag(tag));
  }

  public onDeleteUserTag(tag: TagCreationParams) {
    this.store.dispatch(new UserTagsActions.DeleteTag(tag.key));
  }

  public onEditUserTag(tag) {
    this.store.dispatch(
      new UserTagsActions.UpdateTag({ newTag: tag.newTag, oldKey: tag.oldTag.key }),
    );
  }

  public onAddAccountTag(tag: TagCreationParams) {
    this.store.dispatch(new accountTagActions.CreateTag(tag));
  }

  public onDeleteAccountTag(tag: TagCreationParams) {
    this.store.dispatch(new accountTagActions.DeleteTag(tag.key));
  }

  public onEditAccountTag(tag) {
    this.store.dispatch(
      new accountTagActions.UpdateTag({ newTag: tag.newTag, oldKey: tag.oldTag.key }),
    );
  }

  private getApiUrl() {
    const origin = this.routerUtilsService.getLocationOrigin();
    const baseHref = this.routerUtilsService.getBaseHref();
    return `${origin}${baseHref}${BACKEND_API_URL}`;
  }

  private askToRegenerateKeys(): Observable<any> {
    return this.dialogService.confirm({
      message: 'SETTINGS.API_CONFIGURATION.ASK_GENERATE_KEYS',
      confirmText: 'SETTINGS.API_CONFIGURATION.GENERATE',
      declineText: 'COMMON.CANCEL',
    });
  }

  private askToUpdatePassword(): Observable<any> {
    return this.dialogService.confirm({
      message: 'SETTINGS.SECURITY.ASK_TO_UPDATE_PASSWORD',
      confirmText: 'COMMON.UPDATE',
      declineText: 'COMMON.CANCEL',
    });
  }

  private handleError(error: any) {
    this.dialogService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params,
      },
    });
  }
}
