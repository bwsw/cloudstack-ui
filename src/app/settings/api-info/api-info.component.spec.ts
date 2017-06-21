import { MdlModule } from '@angular-mdl/core';
import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClipboardModule } from 'ngx-clipboard/dist';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { ConfigService } from '../../shared/services/config.service';
import { RouterUtilsService } from '../../shared/services/router-utils.service';
import { UserService } from '../../shared/services/user.service';
import { SharedModule } from '../../shared/shared.module';
import { ApiInfoComponent } from './api-info.component';

describe('Api Info component', () => {
  let fixture;
  let component;
  let dialogSpy;
  let dialogObservable;

  class FakeRouterUtilsService {
    public getLocationOrigin(): string {
      return 'https://cloudstack.ui';
    }

    public getBaseHref(): string {
      return '/';
    }
  }

  class FakeUserService {
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

  class FakeConfigService {
    public get(_key: string): Observable<any> {
      return Observable.of('https://api.url');
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
    dialogObservable = new Subject();
    dialogSpy = spyOn(DialogService.prototype, 'confirm').and.returnValue(dialogObservable);

    TestBed.configureTestingModule({
      imports: [
        MdlModule,
        FormsModule,
        TranslateModule,
        ClipboardModule,
        SharedModule
      ],
      declarations: [ApiInfoComponent],
      providers: [
        { provide: RouterUtilsService, useClass: FakeRouterUtilsService },
        { provide: ConfigService, useClass: FakeConfigService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: UserService, useClass: FakeUserService }
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
      title: 'API_DOC_LINK'
    });
    expect(component.linkFields.apiUrl).toEqual({
      title: 'API_URL', href: 'https://cloudstack.ui/client/api'
    });

    expect(component.inputFields).toEqual({
      apiKey: { title: 'API_KEY', value: 'apiKey' },
      apiSecretKey: { title: 'API_SECRET_KEY', value: 'secretKey' }
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
    dialogObservable.next();

    tick();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      tick();
      fixture.detectChanges();
      expect(component.inputFields).toEqual({
        apiKey: { title: 'API_KEY', value: 'newApiKey' },
        apiSecretKey: { title: 'API_SECRET_KEY', value: 'newSecretKey' }
      });

      tick();
      const inputFields = fixture.debugElement.queryAll(By.css('.mdl-textfield__input'));
      expect(inputFields[0].nativeElement.value).toBe('newApiKey');
      expect(inputFields[1].nativeElement.value).toBe('newSecretKey');
    });
  }));
});
