import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../reducers/index';
import { Template } from '../../shared';
import { Tag } from '../../../shared/models';
import { KeyValuePair, TagEditAction } from '../../../tags/tags-view/tags-view.component';

import * as fromTemplates from '../../../reducers/templates/redux/template.reducers';
import * as templateActions from '../../../reducers/templates/redux/template.actions';

@Component({
  selector: 'cs-template-tags-container',
  template: `
    <cs-template-tags
      [entity]="template$ | async"
      [tags]="templateTags$ | async"
      (onTagAdd)="addTag($event)"
      (onTagDelete)="deleteTag($event)"
      (onTagEdit)="editTag($event)"
    ></cs-template-tags>`
})
export class TagsContainerComponent {
  readonly template$ = this.store.select(fromTemplates.getSelectedTemplate);
  readonly templateTags$ = this.store.select(fromTemplates.getSelectedTemplateTags);

  constructor(private store: Store<State>) {
  }

  public editTag(tagEdit: TagEditAction) {
    this.template$.take(1).subscribe((template: Template) => {
      const newTag: Tag = {
        resourceid: template.id,
        resourcetype: 'Template',
        key: tagEdit.newTag.key,
        value: tagEdit.newTag.value,
        account: template.account,
        domain: template.domain,
        domainid: template.domainId
      };
      const newTags: Tag[] = template.tags.filter(t => tagEdit.oldTag.key !== t.key);
      newTags.push(newTag);
      const result = { ...template, tags: newTags };
      this.store.dispatch(new templateActions.UpdateTemplate(result));
    });
  }

  public deleteTag(tag: Tag) {
    this.template$.take(1).subscribe((template: Template) => {
      const newTags = template.tags.filter(_ => tag.key !== _.key);
      this.store.dispatch(new templateActions.UpdateTemplate({ ...template, tags: newTags }));
    });
  }

  public addTag(keyValuePair: KeyValuePair) {
    this.template$.take(1).subscribe((template: Template) => {
      const newTag = {
        resourceid: template.id,
        resourcetype: 'SecurityGroup',
        key: keyValuePair.key,
        value: keyValuePair.value,
        account: template.account,
        domain: template.domain,
        domainid: template.domainId
      };
      const newTags: Tag[] = [...template.tags];
      newTags.push(newTag);

      const result = { ...template, tags: newTags };
      this.store.dispatch(new templateActions.UpdateTemplate(result));
    });
  }
}
