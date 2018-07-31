import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { State } from '../../reducers';
import { Tag } from '../../shared/models';
import { KeyValuePair, TagEditAction } from '../../tags/tags-view/tags-view.component';
import { VirtualMachine, VmResourceType } from '../shared/vm.model';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';
import * as vmActions from '../../reducers/vm/redux/vm.actions';

@Component({
  selector: 'cs-vm-tags-container',
  template: `
    <cs-vm-tags
      [entity]="vm$ | async"
      (onTagAdd)="addTag($event)"
      (onTagDelete)="deleteTag($event)"
      (onTagEdit)="editTag($event)"
    ></cs-vm-tags>
  `
})
export class VmTagsContainerComponent {
  readonly vm$ = this.store.select(fromVMs.getSelectedVM);

  constructor(private store: Store<State>) {
  }

  public editTag(tagEditAction: TagEditAction) {
    this.vm$.take(1).subscribe((vm: VirtualMachine) => {
      const newTag: Tag = {
        resourceid: vm.id,
        resourcetype: VmResourceType,
        key: tagEditAction.newTag.key,
        value: tagEditAction.newTag.value,
        account: vm.account,
        domain: vm.domain,
        domainid: vm.domainid
      };
      const newTags: Tag[] = vm.tags.filter(t => tagEditAction.oldTag.key !== t.key);
      newTags.push(newTag);
      this.store.dispatch(new vmActions.UpdateVM(Object.assign(
        {},
        vm,
        { tags: newTags }
      )));
    });
  }

  public deleteTag(tag: Tag) {
    this.vm$.take(1).subscribe((vm: VirtualMachine) => {
      const newTags = Object.assign([], vm.tags).filter(t => tag.key !== t.key);
      this.store.dispatch(new vmActions.UpdateVM(Object.assign(
        {},
        vm,
        { tags: newTags }
      )));
    });
  }

  public addTag(keyValuePair: KeyValuePair) {
    this.vm$.take(1).subscribe((vm: VirtualMachine) => {
      const newTag: Tag = {
        resourceid: vm.id,
        resourcetype: VmResourceType,
        key: keyValuePair.key,
        value: keyValuePair.value,
        account: vm.account,
        domain: vm.domain,
        domainid: vm.domainid
      };
      const newTags: Tag[] = [...vm.tags];
      newTags.push(newTag);
      this.store.dispatch(new vmActions.UpdateVM(Object.assign(
        {},
        vm,
        { tags: newTags }
      )));
    });
  }
}
