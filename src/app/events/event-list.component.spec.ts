import { CdkTableModule } from '@angular/cdk';
import {
  Component,
  Injectable,
  NO_ERRORS_SCHEMA,
  Pipe,
  PipeTransform
} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdDialogModule, MdSelectModule, MdTableModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MockTagService } from '../../testutils/mocks/tag-services/mock-tag.service';
import { DatePickerComponent } from '../shared/components/date-picker';
import { dateTimeFormat as enDateTimeFormat } from '../shared/components/date-picker/dateUtils';
import { TableComponent } from '../shared/components/table/table.component';
import { TopBarComponent } from '../shared/components/top-bar/top-bar.component';
import { LoadingDirective } from '../shared/directives/loading.directive';
import { HighLightPipe } from '../shared/pipes/highlight.pipe';
import { DateTimeFormatterService } from '../shared/services/date-time-formatter.service';
import { Language, LanguageService } from '../shared/services/language.service';
import { SessionStorageService } from '../shared/services/session-storage.service';
import { TagService } from '../shared/services/tags/tag.service';
import { EventListComponent } from './event-list.component';
import { Event } from './event.model';
import { EventService } from './event.service';

const eventServiceFixture = require('./event.service.fixture.json');

class MockTranslateService {
  public onTranslationChange = new Subject();
  public onLangChange = new Subject();
  public onDefaultLangChange = new Subject();

  public get currentLang(): string {
    return Language.en;
  }

  public get(key: string | Array<string>): Observable<string | any> {
    return Observable.of(key);
  }
}

class MockEventService {
  private fixture: { [key: string]: Array<Event> };

  constructor() {
    this.fixture = eventServiceFixture;
    for (const date in this.fixture) {
      if (this.fixture.hasOwnProperty(date)) {
        this.fixture[date] = this.fixture[date].map(event => new Event(event));
      }
    }
  }

  public getList(params): Observable<Array<Event>> {
    const result = this.fixture[params['startDate']];

    if (params['startDate'] !== params['endDate']) {
      throw new Error();
    }

    return Observable.of(result || []);
  }
}

@Injectable()
class MockRouter {
  public navigate(route: any): Promise<any> {
    return Promise.resolve(route);
  }
}

class ActivatedRouteStub {
  private _testQueryParams: {} = {};

  get testParams(): {} {
    return this._testQueryParams;
  }

  set testParams(params: {}) {
    this._testQueryParams = params;
  }

  get snapshot(): {} {
    return { queryParams: this.testParams };
  }
}

class MockLanguageService {
  public firstDayOfWeek = new BehaviorSubject<number>(0);

  public initializeFirstDayOfWeek(): void {
    this.firstDayOfWeek.next(0);
  }
}

@Pipe({
  // tslint:disable-next-line
  name: 'translate'
})
class MockTranslatePipe implements PipeTransform {
  public transform(value: any): Observable<any> {
    return value;
  }
}

class MockDateTimeFormatterService {
  public get dateTimeFormat(): any {
    return enDateTimeFormat;
  }

  public stringifyToTime(date: Date): string {
    return '';
  }

  public stringifyToDate(date: Date): string {
    return '';
  }
}

@Component({
  selector: 'cs-notification-box',
  template: ''
})
class MockNotificationBoxComponent {
}

