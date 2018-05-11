import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialog,
  MatIconRegistry,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatTooltipModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DragulaModule } from 'ng2-dragula';

import { AppComponent } from './app.component';
import { routes } from './app.routing';
import { LoginComponent } from './auth/login.component';
import { LogoutComponent } from './auth/logout.component';
import { DialogModule } from './dialog/dialog-service/dialog.module';
import { EventsModule } from './events/events.module';
import { HomeComponent } from './home/home.component';
import { AppSidebarComponent } from './navigation/app-sidebar.component';
import { SecurityGroupModule } from './security-group/sg.module';
import { ServiceOfferingModule } from './service-offering/service-offering.module';
import { SettingsModule } from './settings/settings.module';
import { AuthService } from './shared/services/auth.service';
import { BaseHttpInterceptor } from './shared/services/base-http-interceptor';
import { SharedModule } from './shared/shared.module';
import { SnapshotModule } from './snapshot/snapshot.module';
import { VolumeModule } from './volume';
import { SshKeysModule } from './ssh-keys/ssh-keys.module';
import { TemplateModule } from './template';
import { VmModule } from './vm';
import { ConfigService } from './shared/services/config.service';
import { LanguageService } from './shared/services/language.service';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { environment } from '../environments/environment';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { metaReducers, reducers } from './reducers/index';
import { CustomRouterStateSerializer } from './shared/services/utils/utils.service';
import { AccountModule } from './account/accounts.module';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}

export function InitAppFactory(
  auth: AuthService,
  http: HttpClient,
  languageService: LanguageService,
  configService: ConfigService
) {
  return () => http.get('config/config.json').toPromise()
    .then(data => configService.parse(data))
    .then(() => languageService.applyLanguage(languageService.defaultLanguage))
    .then(() => auth.initUser());
}

@NgModule({
  imports: [
    // Be sure to import the Angular Material modules after Angular's
    // BrowserModule, as the import order matters for NgModules.
    BrowserModule,
    BrowserAnimationsModule,
    DialogModule,
    HttpClientModule,
    FormsModule,
    DragulaModule,
    EventsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatTooltipModule,
    ScrollDispatchModule,
    SecurityGroupModule,
    ServiceOfferingModule,
    SettingsModule,
    SharedModule,
    SnapshotModule,
    VolumeModule,
    SshKeysModule,
    TemplateModule,
    VmModule,
    AccountModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forRoot(routes),
    StoreModule.forRoot(reducers, { metaReducers }),

    /**
     * @ngrx/router-store keeps router state up-to-date in the store.
     */
    StoreRouterConnectingModule,


    !environment.production ? StoreDevtoolsModule.instrument() : [],

    EffectsModule.forRoot([]),
  ],
  declarations: [
    AppComponent,
    AppSidebarComponent,
    LoginComponent,
    LogoutComponent,
    HomeComponent
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },
    {
      provide: APP_INITIALIZER,
      useFactory: InitAppFactory,
      deps: [AuthService, HttpClient, LanguageService, ConfigService],
      multi: true
    },
    MatDialog,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseHttpInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry) {
    matIconRegistry.setDefaultFontSetClass('mdi');
  }
}
