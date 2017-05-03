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
import { MdlSelectComponent, MdlSelectModule } from '@angular2-mdl-ext/select';
import { MdlModule } from 'angular2-mdl';


const eventServiceFixture = require('./event.service.fixture.json');

class MockTranslateService {
  public onLangChange: EventEmitter<void>

  constructor() {
    this.onLangChange = new EventEmitter<void>();
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
    const result = this.fixture[params['startdate']];

    if (params['startdate'] !== params['enddate']) {
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
        { provide: FilterService, useClass: MockFilterService }
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

  it('should do at least something', () => {
    fixture.detectChanges();
    expect(true).toBeTruthy();
  });
});
