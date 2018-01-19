import { Component } from '@angular/core';
import { State } from '../../reducers';
import { Store } from '@ngrx/store';
import { Tag } from '../../shared/models';
import { KeyValuePair, TagEditAction } from '../../tags/tags-view/tags-view.component';
import * as fromSecurityGroups from '../../reducers/security-groups/redux/sg.reducers';

@Component({
  selector: 'cs-vm-tags-container',
  template: `
    <cs-sg-tags
      [entity]="sg$ | async"
      (onTagAdd)="addTag($event)"
      (onTagDelete)="deleteTag($event)"
      (onTagEdit)="editTag($event)"
    ></cs-sg-tags>
  `
})
export class SecurityGroupTagsContainerComponent {
  readonly sg$ = this.store.select(fromSecurityGroups.selectFilteredSecurityGroups);

  constructor(
    private store: Store<State>,
  ) {
  }

  public editTag(tagEditAction: TagEditAction) {
    // this.vm$.take(1).subscribe((vm: VirtualMachine) => {
    //   const newTag: Tag = {
    //     resourceid: vm.id,
    //     resourcetype: VmResourceType,
    //     key: tagEditAction.newTag.key,
    //     value: tagEditAction.newTag.value,
    //     account: vm.account,
    //     domain: vm.domain,
    //     domainid: vm.domainid
    //   };
    //   const newTags: Tag[] = vm.tags.filter(t => tagEditAction.oldTag.key !== t.key);
    //   newTags.push(newTag);
    //   this.store.dispatch(new vmActions.UpdateVM(Object.assign(
    //     {},
    //     vm,
    //     { tags: newTags }
    //   )));
    // });
    console.log('edit');
  }

  public deleteTag(tag: Tag) {
    // this.vm$.take(1).subscribe((vm: VirtualMachine) => {
    //   const newTags = Object.assign([], vm.tags).filter(t => tag.key !== t.key);
    //   this.store.dispatch(new vmActions.UpdateVM(Object.assign(
    //     {},
    //     vm,
    //     { tags: newTags }
    //   )));
    // });
    console.log('delete');
  }

  public addTag(keyValuePair: KeyValuePair) {
    // this.vm$.take(1).subscribe((vm: VirtualMachine) => {
    //   const newTag: Tag = {
    //     resourceid: vm.id,
    //     resourcetype: VmResourceType,
    //     key: keyValuePair.key,
    //     value: keyValuePair.value,
    //     account: vm.account,
    //     domain: vm.domain,
    //     domainid: vm.domainid
    //   };
    //   const newTags: Tag[] = [...vm.tags];
    //   newTags.push(newTag);
    //   this.store.dispatch(new vmActions.UpdateVM(Object.assign(
    //     {},
    //     vm,
    //     { tags: newTags }
    //   )));
    // });
    console.log('add');
  }
}
