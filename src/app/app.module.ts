import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from 'ng2-translate';
import { MdlModule } from 'angular2-mdl';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginFormComponent } from './login-form/login-form.component';

import {
  ApiService,
  ApiRequestBuilderService,
  AlertService,
  ConfigReaderService,
  StorageService,
  AuthService,
  NotificationService,
  RootDiskSizeService
} from './shared';

import { routing } from './app.routing';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    TranslateModule.forRoot(),
    routing,
    RouterModule,
    MdlModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    LoginFormComponent
  ],
  providers: [
    ApiService,
    ApiRequestBuilderService,
    AlertService,
    {provide: 'IStorageService', useClass: StorageService},
    AuthService,
    ConfigReaderService,
    NotificationService,
    RootDiskSizeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {}

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
