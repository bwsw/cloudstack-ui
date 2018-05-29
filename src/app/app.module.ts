import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { DragulaModule } from 'ng2-dragula';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './material/material.module';
import { DialogModule } from './dialog/dialog-service/dialog.module';
import { EventsModule } from './events/events.module';
import { SecurityGroupModule } from './security-group/sg.module';
import { ServiceOfferingModule } from './service-offering/service-offering.module';
import { SettingsModule } from './settings/settings.module';
import { SnapshotModule } from './snapshot/snapshot.module';
import { VolumeModule } from './volume';
import { SshKeysModule } from './ssh-keys/ssh-keys.module';
import { TemplateModule } from './template';
import { VmModule } from './vm';
import { AccountModule } from './account/accounts.module';

import { AppComponent } from './app.component';
import { routes } from './app.routing';
import { LoginComponent } from './auth/login.component';
import { LogoutComponent } from './auth/logout.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './shared/services/auth.service';
import { BaseHttpInterceptor } from './shared/services/base-http-interceptor';
import { ConfigService } from './shared/services/config.service';
import { LanguageService } from './shared/services/language.service';
import { environment } from '../environments/environment';
import { metaReducers, reducers } from './reducers/index';
import { CustomRouterStateSerializer } from './shared/services/utils/utils.service';

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
    CoreModule,
    SharedModule,
    MaterialModule,
    BrowserAnimationsModule,
    DialogModule,
    HttpClientModule,
    DragulaModule,
    EventsModule,
    ScrollDispatchModule,
    SecurityGroupModule,
    ServiceOfferingModule,
    SettingsModule,
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseHttpInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
