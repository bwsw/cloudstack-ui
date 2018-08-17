import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { State, UserTagsActions } from '../../../root-store/index';
import { SettingsViewModel } from '../../view-models';
import { getSettingsViewModel } from '../../selectors';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';
import { RouterUtilsService } from '../../../shared/services/router-utils.service';
import { ApiKeys } from '../../../shared/models/account-user.model';
import { BACKEND_API_URL } from '../../../shared/services/base-backend.service';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { ConfigService, SnackBarService } from '../../../core/services';
import { DayOfWeek, Language, TimeFormat } from '../../../shared/types';

@Component({
  selector: 'cs-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  public settings$: Observable<SettingsViewModel>;
  public userKeys: ApiKeys;
  public apiUrl: string;
  public apiDocumentationLink: string;

  private readonly userId: string;

  constructor(
    private store: Store<State>,
    private userService: UserService,
    private authService: AuthService,
    private routerUtilsService: RouterUtilsService,
    private dialogService: DialogService,
    private snackBarService: SnackBarService,
    private configService: ConfigService
  ) {
    this.settings$ = this.store.select(getSettingsViewModel);
    this.userId = this.authService.user.userid;
    this.userService.getUserKeys(this.userId).subscribe(keys => this.userKeys = keys);
    this.apiDocumentationLink = this.configService.get('apiDocLink');
    this.apiUrl = this.getApiUrl();
  }

  public onRegenerateKeys() {
    this.askToRegenerateKeys()
      .filter(Boolean)
      .subscribe(() =>
        this.userService.registerKeys(this.userId).subscribe(
          keys => this.userKeys = keys,
          this.handleError
        ));
  }

  public onUpdatePassword(password: string) {
    this.askToUpdatePassword()
      .filter(Boolean)
      .subscribe(() =>
        this.userService
          .updatePassword(this.userId, password)
          .subscribe(
            () => this.snackBarService.open('SETTINGS.SECURITY.PASSWORD_CHANGED_SUCCESSFULLY').subscribe(),
            this.handleError
          )
      )
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

  private getApiUrl() {
    const origin = this.routerUtilsService.getLocationOrigin();
    const baseHref = this.routerUtilsService.getBaseHref();
    return `${origin}${baseHref}${BACKEND_API_URL}`;
  }

  private askToRegenerateKeys(): Observable<any> {
    return this.dialogService.confirm({
      message: 'SETTINGS.API_CONFIGURATION.ASK_GENERATE_KEYS',
      confirmText: 'SETTINGS.API_CONFIGURATION.GENERATE',
      declineText: 'COMMON.CANCEL'
    })
  }

  private askToUpdatePassword(): Observable<any> {
    return this.dialogService.confirm({
      message: 'SETTINGS.SECURITY.ASK_TO_UPDATE_PASSWORD',
      confirmText: 'COMMON.UPDATE',
      declineText: 'COMMON.CANCEL'
    })
  }

  private handleError(error: any) {
    this.dialogService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params
      }
    });
  }
}
