import { Observable } from 'rxjs/Observable';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { cold } from 'jasmine-marbles';

import {
  LoadUserTags,
  LoadUserTagsError,
  LoadUserTagsSuccess,
  UpdateLastVMId,
  UpdateLastVMIdError,
  UpdateLastVMIdSuccess,
} from './user-tags.actions';
import { UserTagsEffects } from './user-tags.effects';
import { userTagKeys } from '../../../tags/tag-keys';

class StoreStub {
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

describe('User tags effects', () => {
  it('can load user tags', () => {
    const source = cold('a', { a: new LoadUserTags() });
    const tagService = createTagServiceStub([], null, null);
    const authService = createAuthServiceStub();
    const store = new StoreStub() as Store<any>;
    const effects = new UserTagsEffects(new Actions(source), tagService, authService, store);

    const expected = cold('b', { b: new LoadUserTagsSuccess({ tags: [] }) });
    expect(effects.loadUserTags$).toBeObservable(expected);
  });

  it('can handle loading user tags errors', () => {
    const source = cold('a', { a: new LoadUserTags() });
    const tagService = createTagServiceStub(new Error('error'), null, null);
    const authService = createAuthServiceStub();
    const store = new StoreStub() as Store<any>;
    const effects = new UserTagsEffects(new Actions(source), tagService, authService, store);

    const expected = cold('b', { b: new LoadUserTagsError({ error: new Error('error') }) });
    expect(effects.loadUserTags$).toBeObservable(expected);
  });

  it('can update user tags (eg. LastVMId)', () => {
    const source = cold('a', { a: new UpdateLastVMId({ value: 5 }) });
    const tagService = createTagServiceStub(null, {}, {});
    const authService = createAuthServiceStub();
    const store = new StoreStub() as Store<any>;
    const effects = new UserTagsEffects(new Actions(source), tagService, authService, store);

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
    const tagService = createTagServiceStub(null, {}, new Error('error'));
    const authService = createAuthServiceStub();
    const store = new StoreStub() as Store<any>;
    const effects = new UserTagsEffects(actions, tagService, authService, store);

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
    const tagService = createTagServiceStub(null, new Error('error'), {});
    const authService = createAuthServiceStub();
    const store = new StoreStub() as Store<any>;
    const effects = new UserTagsEffects(actions, tagService, authService, store);

    const expected = cold('b', { b: new UpdateLastVMIdError({ error: new Error('error') }) });
    expect(effects.updateLastVmId$).toBeObservable(expected);
  });
});
