import { Component, Injector } from '@angular/core';
import { TestBed, async, getTestBed, fakeAsync, tick } from '@angular/core/testing';

import { Observable } from 'rxjs';
import { DialogService } from './dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { MdlDialogService } from './mdl-dialog.service';
import { MdlDialogOutletModule } from '../dialog-outlet-module';
import { ServiceLocator } from '../../shared/services/service-locator';


@Component({
  selector: 'cs-test-view',
  template: '<div></div><dialog-outlet></dialog-outlet>'
})
class TestViewComponent {}

describe('Custom dialog', () => {
  let el;
  let fixture;
  let dialogService;

  const translations = {
    TRANSLATE_TEST: 'test',
    TRANSLATE_CANCEL: 'cancel',
    TRANSLATE_OK: 'ok'
  };

  class TranslateServiceStub {

    public get(key: string | Array<string>, interpolateParams?: Object): Observable<string | any> {
      let interpolateString = '';
      for (let k in interpolateParams) {
        if (interpolateParams.hasOwnProperty(k)) {
          interpolateString += interpolateParams[k];
        }
      }

      if (typeof key === 'string') {
        if (key === 'TRANSLATE_INTERPOLATE') {
          return Observable.of(interpolateString);
        }

        if (translations[key]) {
          return Observable.of(translations[key]);
        } else {
          return Observable.of(key);
        }
      }

      if (key instanceof Array) {
        const translateStrings = key.reduce((acc, k) => {
          if (k === undefined) {
            throw new Error();
          }

          if (k === 'TRANSLATE_INTERPOLATE') {
            acc[k] = interpolateString;
            return acc;
          }

          if (translations[k]) {
            acc[k] = translations[k];
          } else {
            acc[k] = k;
          }
          return acc;
        }, {});

        return Observable.of(translateStrings);
      }
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestViewComponent],
      providers: [
        MdlDialogService,
        { provide: TranslateService, useClass: TranslateServiceStub }
      ],
      imports: [
        MdlDialogOutletModule,
      ]
    });

    fixture = TestBed.createComponent(TestViewComponent);
    el = fixture.debugElement.nativeElement;
    dialogService = TestBed.get(DialogService);
    ServiceLocator.injector = getTestBed().get(Injector);
  }));


  it('should translate alerts', fakeAsync(() => {
    fixture.detectChanges();
    dialogService.alert('TRANSLATE_TEST', 'TRANSLATE_OK').subscribe();
    tick(200);
    fixture.detectChanges();
    expect(el.querySelector('.mdl-dialog__content').textContent).toBe(translations['TRANSLATE_TEST']);
    expect(el.querySelectorAll('button')[0].textContent).toBe(translations['TRANSLATE_OK']);
  }));

  it('should translate confirms', fakeAsync(() => {
    fixture.detectChanges();
    dialogService.confirm('TRANSLATE_TEST', 'TRANSLATE_CANCEL', 'TRANSLATE_OK');
    tick(200);
    fixture.detectChanges();
    expect(el.querySelector('.mdl-dialog__content').textContent).toBe(translations['TRANSLATE_TEST']);
    expect(el.querySelectorAll('button')[0].textContent).toBe(translations['TRANSLATE_OK']);
    expect(el.querySelectorAll('button')[1].textContent).toBe(translations['TRANSLATE_CANCEL']);
  }));

  it('should translate alerts with interpolation', fakeAsync(() => {
    fixture.detectChanges();
    dialogService.alert(
      {
        translationToken: 'TRANSLATE_INTERPOLATE',
        interpolateParams: { interpolated: 'interpolated' }
      },
      'TRANSLATE_OK'
    );
    tick(200);
    fixture.detectChanges();
    expect(el.querySelector('.mdl-dialog__content').textContent).toBe('interpolated');
    expect(el.querySelectorAll('button')[0].textContent).toBe(translations['TRANSLATE_OK']);
  }));

  it('should translate confirms with interpolation', fakeAsync(() => {
    fixture.detectChanges();
    dialogService.confirm(
      {
        translationToken: 'TRANSLATE_INTERPOLATE',
        interpolateParams: { interpolated: 'interpolated' }
      },
      'TRANSLATE_OK',
      'TRANSLATE_CANCEL'
    );
    tick(200);
    fixture.detectChanges();
    expect(el.querySelector('.mdl-dialog__content').textContent).toBe('interpolated');
    expect(el.querySelectorAll('button')[0].textContent).toBe(translations['TRANSLATE_CANCEL']);
    expect(el.querySelectorAll('button')[1].textContent).toBe(translations['TRANSLATE_OK']);
  }));

  it('should translate custom dialogs', fakeAsync(() => {
    fixture.detectChanges();
    dialogService.showDialog({
      message: {
        translationToken: 'TRANSLATE_INTERPOLATE',
        interpolateParams: { interpolated: 'interpolated' }
      },
      actions: [
        {
          handler: () => {},
          text: 'TRANSLATE_OK'
        },
        {
          text: 'TRANSLATE_CANCEL'
        }
      ]
    });
    tick(200);
    fixture.detectChanges();
    expect(el.querySelector('.mdl-dialog__content').textContent).toBe('interpolated');
  }));
});
