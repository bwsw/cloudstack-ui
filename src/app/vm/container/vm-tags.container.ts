import { Component } from '@angular/core';
import { State } from '../../reducers';
import { Store } from '@ngrx/store';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import { Tag } from '../../shared/models';
import {
  KeyValuePair,
  TagEditAction
} from '../../tags/tags-view/tags-view.component';
import { VirtualMachine } from '../shared/vm.model';

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

  constructor(
    private store: Store<State>,
  ) {
  }

  public editTag(tagEditAction: TagEditAction) {
    this.vm$.take(1).subscribe((vm: VirtualMachine) => {
      const newTag = {
        resourceIds: vm.id,
        resourceType: vm.resourceType,
        key: tagEditAction.newTag.key,
        value: tagEditAction.newTag.value
      };
      const newTags = Object.assign([], vm.tags)
        .filter(t => tagEditAction.oldTag.key !== t.key);
      newTags.push(new Tag(newTag));
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
      const newTag = {
        resourceId: vm.id,
        resourceType: vm.resourceType,
        key: keyValuePair.key,
        value: keyValuePair.value
      };
      const newTags = Object.assign([], vm.tags);
      newTags.push(new Tag(newTag));
      this.store.dispatch(new vmActions.UpdateVM(Object.assign(
        {},
        vm,
        { tags: newTags }
      )));
    });
  }
}
