import { Observable } from 'rxjs/Observable';
import { Actions } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { of } from 'rxjs/observable/of';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  LoadUserTags,
  LoadUserTagsError,
  LoadUserTagsSuccess,
  UpdateLastVMId,
  UpdateLastVMIdError,
  UpdateLastVMIdSuccess,
  UpdateCustomServiceOfferingParams,
  UpdateCustomServiceOfferingParamsSuccess,
  UpdateCustomServiceOfferingParamsError
} from './user-tags.actions';
import { UserTagsEffects } from './user-tags.effects';
import { userTagKeys } from '../../../tags/tag-keys';
import { DiskOffering, ServiceOffering } from '../../../shared/models';
import { StorageTypes } from '../../../shared/models/offering.model';
import { ConfigService } from '../../../core/services';
import { empty } from 'rxjs/observable/empty';
import { TestBed } from '@angular/core/testing';
import { TagService } from '../../../shared/services/tags/tag.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Injectable } from '@angular/core';
import { selectServiceOfferingParamTags } from './user-tags.selectors';
import { MockDialogService } from '../../../../testutils/mocks/mock-dialog.service';
import { User } from '../../../shared/models/user.model';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';

@Injectable()
class MockTagService {
  public getList(): void {
  }
  public setServiceOfferingParams(): void {
  }
}

class MockAuthService {
  _user: User;

  get user() {
    return this._user;
  }
}

function createTagServiceStub(listResponse: any, createRespone: any, removeResponce: any) {
  const service = jasmine.createSpyObj('tagService', ['getList', 'create', 'remove']);

  const isListError = listResponse instanceof Error;
  const isCreateError = createRespone instanceof Error;
  const isRemoveError = removeResponce instanceof Error;
  const _listResponse = isListError ? Observable.throw(listResponse) : Observable.of(listResponse);
  const _createResponse = isCreateError ? Observable.throw(createRespone) : Observable.of(createRespone);
  const _removeResponse = isRemoveError ? Observable.throw(removeResponce) : Observable.of(removeResponce);

  service.getList.and.returnValue(_listResponse);
  service.create.and.returnValue(_createResponse);
  service.remove.and.returnValue(_removeResponse);

  return service;
}

function createAuthServiceStub() {
  const service = jasmine.createSpyObj('authService', ['user']);
  service.user.and.returnValue({ userid: '100' });
  return service;
}

function createDialogServiceStub() {
  const service = jasmine.createSpyObj('dialogService', ['alert']);
  service.alert.and.returnValue({test: 'test'});
  return service;
}

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


class StoreStub {
}

describe('User tags effects', () => {
  const authService = createAuthServiceStub();
  const store = new StoreStub() as Store<any>;
  let tagService: TagService;
  let dialogService = createDialogServiceStub();
  let configService: ConfigService;
  let actions$: TestActions;
  let effects: UserTagsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({ ...selectServiceOfferingParamTags}),
      ],
      providers: [
        UserTagsEffects,
        ConfigService,
        { provide: Actions, useFactory: getActions },
        { provide: TagService, useClass: MockTagService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: DialogService, useClass: MockDialogService },
      ]
    });
    actions$ = TestBed.get(Actions);
    tagService = TestBed.get(TagService);
    configService = TestBed.get(ConfigService);
    dialogService = TestBed.get(DialogService);
    effects = TestBed.get(UserTagsEffects);
    actions$ = TestBed.get(Actions);
    configService = TestBed.get(ConfigService);
  });

  it('can load user tags', () => {
    const source = cold('a', { a: new LoadUserTags() });
    tagService = createTagServiceStub([], null, null);
    effects = new UserTagsEffects(new Actions(source), tagService, authService, store, dialogService);

    const expected = cold('b', { b: new LoadUserTagsSuccess({ tags: [] }) });
    expect(effects.loadUserTags$).toBeObservable(expected);
  });

  it('can handle loading user tags errors', () => {
    const source = cold('a', { a: new LoadUserTags() });
    tagService = createTagServiceStub(new Error('error'), null, null);
    effects = new UserTagsEffects(new Actions(source), tagService, authService, store, dialogService);

    const expected = cold('b', { b: new LoadUserTagsError({ error: new Error('error') }) });
    expect(effects.loadUserTags$).toBeObservable(expected);
  });

  it('can update user tags (eg. LastVMId)', () => {
    const source = cold('a', { a: new UpdateLastVMId({ value: 5 }) });
    tagService = createTagServiceStub(null, {}, {});
    effects = new UserTagsEffects(new Actions(source), tagService, authService, store, dialogService);

    const expected = cold('b', {
      b: new UpdateLastVMIdSuccess({
        key: userTagKeys.lastVMId,
        value: '5'
      })
    });
    expect(effects.updateLastVmId$).toBeObservable(expected);
  });

  // This is about an error when you try to delete tag that does not exist
  it('can handle error when deleting a tag in the tag update function and continue execution', () => {
    const actions = new Actions(cold('a', { a: new UpdateLastVMId({ value: 5 }) }));
    tagService = createTagServiceStub(null, {}, new Error('error'));
    effects = new UserTagsEffects(actions, tagService, authService, store, dialogService);

    const expected = cold('b', {
      b: new UpdateLastVMIdSuccess({
        key: userTagKeys.lastVMId,
        value: '5'
      })
    });
    expect(effects.updateLastVmId$).toBeObservable(expected);
  });

  it('can handle error when creating a tag in the tag update function', () => {
    const actions = new Actions(cold('a', { a: new UpdateLastVMId({ value: 5 }) }));
    tagService = createTagServiceStub(null, new Error('error'), {});
    effects = new UserTagsEffects(actions, tagService, authService, store, dialogService);

    const expected = cold('b', { b: new UpdateLastVMIdError({ error: new Error('error') }) });
    expect(effects.updateLastVmId$).toBeObservable(expected);
  });

  it('should update custom SO params', () => {
    const offering = <ServiceOffering>{
      id: '1',
      name: 'off1',
      hosttags: 't1,t2',
      storagetype: StorageTypes.local,
      cpunumber: 2,
      memory: 2,
      iscustomized: true
    };
    const spySetParam = spyOn(effects, 'setServiceOfferingParams').and.returnValue(of(offering));
    const spyAccountTag = spyOn(configService, 'get').and.returnValue(true);

    const action = new UpdateCustomServiceOfferingParams(offering);
    const completion = new UpdateCustomServiceOfferingParamsSuccess(offering);

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
    const spySetParam = spyOn(effects, 'setServiceOfferingParams').and.
    returnValue(Observable.throw(new Error('Error occurred!')));
    const spyAccountTag = spyOn(configService, 'get').and.returnValue(true);

    const action = new UpdateCustomServiceOfferingParams(offering);
    const completion = new UpdateCustomServiceOfferingParamsError({ error: new Error('Error occurred!') });

    actions$.stream = hot('a', { a: action });
    const expected = cold('a', { a: completion });

    expect(effects.updateCustomServiceOfferingParams$).toBeObservable(expected);
  });

  it('should show alert after updating error', () => {
    const spyAlert = spyOn(dialogService, 'alert');
    const action = new UpdateCustomServiceOfferingParamsError({ error: new Error('Error occurred!') });

    actions$.stream = hot('a', { a: action });
    const expected = cold('a', { a: action });

    expect(effects.updateCustomServiceOfferingParamsError$).toBeObservable(expected);
    expect(spyAlert).toHaveBeenCalled();
  });
});
