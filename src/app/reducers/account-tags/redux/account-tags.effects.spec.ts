import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { MockDialogService } from '../../../../testutils/mocks/mock-dialog.service';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import * as fromAccountTags from './account-tags.reducers';
import * as accountTagActions from './account-tags.actions';
import { AccountTagsEffects } from './account-tags.effects';
import { Tag } from '../../../shared/models/tag.model';
import { TagService } from '../../../shared/services/tags/tag.service';
import { AccountTagService } from '../../../shared/services/tags/account-tag.service';
import { ConfigService } from '../../../core/services';
import { ServiceOffering } from '../../../shared/models/service-offering.model';
import { StorageTypes } from '../../../shared/models/offering.model';

@Injectable()
class MockAsyncJobService {
  public completeAllJobs(): void {
  }
}

@Injectable()
class MockTagService {
  public getList(): void {
  }
  public setServiceOfferingParams(): void {
  }
}


@Injectable()
class MockStorageService {
  private storage: any = {
    user: {
      userid: '1'
    }
  };

  public write(key: string, value: string): void {
    this.storage[key] = value;
  }

  public read(key: string): string {
    return this.storage[key] || null;
  }

  public remove(key: string): void {
    delete this.storage[key];
  }

  public resetInMemoryStorage(): void {
    this.storage = {};
  }
}

class MockMatDialog {
  public open(): void {
  }
  public closeAll(): void {
  }
}

export class TestActions extends Actions {
  constructor() {
    super(empty());
  }

  public set stream(source: Observable<Tag>) {
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}


describe('Account tags Effects', () => {
  let actions$: TestActions;
  let service: TagService;
  let accountService: AccountTagService;
  let configService: ConfigService;
  let dialogService: DialogService;

  let effects: AccountTagsEffects;

  const list: Array<Tag> = [];


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({ ...fromAccountTags.accountTagsReducers}),
      ],
      providers: [
        AccountTagsEffects,
        ConfigService,
        { provide: Actions, useFactory: getActions },
        { provide: TagService, useClass: MockTagService },
        { provide: AccountTagService, useClass: MockTagService },
        { provide: DialogService, useClass: MockDialogService },
      ]
    });
    actions$ = TestBed.get(Actions);
    service = TestBed.get(TagService);
    accountService = TestBed.get(AccountTagService);
    configService = TestBed.get(ConfigService);
    dialogService = TestBed.get(DialogService);
    effects = TestBed.get(AccountTagsEffects);
  });

  it('should return a collection from LoadAccountTagsResponse', () => {
    const spyGetList = spyOn(service, 'getList').and.returnValue(of(list));
    const spyAccountTag = spyOn(configService, 'get').and.returnValue(true);

    const action = new accountTagActions.LoadAccountTagsRequest();
    const completion = new accountTagActions.LoadAccountTagsResponse(list);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.loadAccountTags$).toBeObservable(expected);
    expect(spyGetList).toHaveBeenCalled();
  });

  it('should return an empty collection from LoadAccountTagsResponse', () => {
    const spyGetList = spyOn(service, 'getList').and
      .returnValue(Observable.throw(new Error('Error occurred!')));
    const spyAccountTag = spyOn(configService, 'get').and.returnValue(true);

    const action = new accountTagActions.LoadAccountTagsRequest();
    const completion = new accountTagActions.LoadAccountTagsResponse([]);

    actions$.stream = hot('a', { a: action });
    const expected = cold('b', { b: completion });

    expect(effects.loadAccountTags$).toBeObservable(expected);
  });

  it('should update custom SO params', () => {
    const offering = <ServiceOffering>{
      id: '1', name: 'off1', hosttags: 't1,t2',
      storagetype: StorageTypes.local,
      cpunumber: 2, memory: 2, iscustomized: true
    };
    const spySetParam = spyOn(accountService, 'setServiceOfferingParams').and.returnValue(of(offering));
    const spyAccountTag = spyOn(configService, 'get').and.returnValue(true);

    const action = new accountTagActions.UpdateCustomServiceOfferingParams(offering);
    const completion = new accountTagActions.UpdateCustomServiceOfferingParamsSuccess(offering);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.updateCustomServiceOfferingParams$).toBeObservable(expected);
    expect(spySetParam).toHaveBeenCalled();
  });

  it('should return an error during updating custom SO params', () => {
    const offering = <ServiceOffering>{
      id: '1', name: 'off1', hosttags: 't1,t2',
      storagetype: StorageTypes.local,
      cpunumber: 2, memory: 2, iscustomized: true
    };
    const spySetParam = spyOn(accountService, 'setServiceOfferingParams').and.
      returnValue(Observable.throw(new Error('Error occurred!')));
    const spyAccountTag = spyOn(configService, 'get').and.returnValue(true);

    const action = new accountTagActions.UpdateCustomServiceOfferingParams(offering);
    const completion = new accountTagActions.UpdateCustomServiceOfferingParamsError(new Error('Error occurred!'));

    actions$.stream = hot('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.updateCustomServiceOfferingParams$).toBeObservable(expected);
  });

  it('should show alert after updating error', () => {
    const spyAlert = spyOn(dialogService, 'alert');
    const action = new accountTagActions.UpdateCustomServiceOfferingParamsError(new Error('Error occurred!'));

    actions$.stream = hot('a', { a: action });
    const expected = cold('a', { a: action });

    expect(effects.updateCustomServiceOfferingParamsError$).toBeObservable(expected);
    expect(spyAlert).toHaveBeenCalled();
  });

});
