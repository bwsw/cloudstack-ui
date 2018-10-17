import { VirtualMachine } from '../../../vm';
import * as vmActions from './vm.actions';
import * as fromVM from './vm.reducers';
import * as mockData from '../../../../testutils/data/vitrual-machines';
import { virtualMachineTagKeys } from '../../../shared/services/tags/vm-tag-keys';

describe('VM listReducer', () => {
  it('should add VM password tag to tags array', () => {
    const vm: VirtualMachine = mockData.vm;
    const password = 'qwerty';

    const initialState = { ...fromVM.initialListState, entities: { [vm.id]: vm } };
    const action = new vmActions.SaveVMPasswordSuccess({ password, vmId: vm.id });
    const state = fromVM.listReducer(initialState, action);

    const finalTags = state.entities[vm.id].tags;
    const addedTag = finalTags.find(tag => tag.key === virtualMachineTagKeys.passwordTag);
    expect(finalTags.length).toBe(vm.tags.length + 1);
    expect(addedTag).toEqual({ key: virtualMachineTagKeys.passwordTag, value: password });
  });
});
