import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { MockDialogService } from '../../../../testutils/mocks/mock-dialog.service';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import * as fromAccountTags from './account-tags.reducers';
import * as accountTagActions from './account-tags.actions';
import { AccountTagsEffects } from './account-tags.effects';
import { Tag } from '../../../shared/models';
import { TagService } from '../../../shared/services/tags/tag.service';
import { AccountTagService } from '../../../shared/services/tags/account-tag.service';

@Injectable()
class MockTagService {
  public getList(): void {}
  public setServiceOfferingParams(): void {}
}

export class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }

  public set stream(source: Observable<Tag>) {
    // todo
    // tslint:disable-next-line
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

describe('Account tags Effects', () => {
  let actions$: TestActions;
  let service: TagService;

  let effects: AccountTagsEffects;

  const list: Tag[] = [];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({ ...fromAccountTags.accountTagsReducers }),
      ],
      providers: [
        AccountTagsEffects,
        { provide: Actions, useFactory: getActions },
        { provide: TagService, useClass: MockTagService },
        { provide: AccountTagService, useClass: MockTagService },
        { provide: DialogService, useClass: MockDialogService },
      ],
    });
    actions$ = TestBed.get(Actions);
    service = TestBed.get(TagService);
    effects = TestBed.get(AccountTagsEffects);
  });

  it('should return a collection from LoadAccountTagsResponse', () => {
    const spyGetList = spyOn(service, 'getList').and.returnValue(of(list));

    const action = new accountTagActions.LoadAccountTagsRequest();
    const completion = new accountTagActions.LoadAccountTagsResponse(list);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.loadAccountTags$).toBeObservable(expected);
    expect(spyGetList).toHaveBeenCalled();
  });

  it('should return an empty collection from LoadAccountTagsResponse', () => {
    spyOn(service, 'getList').and.returnValue(throwError(new Error('Error occurred!')));

    const action = new accountTagActions.LoadAccountTagsRequest();
    const completion = new accountTagActions.LoadAccountTagsResponse([]);

    actions$.stream = hot('a', { a: action });
    const expected = cold('b', { b: completion });

    expect(effects.loadAccountTags$).toBeObservable(expected);
  });
});
