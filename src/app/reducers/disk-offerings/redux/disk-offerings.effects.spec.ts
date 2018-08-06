import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { DiskOffering } from '../../../shared/models';
import { DiskOfferingEffects } from './disk-offerings.effects';
import { DiskOfferingService } from '../../../shared/services/disk-offering.service';
import { ConfigService } from '../../../core/services';
import { MockConfigService } from '../../../../testutils/mocks/model-services/services/mock-config.service.spec';

import * as actions from './disk-offerings.actions';

const diskOfferings: Array<DiskOffering> = [
  {
    displaytext: 'test snapshot',
    id: 'test-id',
    disksize: 2,
    name: 'snapshot for testing',
    diskBytesReadRate: 1,
    diskBytesWriteRate: 2,
    diskIopsReadRate: 1,
    diskIopsWriteRate: 2,
    iscustomized: false,
    miniops: 1,
    maxiops: 1,
    storagetype: 'any',
    provisioningtype: 'any'
  }
];

export class TestActions extends Actions {
  constructor() {
    super(empty());
  }

  public set stream(source: Observable<DiskOffering>) {
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

describe('Disk Offering Effects', () => {
  let actions$: TestActions;
  let service: DiskOfferingService;
  let effects: DiskOfferingEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DiskOfferingService,
        DiskOfferingEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ConfigService, useValue: MockConfigService }
      ]
    });
    actions$ = TestBed.get(Actions);
    service = TestBed.get(DiskOfferingService);
    effects = TestBed.get(DiskOfferingEffects);

    spyOn(service, 'getList').and.returnValue(of(diskOfferings));
  });

  it('should return a collection from LoadOfferingsResponse', () => {
    const action = new actions.LoadOfferingsRequest();
    const completion = new actions.LoadOfferingsResponse(diskOfferings);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.loadOfferings$).toBeObservable(expected);
  });
});
