import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { State } from '../../reducers';
import { Tag } from '../../shared/models';
import { KeyValuePair, TagEditAction } from '../../tags/tags-view/tags-view.component';
import { VirtualMachine, vmResourceType } from '../shared/vm.model';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';
import * as vmActions from '../../reducers/vm/redux/vm.actions';

@Component({
  selector: 'cs-vm-tags-container',
  template: `
    <cs-vm-tags
      [entity]="vm$ | async"
      (tagAdded)="addTag($event)"
      (tagDeleted)="deleteTag($event)"
      (tagEdited)="editTag($event)"
    ></cs-vm-tags>
  `,
})
export class VmTagsContainerComponent {
  readonly vm$ = this.store.pipe(select(fromVMs.getSelectedVM));

  constructor(private store: Store<State>) {}

  public editTag(tagEditAction: TagEditAction) {
    this.vm$.pipe(take(1)).subscribe((vm: VirtualMachine) => {
      const newTag: Tag = {
        resourceid: vm.id,
        resourcetype: vmResourceType,
        key: tagEditAction.newTag.key,
        value: tagEditAction.newTag.value,
        account: vm.account,
        domain: vm.domain,
        domainid: vm.domainid,
      };
      const newTags: Tag[] = vm.tags.filter(t => tagEditAction.oldTag.key !== t.key);
      newTags.push(newTag);
      this.store.dispatch(new vmActions.UpdateVM({ ...vm, tags: newTags }));
    });
  }

  public deleteTag(tag: Tag) {
    this.vm$.pipe(take(1)).subscribe((vm: VirtualMachine) => {
      const newTags = (vm.tags || []).filter(t => tag.key !== t.key);
      this.store.dispatch(new vmActions.UpdateVM({ ...vm, tags: newTags }));
    });
  }

  public addTag(keyValuePair: KeyValuePair) {
    this.vm$.pipe(take(1)).subscribe((vm: VirtualMachine) => {
      const newTag: Tag = {
        resourceid: vm.id,
        resourcetype: vmResourceType,
        key: keyValuePair.key,
        value: keyValuePair.value,
        account: vm.account,
        domain: vm.domain,
        domainid: vm.domainid,
      };
      const newTags: Tag[] = [...vm.tags];
      newTags.push(newTag);
      this.store.dispatch(new vmActions.UpdateVM({ ...vm, tags: newTags }));
    });
  }
}
