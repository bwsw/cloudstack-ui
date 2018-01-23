import { Component } from '@angular/core';
import { State } from '../../reducers';
import { Store } from '@ngrx/store';
import * as fromSecurityGroups from '../../reducers/security-groups/redux/sg.reducers';
import * as sgActions from '../../reducers/security-groups/redux/sg.actions';
import { SecurityGroup } from '../sg.model';
import { Tag } from '../../shared/models';
import { KeyValuePair, TagEditAction } from '../../tags/tags-view/tags-view.component';
import { AuthService } from '../../shared/services/auth.service';

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
  readonly sg$ = this.store.select(fromSecurityGroups.getSelectedSecurityGroup);

  constructor(
    private store: Store<State>,
    private authService: AuthService
  ) {
  }

  public editTag(tagEditAction: TagEditAction) {
    this.sg$.take(1).subscribe((sg: SecurityGroup) => {
      const newTag: Tag = {
        resourceid: sg.id,
        resourcetype: 'SecurityGroup',
        key: tagEditAction.newTag.key,
        value: tagEditAction.newTag.value,
        account: sg.account,
        domain: sg.domain,
        domainid: this.authService.user.domainid
      };
      const newTags: Tag[] = sg.tags.filter(t => tagEditAction.oldTag.key !== t.key);
      newTags.push(newTag);
      this.store.dispatch(new sgActions.UpdateSecurityGroup(Object.assign(
        {},
        sg,
        { tags: newTags }
      )));
    });
  }

  public deleteTag(tag: Tag) {
    this.sg$.take(1).subscribe((sg: SecurityGroup) => {
      const newTags = Object.assign([], sg.tags).filter(_ => tag.key !== _.key);
      this.store.dispatch(new sgActions.UpdateSecurityGroup(Object.assign(
        {},
        sg,
        { tags: newTags}
      )))
    });
  }

  public addTag(keyValuePair: KeyValuePair) {
    this.sg$.take(1).subscribe((sg: SecurityGroup) => {
      const newTag = {
        resourceid: sg.id,
        resourcetype: 'SecurityGroup',
        key: keyValuePair.key,
        value: keyValuePair.value,
        account: sg.account,
        domain: sg.domain,
        domainid: this.authService.user.domainid
      };
      const newTags: Tag[] = [...sg.tags];
      newTags.push(newTag);
      this.store.dispatch(new sgActions.UpdateSecurityGroup(Object.assign(
        {},
        sg,
        { tags: newTags }
      )));
    });
  }
}
