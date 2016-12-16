import { TestBed, getTestBed } from '@angular/core/testing';
import { provideRoutes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ApiService } from './shared';
import { AppComponent } from './app.component';
import { TranslateModule } from 'ng2-translate';

import { MdlModule } from 'angular2-mdl';
import { MdlPopoverModule } from '@angular2-mdl-ext/popover';

import {
  AuthService,
  StorageService,
  ErrorService
} from './shared/services';

import { MockNotificationService } from './shared/notification.service';

import { Injector } from '@angular/core';
import { ServiceLocator } from './shared/services/service-locator';
import { LogoutComponent } from './auth/logout.component';
import { NotificationBoxComponent } from './notification-box.component';
import { NotificationBoxItemComponent } from './notification-box-item.component';

describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        MdlModule,
        MdlPopoverModule
      ],
      declarations: [
        AppComponent,
        LogoutComponent,
        NotificationBoxComponent,
        NotificationBoxItemComponent
      ],
      providers: [
        ApiService,
        AuthService,
        ErrorService,
        Injector,
        { provide: 'IStorageService', useClass: StorageService },
        { provide: 'INotificationService', useClass: MockNotificationService },
        ServiceLocator,
        provideRoutes([])]
    });

    ServiceLocator.injector = getTestBed().get(Injector);
  });

  it('should have an url', () => {
    let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.componentInstance.url).toEqual('https://github.com/preboot/angular2-webpack');
  });

});
