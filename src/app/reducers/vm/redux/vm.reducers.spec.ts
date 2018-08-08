import { VirtualMachine } from '../../../vm';
import * as vmActions from './vm.actions';
import * as fromVM from './vm.reducers'
import { VirtualMachineTagKeys } from '../../../shared/services/tags/vm-tag-keys';

describe('VM listReducer', () => {
  it('should return the default state on undefined action', () => {
    const initialState = fromVM.initialListState;
    const action = {};
    const state = fromVM.listReducer(undefined, action);

    expect(state).toBe(initialState)
  });

  it('should add VM password tag to tags array', () => {
    const vm: Partial<VirtualMachine> = {
      id: '10',
      tags: [
        { key: 'key1', value: '1'},
        { key: 'key2', value: '2'},
      ]
    };
    const password = 'qwerty';

    const initialState = { ...fromVM.initialListState, entities: { [vm.id]: vm }};
    const action = new vmActions.SaveVMPasswordSuccess({ vm, password });
    const state = fromVM.listReducer(initialState, action);

    const finalTags = state.entities[vm.id].tags;
    const addedTag = finalTags.find(tag => tag.key === VirtualMachineTagKeys.passwordTag);
    expect(finalTags.length).toBe(vm.tags.length + 1);
    expect(addedTag).toEqual({ key: VirtualMachineTagKeys.passwordTag, value: password });
  });
});
