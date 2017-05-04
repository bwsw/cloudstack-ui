import { Component, EventEmitter, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import { FilterService } from '../shared/services/filter.service';
import { SharedModule } from '../shared/shared.module';
import { EventListComponent } from './event-list.component';
import { Event } from './event.model';
import { EventService } from './event.service';
import { NotificationBoxComponent } from '../shared/components/notification-box';
import { TopBarComponent } from '../shared/components/top-bar/top-bar.component';
import { DatePickerComponent } from '../shared/components/date-picker';
import { MdlSelectModule } from '@angular2-mdl-ext/select';
import { MdlModule } from 'angular2-mdl';
import { LanguageService } from '../shared/services';


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
    for (let date in this.fixture) {
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
  public getFirstDayOfWeek(): Observable<number> {
    return Observable.of(0);
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
      declarations: [
        MockTranslatePipe,
        EventListComponent,
        MockNotificationBoxComponent
      ],
      providers: [
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: EventService, useClass: MockEventService },
        { provide: FilterService, useClass: MockFilterService },
        { provide: LanguageService, useClass: MockLanguageService }
      ],
      imports: [
        SharedModule,
        MdlModule,
        MdlSelectModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed
      .overrideComponent(NotificationBoxComponent, {
        set: { template: '' }
      })
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
    comp.getEvents();
    fixture.detectChanges();
    expect(comp.tableModel.data[0].id).toBe('1');
    expect(comp.tableModel.data[1].id).toBe('2');
    expect(comp.tableModel.data[2].id).toBe('3');

    comp.date = new Date('1970-01-03');
    comp.getEvents();
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
    comp.getEvents();
    comp.selectedLevels = ['INFO'];
    comp.filter();
    fixture.detectChanges();
    expect(comp.tableModel.data[0].id).toBe('4');
    expect(comp.tableModel.data[1].id).toBe('7');
    comp.selectedLevels = ['INFO', 'WARN'];
    comp.filter();
    fixture.detectChanges();
    expect(comp.tableModel.data.length).toBe(4);
    comp.selectedLevels = [];
    comp.filter();
    fixture.detectChanges();
    expect(comp.tableModel.data.length).toBe(6);
  });

  it('should filter events by type', () => {
    fixture.detectChanges();
    comp.date = new Date('1970-01-02');
    comp.getEvents();
    fixture.detectChanges();
    expect(comp.eventTypes).toEqual(['USER.LOGIN', 'USER.LOGOUT', 'SG.CREATE']);

    comp.date = new Date('1970-01-03');
    comp.getEvents();
    fixture.detectChanges();
    expect(comp.eventTypes).toEqual(['SG.AUTH.INGRESS', 'SG.AUTH.EGRESS', 'CREATE_TAGS']);
    comp.selectedTypes = ['SG.AUTH.INGRESS'];
    comp.filter();
    expect(comp.tableModel.data[0].id).toBe('4');
    expect(comp.tableModel.data[1].id).toBe('5');
    comp.selectedTypes = ['SG.AUTH.INGRESS', 'CREATE_TAGS'];
    comp.filter();
    fixture.detectChanges();
    expect(comp.tableModel.data.length).toBe(4);
  });

  it('should filter by all filters', () => {
    fixture.detectChanges();
    comp.date = new Date('1970-01-03');
    comp.getEvents();
    fixture.detectChanges();
    comp.selectedTypes = ['SG.AUTH.INGRESS'];
    comp.selectedLevels = ['WARN'];
    comp.filter();
    fixture.detectChanges();
    expect(comp.tableModel.data[0].id).toBe('5');
    expect(comp.tableModel.data.length).toBe(1);
    comp.selectedTypes = ['CREATE_TAGS'];
    comp.selectedLevels = ['ERROR'];
    comp.filter();
    fixture.detectChanges();
    expect(comp.tableModel.data[0].id).toBe('9');
    expect(comp.tableModel.data.length).toBe(1);
  });

  it('should filter by search field', () => {
    fixture.detectChanges();
    comp.date = new Date('1970-01-02');
    comp.getEvents();
    comp.query = 'failed';
    comp.filter();
    fixture.detectChanges();
    expect(comp.tableModel.data[0].id).toBe('3');

    comp.date = new Date('1970-01-03');
    comp.getEvents();
    comp.query = 'authorized';
    comp.filter();
    fixture.detectChanges();
    expect(comp.tableModel.data.length).toBe(4);
  });
});
