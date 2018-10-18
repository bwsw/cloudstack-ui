import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { State } from '../../reducers';
import { Tag } from '../../shared/models';
import { KeyValuePair, TagEditAction } from '../../tags/tags-view/tags-view.component';
import { isSecurityGroupNative } from '../sg.model';
import * as fromSecurityGroups from '../../reducers/security-groups/redux/sg.reducers';
import * as sgActions from '../../reducers/security-groups/redux/sg.actions';

@Component({
  selector: 'cs-sg-tags-container',
  template: `
    <cs-sg-tags
      [entity]="sg$ | async"
      (tagAdded)="addTag($event)"
      (tagDeleted)="deleteTag($event)"
      (tagEdited)="editTag($event)"
    ></cs-sg-tags>
  `,
})
export class SecurityGroupTagsContainerComponent {
  readonly sg$ = this.store.pipe(select(fromSecurityGroups.getSelectedSecurityGroup));

  constructor(private store: Store<State>) {}

  public editTag(tagEditAction: TagEditAction) {
    this.sg$.pipe(take(1)).subscribe(sg => {
      if (!isSecurityGroupNative(sg)) {
        throw new Error('Can not edit tag of a predefined group');
      }

      const newTag: Tag = {
        resourceid: sg.id,
        resourcetype: 'SecurityGroup',
        key: tagEditAction.newTag.key,
        value: tagEditAction.newTag.value,
        account: sg.account,
        domain: sg.domain,
        domainid: sg.domainid,
      };
      const newTags: Tag[] = sg.tags.filter(t => tagEditAction.oldTag.key !== t.key);
      newTags.push(newTag);
      const result = { ...sg, tags: newTags };
      this.store.dispatch(new sgActions.UpdateSecurityGroup(result));
    });
  }

  public deleteTag(tag: Tag) {
    this.sg$.pipe(take(1)).subscribe(sg => {
      if (!isSecurityGroupNative(sg)) {
        throw new Error('Can not delete tag of a predefined group');
      }

      const newTags = sg.tags.filter(_ => tag.key !== _.key);
      this.store.dispatch(new sgActions.UpdateSecurityGroup({ ...sg, tags: newTags }));
    });
  }

  public addTag(keyValuePair: KeyValuePair) {
    this.sg$.pipe(take(1)).subscribe(sg => {
      if (!isSecurityGroupNative(sg)) {
        throw new Error('Can not add tag to a predefined group');
      }

      const newTag = {
        resourceid: sg.id,
        resourcetype: 'SecurityGroup',
        key: keyValuePair.key,
        value: keyValuePair.value,
        account: sg.account,
        domain: sg.domain,
        domainid: sg.domainid,
      };
      const newTags: Tag[] = [...sg.tags];
      newTags.push(newTag);

      const result = { ...sg, tags: newTags };
      this.store.dispatch(new sgActions.UpdateSecurityGroup(result));
    });
  }
}
