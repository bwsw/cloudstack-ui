import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { Injector, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import {
  MdButtonModule,
  MdCheckboxModule,
  MdDialog,
  MdIconModule,
  MdInputModule,
  MdProgressSpinnerModule,
  MdSidenavModule,
  MdTooltipModule
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
import { ServiceLocator } from './shared/services/service-locator';
import { SharedModule } from './shared/shared.module';
import { SnapshotModule } from './snapshot/snapshot.module';
import { SpareDriveModule } from './spare-drive';
import { SshKeysModule } from './ssh-keys/ssh-keys.module';
import { TemplateModule } from './template';
import { VmModule } from './vm';


export function HttpLoaderFactory(http: Http): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}

@NgModule({
  imports: [
    // Be sure to import the Angular Material modules after Angular's
    // BrowserModule, as the import order matters for NgModules.
    BrowserModule,
    BrowserAnimationsModule,
    SnapshotModule,
    HttpModule,
    FormsModule,
    TranslateModule.forRoot(),
    EventsModule,
    DragulaModule,
    MdButtonModule,
    MdCheckboxModule,
    MdSidenavModule,
    MdIconModule,
    MdInputModule,
    MdTooltipModule,
    MdProgressSpinnerModule,
    ScrollDispatchModule,
    DialogModule,
    SecurityGroupModule,
    ServiceOfferingModule,
    SettingsModule,
    VmModule,
    SpareDriveModule,
    SshKeysModule,
    TemplateModule,
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
    AppSidebarComponent,
    LoginComponent,
    LogoutComponent,
    HomeComponent
  ],
  providers: [MdDialog],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    ServiceLocator.injector = this.injector;
  }
}
