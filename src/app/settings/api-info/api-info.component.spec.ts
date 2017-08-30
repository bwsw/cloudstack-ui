import { MdlModule } from '@angular-mdl/core';
import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MdTooltipModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClipboardModule } from 'ngx-clipboard/dist';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { InputGroupComponent } from '../../shared/components/input-group/input-group.component';
import { ConfigService } from '../../shared/services/config.service';
import { RouterUtilsService } from '../../shared/services/router-utils.service';
import { UserService } from '../../shared/services/user.service';
import { DialogModule } from '../../dialog/dialog-service/dialog.module';
import { ApiInfoComponent } from './api-info.component';
import { LoadingDirective } from '../../shared/directives/loading.directive';
import { MockNotificationService } from '../../../testutils/mocks/mock-notification.service';
import { NotificationService } from '../../shared/services/notification.service';


describe('Api Info component', () => {
  let fixture;
  let component;
  let dialogSpy;
  let dialogObservable;

  class MockRouterUtilsService {
    public getLocationOrigin(): string {
      return 'https://cloudstack.ui';
    }

    public getBaseHref(): string {
      return '/';
    }
  }

  class MockUserService {
    public registerKeys(): Observable<any> {
      return Observable.of({
        apikey: 'newApiKey',
        secretkey: 'newSecretKey'
      });
    }

    public getList(): Observable<any> {
      return Observable.of([{
        apiKey: 'apiKey',
        secretKey: 'secretKey'
      }]);
    }
  }

  class MockConfigService {
    public get(key: string) {
      return 'https://api.url';
    }
  }

  class MockTranslateService {
    public onTranslationChange = new Subject();
    public onLangChange = new Subject();
    public onDefaultLangChange = new Subject();
    public get(key: string | Array<string>): Observable<string | any> {
      return Observable.of(key);
    }
  }

  beforeEach(async(() => {
    dialogObservable = Observable.of(true);
    dialogSpy = spyOn(DialogService.prototype, 'confirm').and.returnValue(dialogObservable);

    TestBed.configureTestingModule({
      imports: [
        MdTooltipModule,
        MdlModule,
        FormsModule,
        TranslateModule,
        ClipboardModule,
        DialogModule
      ],
      declarations: [
        ApiInfoComponent,
        InputGroupComponent,
        LoadingDirective
      ],
      providers: [
        { provide: ConfigService, useClass: MockConfigService },
        { provide: DialogService, useClass: DialogService },
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: RouterUtilsService, useClass: MockRouterUtilsService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: UserService, useClass: MockUserService }
      ]
    });

    fixture = TestBed.createComponent(ApiInfoComponent);
    component = fixture.componentInstance;
  }));

  it('fetches api info', fakeAsync(() => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.linkFields.apiDocLink).toEqual({
      href: 'https://api.url',
      title: 'SETTINGS.API_CONFIGURATION.API_DOC_LINK'
    });
    expect(component.linkFields.apiUrl).toEqual({
      title: 'SETTINGS.API_CONFIGURATION.API_URL',
      href: 'https://cloudstack.ui/client/api'
    });

    expect(component.inputFields).toEqual({
      apiKey: {
        title: 'SETTINGS.API_CONFIGURATION.API_KEY',
        value: 'apiKey'
      },
      apiSecretKey: {
        title: 'SETTINGS.API_CONFIGURATION.API_SECRET_KEY',
        value: 'secretKey'
      }
    });

    tick();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      tick();
      fixture.detectChanges();
      const inputFields = fixture.debugElement.queryAll(By.css('.mdl-textfield__input'));
      expect(inputFields[0].nativeElement.value).toBe('apiKey');
      expect(inputFields[1].nativeElement.value).toBe('secretKey');
    });
  }));

  it('it regenerates API keys', fakeAsync(() => {
    component.ngOnInit();
    fixture.detectChanges();

    const syncButton = fixture.debugElement.query(By.css('mdl-button[mdl-button-type="icon"]'));
    syncButton.triggerEventHandler('click');

    tick();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      tick();
      fixture.detectChanges();
      expect(component.inputFields).toEqual({
        apiKey: {
          title: 'SETTINGS.API_CONFIGURATION.API_KEY',
          value: 'newApiKey'
        },
        apiSecretKey: {
          title: 'SETTINGS.API_CONFIGURATION.API_SECRET_KEY',
          value: 'newSecretKey'
        }
      });

      tick();
      const inputFields = fixture.debugElement.queryAll(By.css('.mdl-textfield__input'));
      expect(inputFields[0].nativeElement.value).toBe('newApiKey');
      expect(inputFields[1].nativeElement.value).toBe('newSecretKey');
    });
  }));
});
