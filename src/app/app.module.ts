import { NgModule, ApplicationRef, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { MdlModule } from 'angular2-mdl';
import { MdlPopoverModule } from '@angular2-mdl-ext/popover';

import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login.component';
import { LogoutComponent } from './auth/logout.component';
import { VmListComponent } from './vm/vm-list.component';
import { VmListItemComponent } from './vm/vm-list-item.component';
import { NotificationBoxComponent } from './notification-box.component';
import { NotificationBoxItemComponent } from './notification-box-item.component';

import {
  ApiService,
  AsyncJobService,
  StorageService,
  AuthService,
  AuthGuard,
  ErrorService,
  JobsNotificationService,
  JobStreamService,
  LoginGuard,
  ZoneService,
  ServiceOfferingService,
  ServiceLocator,
  RootDiskSizeService,
  VolumeService,
  OsTypeService
} from './shared/services';

import { VmService } from './vm/vm.service';

import { NotificationService } from './shared/notification.service';

import { routing } from './app.routing';

import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
import { DISABLE_NATIVE_VALIDITY_CHECKING } from 'angular2-mdl';


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    TranslateModule.forRoot(),
    routing,
    MdlModule,
    MdlPopoverModule
  ],
  declarations: [
    AboutComponent,
    AppComponent,
    LoginComponent,
    LogoutComponent,
    VmListComponent,
    VmListItemComponent,
    NotificationBoxComponent,
    NotificationBoxItemComponent
  ],
  providers: [
    ApiService,
    AuthGuard,
    AsyncJobService,
    AuthService,
    ErrorService,
    JobStreamService,
    JobsNotificationService,
    { provide: 'INotificationService', useClass: NotificationService },
    { provide: 'IStorageService', useClass: StorageService },
    LoginGuard,
    NotificationService,
    RootDiskSizeService,
    ZoneService,
    { provide: DISABLE_NATIVE_VALIDITY_CHECKING, useValue: true },
    ServiceOfferingService,
    VmService,
    VolumeService,
    OsTypeService,
    {provide: 'IStorageService', useClass: StorageService},
    VmService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public appRef: ApplicationRef, private injector: Injector) {
    ServiceLocator.injector = this.injector;
  }

  public hmrOnInit(store) {
    console.log('HMR store', store);
  }

  public hmrOnDestroy(store) {
    let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }

  public hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
