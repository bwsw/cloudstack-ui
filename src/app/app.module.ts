import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Store } from '@ngrx/store';
import { DragulaModule } from 'ng2-dragula';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

import { AccountModule } from './account/accounts.module';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { RootStoreModule, State, UserTagsActions } from './root-store';
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
import { AuthModule } from './auth/auth.module';
import { VmModule } from './vm';

import { HomeComponent } from './home/home.component';
import { AppComponent } from './app.component';

import { AuthService } from './shared/services/auth.service';
import { BaseHttpInterceptor } from './shared/services/base-http-interceptor';
import { ConfigService, SystemTagsService } from './core/services';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}

export function InitAppFactory(
  auth: AuthService,
  http: HttpClient,
  translateService: TranslateService,
  configService: ConfigService,
  store: Store<State>,
  systemTagsService: SystemTagsService
) {
  return () => http.get('config/config.json').toPromise()
    .then(
      data => configService.initialize(data),
      () => configService.initialize()
    )
    .then(() => translateService.setDefaultLang(configService.get('defaultInterfaceLanguage')))
    .then(() => auth.initUser())
    .then(() => store.dispatch(new UserTagsActions.SetDefaultUserTagsAtStartup({
      tags: systemTagsService.getDefaultUserTags()
    })));
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
    AppRoutingModule,
    RootStoreModule,
    DialogModule,
    HttpClientModule,
    DragulaModule,
    AuthModule,
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
    NgIdleKeepaliveModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [
    AppComponent,
    HomeComponent
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: InitAppFactory,
      deps: [AuthService, HttpClient, TranslateService, ConfigService, Store, SystemTagsService],
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
