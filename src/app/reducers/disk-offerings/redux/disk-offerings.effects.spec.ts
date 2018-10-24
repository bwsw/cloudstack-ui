import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { EMPTY, Observable, of } from 'rxjs';
import { DiskOffering } from '../../../shared/models';
import { DiskOfferingEffects } from './disk-offerings.effects';
import { DiskOfferingService } from '../../../shared/services/disk-offering.service';
import { TestStore } from '../../../../testutils/ngrx-test-store';

import * as actions from './disk-offerings.actions';

const diskOfferings: DiskOffering[] = [
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
    provisioningtype: 'any',
  },
];

export class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }

  public set stream(source: Observable<DiskOffering>) {
    // todo
    // tslint:disable-next-line
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
  let store: TestStore<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DiskOfferingService,
        DiskOfferingEffects,
        { provide: Actions, useFactory: getActions },
        { provide: Store, useClass: TestStore },
      ],
    });
    actions$ = TestBed.get(Actions);
    service = TestBed.get(DiskOfferingService);
    effects = TestBed.get(DiskOfferingEffects);
    store = TestBed.get(Store);

    spyOn(service, 'getList').and.returnValue(of(diskOfferings));
  });

  it('should return a collection from LoadOfferingsResponse', () => {
    const action = new actions.LoadOfferingsRequest();
    const completion = new actions.LoadOfferingsResponse(diskOfferings);
    store.setState([]);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.loadOfferings$).toBeObservable(expected);
  });
});
