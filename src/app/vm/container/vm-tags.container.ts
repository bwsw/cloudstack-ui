import {
  Component,
  OnInit
} from '@angular/core';
import { State } from '../../reducers';
import { Store } from '@ngrx/store';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { VirtualMachine } from '../shared/vm.model';
import { Tag } from '../../shared/models';
import {
  KeyValuePair,
  TagEditAction
} from '../../tags/tags-view/tags-view.component';

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
export class VmTagsContainerComponent extends WithUnsubscribe() implements OnInit {

  readonly vm$ = this.store.select(fromVMs.getSelectedVM);

  public vm: VirtualMachine;


  constructor(
    private store: Store<State>,
  ) {
    super();
  }

  public editTag(tagEditAction: TagEditAction) {
    const newTag = {
      resourceid: this.vm.id,
      resourcetype: this.vm.resourceType,
      key: tagEditAction.newTag.key,
      value: tagEditAction.newTag.value
    };
    const newTags = Object.assign([], this.vm.tags)
      .filter(t => tagEditAction.oldTag.key !== t.key);
    newTags.push(newTag as Tag);
    this.store.dispatch(new vmActions.UpdateVM(Object.assign(
      {},
      this.vm,
      { tags: newTags }
    )));
  }

  public deleteTag(tag: Tag) {
    const newTags = Object.assign([], this.vm.tags).filter(t => tag.key !== t.key);
    this.store.dispatch(new vmActions.UpdateVM(Object.assign(
      {},
      this.vm,
      { tags: newTags }
    )));
  }

  public addTag(keyValuePair: KeyValuePair) {
    const newTag = {
      resourceid: this.vm.id,
      resourcetype: this.vm.resourceType,
      key: keyValuePair.key,
      value: keyValuePair.value
    };
    const newTags = Object.assign([], this.vm.tags);
    newTags.push(newTag as Tag);
    this.store.dispatch(new vmActions.UpdateVM(Object.assign(
      {},
      this.vm,
      { tags: newTags }
    )));
  }

  public ngOnInit() {
    this.vm$
      .takeUntil(this.unsubscribe$)
      .subscribe(vm => {
        if (vm) {
          this.vm = new VirtualMachine(vm);
        }
      });
  }
}
