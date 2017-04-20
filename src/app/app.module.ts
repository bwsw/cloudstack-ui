import { ApplicationRef, Injector, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MdlPopoverModule } from '@angular2-mdl-ext/popover';
import { MdlSelectModule } from '@angular2-mdl-ext/select';
import { createNewHosts, removeNgStyles } from '@angularclass/hmr';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DISABLE_NATIVE_VALIDITY_CHECKING, MdlDialogService, MdlModule } from 'angular2-mdl';

import { AppComponent } from './app.component';
import { routes } from './app.routing';
import { LoginComponent } from './auth/login.component';
import { EventsModule } from './events/events.module';
import { SecurityGroupModule } from './security-group/sg.module';
import { ServiceOfferingModule } from './service-offering/service-offering.module';
import { SettingsModule } from './settings/settings.module';
import { CustomDialogService } from './shared/services/custom-dialog.service';
import { ServiceLocator } from './shared/services/service-locator';
import { SharedModule } from './shared/shared.module';
import { SpareDriveModule } from './spare-drive';
import { SshKeysModule } from './ssh-keys/ssh-keys.module';
import { TemplateModule } from './template';
import { VmModule } from './vm';


export function HttpLoaderFactory(http: Http): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    TranslateModule.forRoot(),
    EventsModule,
    MdlModule,
    MdlPopoverModule,
    MdlSelectModule,
    SecurityGroupModule,
    ServiceOfferingModule,
    SettingsModule,
    SpareDriveModule,
    SshKeysModule,
    TemplateModule,
    VmModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    RouterModule.forRoot(routes)
  ],
  declarations: [
    AppComponent,
    LoginComponent
  ],
  providers: [
    { provide: DISABLE_NATIVE_VALIDITY_CHECKING, useValue: true },
    { provide: MdlDialogService, useClass: CustomDialogService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public appRef: ApplicationRef, private injector: Injector) {
    ServiceLocator.injector = this.injector;
  }

  public hmrOnInit(store): void {
    // tslint:disable-next-line
    console.log('HMR store', store);
  }

  public hmrOnDestroy(store): void {
    let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }

  public hmrAfterDestroy(store): void {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
