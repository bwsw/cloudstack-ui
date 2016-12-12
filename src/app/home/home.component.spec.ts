// This shows a different way of testing a component, check about for a simpler one
import { TestBed, getTestBed } from '@angular/core/testing';
import { TranslateModule } from 'ng2-translate';
import { RouterTestingModule } from '@angular/router/testing';

import { HomeComponent } from './home.component';

import {
  AuthService,
  StorageService
} from '../shared/services';

import { MockNotificationService } from '../shared/notification.service';

import {
  MdlLayoutModule,
  MdlRippleModule,
} from 'angular2-mdl';
import { Injector } from '@angular/core';
import { ServiceLocator } from '../shared/services/service-locator';

describe('Home Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        MdlRippleModule,
        MdlLayoutModule,
        RouterTestingModule
      ],
      declarations: [
        HomeComponent
      ],
      providers: [
        AuthService,
        Injector,
        {provide: 'IStorageService', useClass: StorageService},
        {provide: 'INotificationService', useClass: MockNotificationService}
      ],
    });

    ServiceLocator.injector = getTestBed().get(Injector);
  });

  it('should ...', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
  });
});
