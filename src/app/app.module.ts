import { NgModule, ApplicationRef, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { MdlModule, DISABLE_NATIVE_VALIDITY_CHECKING } from 'angular2-mdl';
import { MdlPopoverModule } from '@angular2-mdl-ext/popover';
import { MdlSelectModule } from '@angular2-mdl-ext/select';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login.component';
import { LogoutComponent } from './auth/logout.component';
import { VmCreateComponent } from './vm/vm-create.component';
import { VmCreationTemplateComponent } from './vm/vm-creation-template/vm-creation-template.component';
import { VmCreationTemplateDialogComponent } from './vm/vm-creation-template/vm-creation-template-dialog.component';
import {
  VmCreationTemplateDialogListElementComponent
} from './vm/vm-creation-template/vm-creation-template-dialog-list-element.component';
import { VmListComponent } from './vm/vm-list.component';
import { VmListItemComponent } from './vm/vm-list-item.component';
import { VmStatisticsComponent } from './vm/vm-statistics.component';
import { VmDetailComponent } from './vm/vm-detail.component';
import { NotificationBoxComponent } from './notification-box.component';
import { NotificationBoxItemComponent } from './notification-box-item.component';
import { ServiceLocator } from './shared/services';
import { VmService } from './vm/vm.service';
import { routing } from './app.routing';
import { SecurityGroupModule } from './security-group/security-group.module';
import { SharedModule } from './shared/shared.module';


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    TranslateModule.forRoot(),
    routing,
    MdlModule,
    MdlPopoverModule,
    MdlSelectModule,
    SecurityGroupModule,
    SharedModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    VmCreateComponent,
    VmCreationTemplateComponent,
    VmCreationTemplateDialogComponent,
    VmCreationTemplateDialogListElementComponent,
    VmListComponent,
    VmDetailComponent,
    VmListItemComponent,
    VmStatisticsComponent,
    NotificationBoxComponent,
    NotificationBoxItemComponent,
  ],
  entryComponents: [
    VmCreationTemplateDialogComponent,
    VmCreationTemplateDialogListElementComponent
  ],
  providers: [
    { provide: DISABLE_NATIVE_VALIDITY_CHECKING, useValue: true },
    VmService,
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
