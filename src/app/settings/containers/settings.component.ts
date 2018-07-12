import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/first';

import { State } from '../../root-store';
import { SettingsViewModel } from '../view-models';
import { getSettingsViewModel } from '../store/settings.selectors';
import { UpdateSettings } from '../store/settings.action';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { AppConfiguration } from '../../shared/classes/app-configuration';
import { RouterUtilsService } from '../../shared/services/router-utils.service';
import { ApiKeys } from '../../shared/models/account-user.model';
import { BACKEND_API_URL } from '../../shared/services/base-backend.service';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { SnackBarService } from '../../shared/services/snack-bar.service';

@Component({
  selector: 'cs-settings',
  template: `
    <cs-top-bar></cs-top-bar>
    <div class="settings-container">
      <cs-security-settings
        [settings]="settings$ | async"
        (settingsChange)="onSettingsChange($event)"
        (updatePassword)="onUpdatePassword($event)"
      ></cs-security-settings>
      <cs-api-settings
        [userKeys]="userKeys"
        [apiUrl]="apiUrl"
        [apiDocumentationLink]="apiDocumentationLink"
        (regenerateKeys)="onRegenerateKeys()"
      ></cs-api-settings>
      <cs-interface-settings
        [settings]="settings$ | async"
        (settingsChange)="onSettingsChange($event)"
      ></cs-interface-settings>
    </div>
  `,
  styles: [`
    .settings-container {
      margin: 20px;
    }
  `]
})
export class SettingsComponent {
  public settings$: Observable<SettingsViewModel>;
  public userKeys: ApiKeys;
  public apiUrl = 'http';
  public apiDocumentationLink = 'http';

  private readonly userId: string;

  constructor(
    private store: Store<State>,
    private userService: UserService,
    private authService: AuthService,
    private routerUtilsService: RouterUtilsService,
    private dialogService: DialogService,
    private snackBarService: SnackBarService
  ) {
    this.settings$ = this.store.select(getSettingsViewModel);
    this.userId = this.authService.user.userid;
    this.userService.getUserKeys(this.userId).subscribe(keys => this.userKeys = keys);
    this.apiDocumentationLink = AppConfiguration.apiDocumentationLink;
    this.apiUrl = this.getApiUrl();
  }

  public onSettingsChange(updatedSettings: SettingsViewModel) {
    this.store.dispatch(new UpdateSettings(updatedSettings));
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
