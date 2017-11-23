import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../reducers/index';

import * as fromTemplates from '../../../reducers/templates/redux/template.reducers';
import * as templateActions from '../../../reducers/templates/redux/template.actions';

@Component({
  selector: 'cs-template-tags-container',
  template: `
    <cs-template-tags
      [entity]="template$ | async"
      [tags]="templateTags$ | async"
      (onTagAdded)="update()"
      (onTagRemoved)="update()"
      (onTagEdited)="update()"
    ></cs-template-tags>`
})
export class TagsContainerComponent {
  readonly template$ = this.store.select(fromTemplates.getSelectedTemplate);
  readonly templateTags$ = this.store.select(fromTemplates.getSelectedTemplateTags);

  constructor(private store: Store<State>) {
  }

  public update() {
    this.store.dispatch(new templateActions.LoadTemplatesRequest())
  }
}
