// This shows a different way of testing a component, check about for a simpler one
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from 'ng2-translate';
import { RouterTestingModule } from '@angular/router/testing';

import { HomeComponent } from '../home/home.component';

import {
  AuthService,
  StorageService
} from '../shared/services';

import {
  MdlLayoutModule,
  MdlRippleModule,
} from 'angular2-mdl';

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
        {provide: 'IStorageService', useClass: StorageService},
      ],
    });
  });

  it('should ...', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
  });
});