describe('event list component', () => {
  let comp;
  let fixture: ComponentFixture<EventListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MdDialogModule,
        CdkTableModule,
        MdTableModule,
        MdSelectModule,
        BrowserAnimationsModule
      ],
      declarations: [
        HighLightPipe,
        TableComponent,
        LoadingDirective,
        MockTranslatePipe,
        EventListComponent,
        MockNotificationBoxComponent
      ],
      providers: [
        SessionStorageService,
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: DateTimeFormatterService, useClass: MockDateTimeFormatterService },
        { provide: EventService, useClass: MockEventService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: LanguageService, useClass: MockLanguageService },
        { provide: TagService, useClass: MockTagService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(TopBarComponent, {
        set: { template: '<ng-content></ng-content>' }
      })
      .overrideComponent(DatePickerComponent, {
        set: { template: '' }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    sessionStorage.clear();

    fixture = TestBed.createComponent(EventListComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should grab events by date', () => {
    fixture.detectChanges();
    comp.date = new Date('1970-01-02');
    comp.getEvents({ reload: true });
    fixture.detectChanges();
    expect(comp.tableModel[0].id).toBe('1');
    expect(comp.tableModel[1].id).toBe('2');
    expect(comp.tableModel[2].id).toBe('3');

    comp.date = new Date('1970-01-03');
    comp.getEvents({ reload: true });
    fixture.detectChanges();
    expect(comp.tableModel[0].id).toBe('4');
    expect(comp.tableModel[1].id).toBe('5');
    expect(comp.tableModel[2].id).toBe('6');
    expect(comp.tableModel[3].id).toBe('7');
    expect(comp.tableModel[4].id).toBe('8');
    expect(comp.tableModel[5].id).toBe('9');
  });

  it('should filter events by level', () => {
    fixture.detectChanges();
    comp.date = new Date('1970-01-03');
    comp.getEvents({ reload: true });
    comp.selectedLevels = ['INFO'];
    comp.getEvents();
    fixture.detectChanges();
    expect(comp.tableModel[0].id).toBe('4');
    expect(comp.tableModel[1].id).toBe('7');
    comp.selectedLevels = ['INFO', 'WARN'];
    comp.getEvents();
    fixture.detectChanges();
    expect(comp.tableModel.length).toBe(4);
    comp.selectedLevels = [];
    comp.getEvents();
    fixture.detectChanges();
    expect(comp.tableModel.length).toBe(6);
  });

  it('should filter events by type', () => {
    fixture.detectChanges();
    comp.date = new Date('1970-01-02');
    comp.getEvents({ reload: true });
    fixture.detectChanges();
    expect(comp.eventTypes).toEqual(['USER.LOGIN', 'USER.LOGOUT', 'SG.CREATE']);

    comp.date = new Date('1970-01-03');
    comp.getEvents({ reload: true });
    fixture.detectChanges();
    expect(comp.eventTypes).toEqual(['SG.AUTH.INGRESS', 'SG.AUTH.EGRESS', 'CREATE_TAGS']);
    comp.selectedTypes = ['SG.AUTH.INGRESS'];
    comp.getEvents();
    expect(comp.tableModel[0].id).toBe('4');
    expect(comp.tableModel[1].id).toBe('5');
    comp.selectedTypes = ['SG.AUTH.INGRESS', 'CREATE_TAGS'];
    comp.getEvents();
    fixture.detectChanges();
    expect(comp.tableModel.length).toBe(4);
  });

  it('should filter by all filters', () => {
    fixture.detectChanges();
    comp.date = new Date('1970-01-03');
    comp.getEvents({ reload: true });
    fixture.detectChanges();
    comp.selectedTypes = ['SG.AUTH.INGRESS'];
    comp.selectedLevels = ['WARN'];
    comp.getEvents();
    fixture.detectChanges();
    expect(comp.tableModel[0].id).toBe('5');
    expect(comp.tableModel.length).toBe(1);
    comp.selectedTypes = ['CREATE_TAGS'];
    comp.selectedLevels = ['ERROR'];
    comp.getEvents();
    fixture.detectChanges();
    expect(comp.tableModel[0].id).toBe('9');
    expect(comp.tableModel.length).toBe(1);
  });

  it('should filter by search field', () => {
    fixture.detectChanges();
    comp.date = new Date('1970-01-02');
    comp.getEvents({ reload: true });
    comp.query = 'failed';
    comp.getEvents();
    fixture.detectChanges();
    expect(comp.tableModel[0].id).toBe('3');

    comp.date = new Date('1970-01-03');
    comp.getEvents({ reload: true });
    comp.query = 'authorized';
    comp.getEvents();
    fixture.detectChanges();
    expect(comp.tableModel.length).toBe(4);
  });

  it('should render table correctly', () => {
    fixture.detectChanges();
    comp.date = new Date('1970-01-02');
    comp.getEvents({ reload: true });

    fixture.detectChanges();
    fixture.detectChanges(); // doesn't work without double detectChange()!
    const td = fixture.debugElement.queryAll(By.css('md-cell'));
    expect(td[0].nativeElement.textContent.trim()).toBe('user_logged_in');
    expect(td[1].nativeElement.textContent.trim()).toBe('INFO');
    expect(td[2].nativeElement.textContent.trim()).toBe('USER.LOGIN');

    expect(td[4].nativeElement.textContent.trim()).toBe('user_logged_out');
    expect(td[5].nativeElement.textContent.trim()).toBe('WARN');
    expect(td[6].nativeElement.textContent.trim()).toBe('USER.LOGOUT');
  });
});
