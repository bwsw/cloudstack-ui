import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { State } from '../../../reducers';
import { resourceType, Template } from '../../shared';
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
      (tagAdded)="addTag($event)"
      (tagDeleted)="deleteTag($event)"
      (tagEdited)="editTag($event)"
    ></cs-template-tags>`,
})
export class TagsContainerComponent {
  readonly template$ = this.store.pipe(select(fromTemplates.getSelectedTemplate));
  readonly templateTags$ = this.store.pipe(select(fromTemplates.getSelectedTemplateTags));

  constructor(private store: Store<State>) {}

  public editTag(tagEdit: TagEditAction) {
    this.template$.pipe(take(1)).subscribe((template: Template) => {
      const newTag: Tag = this.createTag(template, tagEdit.newTag);
      const filteredTags: Tag[] = template.tags.filter(t => tagEdit.oldTag.key !== t.key);
      const newTags: Tag[] = [...filteredTags, newTag];
      this.store.dispatch(new templateActions.UpdateTemplate({ ...template, tags: newTags }));
    });
  }

  public deleteTag(tag: Tag) {
    this.template$.pipe(take(1)).subscribe((template: Template) => {
      const newTags = template.tags.filter(_ => tag.key !== _.key);
      this.store.dispatch(new templateActions.UpdateTemplate({ ...template, tags: newTags }));
    });
  }

  public addTag(keyValuePair: KeyValuePair) {
    this.template$.pipe(take(1)).subscribe((template: Template) => {
      const newTag: Tag = this.createTag(template, keyValuePair);
      const newTags: Tag[] = [...template.tags, newTag];
      this.store.dispatch(new templateActions.UpdateTemplate({ ...template, tags: newTags }));
    });
  }

  private createTag(template: Template, keyValuePair: KeyValuePair): Tag {
    return {
      resourceid: template.id,
      resourcetype: resourceType(template),
      key: keyValuePair.key,
      value: keyValuePair.value,
      account: template.account,
      domain: template.domain,
      domainid: template.domainid,
    };
  }
}
