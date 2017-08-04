import { MdlModule } from '@angular-mdl/core';
import { MdlSelectModule } from '@angular-mdl/select';
import { Component, EventEmitter, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { DatePickerComponent } from '../shared/components/date-picker';
import { TopBarComponent } from '../shared/components/top-bar/top-bar.component';
import { LanguageService } from '../shared/services';
import { FilterService } from '../shared/services/';
import { SharedModule } from '../shared/shared.module';
import { EventListComponent } from './event-list.component';
import { Event } from './event.model';
import { EventService } from './event.service';
import { DateTimeFormatterService } from '../shared/services/date-time-formatter.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { dateTimeFormat as enDateTimeFormat } from '../shared/components/date-picker/dateUtils';
import { By } from '@angular/platform-browser';


const eventServiceFixture = require('./event.service.fixture.json');

class MockTranslateService {
  public onLangChange: EventEmitter<void>;

  constructor() {
    this.onLangChange = new EventEmitter<void>();
  }

  public get currentLang(): string {
    return 'en';
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

class MockFilterService {
  public init(): any {
    return {
      levels: [],
      types: []
    };
  }

  public update(): void {}
}

class MockLanguageService {
  public firstDayOfWeek = new BehaviorSubject<number>(0);
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
class MockNotificationBoxComponent {}

describe('event list component', () => {
  let fixture;
  let comp;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        MdlModule,
        MdlSelectModule
      ],
      declarations: [
        MockTranslatePipe,
        EventListComponent,
        MockNotificationBoxComponent
      ],
      providers: [
        { provide: DateTimeFormatterService, useClass: MockDateTimeFormatterService },
        { provide: LanguageService, useClass: MockLanguageService },
        { provide: EventService, useClass: MockEventService },
        { provide: FilterService, useClass: MockFilterService },
        { provide: TranslateService, useClass: MockTranslateService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed
      .overrideComponent(TopBarComponent, {
        set: { template: '<ng-content></ng-content>' }
      })
      .overrideComponent(DatePickerComponent, {
        set: { template: '' }
      })
      .createComponent(EventListComponent);
    comp = fixture.componentInstance;
  });

  it('should grab events by date', () => {
    fixture.detectChanges();
    comp.date = new Date('1970-01-02');
    comp.getEvents({ reload: true });
    fixture.detectChanges();
    expect(comp.tableModel.data[0].id).toBe('1');
    expect(comp.tableModel.data[1].id).toBe('2');
    expect(comp.tableModel.data[2].id).toBe('3');

    comp.date = new Date('1970-01-03');
    comp.getEvents({ reload: true });
    fixture.detectChanges();
    expect(comp.tableModel.data[0].id).toBe('4');
    expect(comp.tableModel.data[1].id).toBe('5');
    expect(comp.tableModel.data[2].id).toBe('6');
    expect(comp.tableModel.data[3].id).toBe('7');
    expect(comp.tableModel.data[4].id).toBe('8');
    expect(comp.tableModel.data[5].id).toBe('9');
  });

  it('should filter events by level', () => {
    fixture.detectChanges();
    comp.date = new Date('1970-01-03');
    comp.getEvents({ reload: true });
    comp.selectedLevels = ['INFO'];
    comp.getEvents();
    fixture.detectChanges();
    expect(comp.tableModel.data[0].id).toBe('4');
    expect(comp.tableModel.data[1].id).toBe('7');
    comp.selectedLevels = ['INFO', 'WARN'];
    comp.getEvents();
    fixture.detectChanges();
    expect(comp.tableModel.data.length).toBe(4);
    comp.selectedLevels = [];
    comp.getEvents();
    fixture.detectChanges();
    expect(comp.tableModel.data.length).toBe(6);
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
    expect(comp.tableModel.data[0].id).toBe('4');
    expect(comp.tableModel.data[1].id).toBe('5');
    comp.selectedTypes = ['SG.AUTH.INGRESS', 'CREATE_TAGS'];
    comp.getEvents();
    fixture.detectChanges();
    expect(comp.tableModel.data.length).toBe(4);
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
    expect(comp.tableModel.data[0].id).toBe('5');
    expect(comp.tableModel.data.length).toBe(1);
    comp.selectedTypes = ['CREATE_TAGS'];
    comp.selectedLevels = ['ERROR'];
    comp.getEvents();
    fixture.detectChanges();
    expect(comp.tableModel.data[0].id).toBe('9');
    expect(comp.tableModel.data.length).toBe(1);
  });

  it('should filter by search field', () => {
    fixture.detectChanges();
    comp.date = new Date('1970-01-02');
    comp.getEvents({ reload: true });
    comp.query = 'failed';
    comp.getEvents();
    fixture.detectChanges();
    expect(comp.tableModel.data[0].id).toBe('3');

    comp.date = new Date('1970-01-03');
    comp.getEvents({ reload: true });
    comp.query = 'authorized';
    comp.getEvents();
    fixture.detectChanges();
    expect(comp.tableModel.data.length).toBe(4);
  });

  it('should render table correctly', () => {
    fixture.detectChanges();
    comp.date = new Date('1970-01-02');
    comp.getEvents({ reload: true });
    fixture.detectChanges();

    const td = fixture.debugElement.queryAll(By.css('td'));
    expect(td[0].nativeElement.textContent).toBe('user_logged_in');
    expect(td[1].nativeElement.textContent).toBe('INFO');
    expect(td[2].nativeElement.textContent).toBe('USER.LOGIN');

    expect(td[4].nativeElement.textContent).toBe('user_logged_out');
    expect(td[5].nativeElement.textContent).toBe('WARN');
    expect(td[6].nativeElement.textContent).toBe('USER.LOGOUT');
  });
});
