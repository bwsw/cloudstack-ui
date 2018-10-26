import { APP_INITIALIZER, ApplicationRef, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DragulaModule } from 'ng2-dragula';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { select, Store } from '@ngrx/store';
import { createInputTransfer, removeNgStyles } from '@angularclass/hmr';
import { filter, first, take } from 'rxjs/operators';
import { AccountModule } from './account/accounts.module';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { configSelectors, RootStoreModule, State, UserTagsActions } from './root-store';
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
import { VmLogsModule } from './vm-logs/vm-logs.module';

// tslint:disable-next-line:function-name
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}

// tslint:disable-next-line:function-name
export function InitAppFactory(
  auth: AuthService,
  http: HttpClient,
  translateService: TranslateService,
  store: Store<State>,
) {
  return () =>
    store
      .pipe(
        select(configSelectors.isLoaded),
        filter(Boolean),
        first(),
      )
      .toPromise()
      .then(() =>
        store
          .pipe(
            select(configSelectors.get('defaultInterfaceLanguage')),
            first(),
          )
          .subscribe(lang => translateService.setDefaultLang(lang)),
      )
      .then(() => auth.initUser())
      .then(() =>
        store
          .pipe(
            select(configSelectors.getDefaultUserTags),
            first(),
          )
          .subscribe(tags =>
            store.dispatch(new UserTagsActions.SetDefaultUserTagsAtStartup({ tags })),
          ),
      );
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
    VmLogsModule,
    TemplateModule,
    VmModule,
    AccountModule,
    NgIdleKeepaliveModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [AppComponent, HomeComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: InitAppFactory,
      deps: [AuthService, HttpClient, TranslateService, Store],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(public appRef: ApplicationRef, private store: Store<any>) {}

  hmrOnInit(store) {
    if (!store || !store.rootState) {
      return;
    }
    // restore state by dispatch a SET_ROOT_STATE action
    if (store.rootState) {
      this.store.dispatch({
        type: 'SET_ROOT_STATE',
        payload: store.rootState,
      });
    }
    if ('restoreInputValues' in store) {
      store.restoreInputValues();
    }
    // this.appRef.tick();  <<< REMOVE THIS LINE, or store will not work after HMR
    Object.keys(store).forEach(prop => delete store[prop]);
  }

  hmrOnDestroy(store) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    this.store.pipe(take(1)).subscribe(s => (store.rootState = s));
    store.disposeOldHosts = this.createNewHosts(cmpLocation);
    store.restoreInputValues = createInputTransfer();
    removeNgStyles();
  }

  hmrAfterDestroy(store) {
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

  createNewHosts(cmps) {
    const components = Array.prototype.map.call(cmps, componentNode => {
      const newNode = document.createElement(componentNode.tagName);
      const currentDisplay = newNode.style.display;
      newNode.style.display = 'none';
      if (!!componentNode.parentNode) {
        const parentNode = componentNode.parentNode;
        parentNode.insertBefore(newNode, componentNode);
        return function removeOldHost() {
          newNode.style.display = currentDisplay;
          try {
            parentNode.removeChild(componentNode);
          } catch (e) {}
        };
      }
      return function() {}; // make it callable
    });
    return function removeOldHosts() {
      components.forEach(removeOldHost => {
        return removeOldHost();
      });
    };
  }
}
