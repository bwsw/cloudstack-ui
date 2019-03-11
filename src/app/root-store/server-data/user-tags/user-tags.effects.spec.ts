import { of, throwError } from 'rxjs';
import { Actions } from '@ngrx/effects';
import { cold, hot } from 'jasmine-marbles';

import {
  DeleteTagSuccess,
  LoadUserTags,
  LoadUserTagsError,
  LoadUserTagsSuccess,
  SetDefaultUserTagDueToDelete,
  UpdateLastVMId,
  UpdateLastVMIdError,
  UpdateLastVMIdSuccess,
} from './user-tags.actions';
import { UserTagsEffects } from './user-tags.effects';
import { userTagKeys } from '../../../tags/tag-keys';
import { AuthService } from '../../../shared/services/auth.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store, StoreModule } from '@ngrx/store';
import * as fromVolumes from '../../../reducers/volumes/redux/volumes.reducers';
import { getActions, TestActions } from '../../../reducers/volumes/redux/volumes.effects.spec';
import { TagService } from '../../../shared/services/tags/tag.service';
import { MockTagService } from '../../../../testutils/mocks/tag-services/mock-tag.service';
import { TestStore } from '../../../../testutils/ngrx-test-store';

class StoreStub {}

function createTagServiceStub(listResponse: any, createRespone: any, removeResponce: any) {
  const service = jasmine.createSpyObj('tagService', ['getList', 'create', 'remove']);

  const isListError = listResponse instanceof Error;
  const isCreateError = createRespone instanceof Error;
  const isRemoveError = removeResponce instanceof Error;
  // tslint:disable:variable-name
  const _listResponse = isListError ? throwError(listResponse) : of(listResponse);
  const _createResponse = isCreateError ? throwError(createRespone) : of(createRespone);
  const _removeResponse = isRemoveError ? throwError(removeResponce) : of(removeResponce);
  // tslint:enable:variable-name

  service.getList.and.returnValue(_listResponse);
  service.create.and.returnValue(_createResponse);
  service.remove.and.returnValue(_removeResponse);

  return service;
}

function createAuthServiceStub() {
  const authService = {
    user$: {
      pipe: () => of({ userid: '100 ' }),
    },
    user: {
      userid: '100 ',
    },
  };

  return authService as AuthService;
}

describe('User tags effects', () => {
  it('should load user tags', () => {
    const source = cold('a', { a: new LoadUserTags() });
    const tagService = createTagServiceStub([], null, null);
    const authService = createAuthServiceStub();
    const store = jasmine.createSpyObj(['pipe']);
    const effects = new UserTagsEffects(new Actions(source), tagService, authService, store);

    const expected = cold('b', { b: new LoadUserTagsSuccess({ tags: [] }) });
    expect(effects.loadUserTags$).toBeObservable(expected);
  });

  it('should handle loading user tags errors', () => {
    const source = cold('a', { a: new LoadUserTags() });
    const tagService = createTagServiceStub(new Error('error'), null, null);
    const authService = createAuthServiceStub();
    const store = jasmine.createSpyObj(['pipe']);
    const effects = new UserTagsEffects(new Actions(source), tagService, authService, store);

    const expected = cold('b', { b: new LoadUserTagsError({ error: new Error('error') }) });
    expect(effects.loadUserTags$).toBeObservable(expected);
  });

  it('should update user tags (eg. LastVMId)', () => {
    const source = cold('a', { a: new UpdateLastVMId({ value: 5 }) });
    const tagService = createTagServiceStub(null, {}, {});
    const authService = createAuthServiceStub();
    const store = jasmine.createSpyObj(['pipe']);
    const effects = new UserTagsEffects(new Actions(source), tagService, authService, store);

    const expected = cold('b', {
      b: new UpdateLastVMIdSuccess({
        key: userTagKeys.lastVMId,
        value: '5',
      }),
    });
    expect(effects.updateLastVmId$).toBeObservable(expected);
  });

  // This is about an error when you try to delete tag that does not exist
  it('should handle error when deleting a tag in the tag update function and continue execution', () => {
    const actions = new Actions(cold('a', { a: new UpdateLastVMId({ value: 5 }) }));
    const tagService = createTagServiceStub(null, {}, new Error('error'));
    const authService = createAuthServiceStub();
    const store = jasmine.createSpyObj(['pipe']);
    const effects = new UserTagsEffects(actions, tagService, authService, store);

    const expected = cold('b', {
      b: new UpdateLastVMIdSuccess({
        key: userTagKeys.lastVMId,
        value: '5',
      }),
    });
    expect(effects.updateLastVmId$).toBeObservable(expected);
  });

  it('should handle error when creating a tag in the tag update function', () => {
    const actions = new Actions(cold('a', { a: new UpdateLastVMId({ value: 5 }) }));
    const tagService = createTagServiceStub(null, new Error('error'), {});
    const authService = createAuthServiceStub();
    const store = jasmine.createSpyObj(['pipe']);
    const effects = new UserTagsEffects(actions, tagService, authService, store);

    const expected = cold('b', { b: new UpdateLastVMIdError({ error: new Error('error') }) });
    expect(effects.updateLastVmId$).toBeObservable(expected);
  });
});

describe('User tags effects new', () => {
  let actions$: TestActions;
  let tagService: TagService;
  let effects: UserTagsEffects;
  let store: TestStore<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StoreModule.forRoot({ ...fromVolumes.volumeReducers })],
      providers: [
        UserTagsEffects,
        { provide: Actions, useFactory: getActions },
        { provide: Store, useClass: TestStore },
        { provide: AuthService, useValue: createAuthServiceStub },
        { provide: TagService, useClass: MockTagService },
      ],
    });
    actions$ = TestBed.get(Actions);
    tagService = TestBed.get(TagService);
    effects = TestBed.get(UserTagsEffects);
    store = TestBed.get(Store);
  });

  it('should dispatch SetDefaultUserTagDueToDelete action', () => {
    const key = userTagKeys.savePasswordForAllVMs;
    const tag = {
      key,
      value: null,
    };
    store.setState([tag]);
    const action = new DeleteTagSuccess(key);
    const completion = new SetDefaultUserTagDueToDelete(tag);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.deleteTagSuccess$).toBeObservable(expected);
  });
});
