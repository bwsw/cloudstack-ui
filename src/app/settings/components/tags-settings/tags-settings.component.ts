import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { KeyValuePair, TagEditAction } from '../../../tags/tags-view/tags-view.component';
import { Tag } from '../../../shared/models';

@Component({
  selector: 'cs-tags-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tags-settings.component.html',
})
export class TagsSettingsComponent {
  @Input()
  query: string;
  @Input()
  tags: any;
  @Input()
  isLoading: boolean;
  @Input()
  tagPage: string;
  @Output()
  queryChanged = new EventEmitter<string>();
  @Output()
  keyboardLayoutChange = new EventEmitter<string>();
  @Output()
  public addTag = new EventEmitter<KeyValuePair>();
  @Output()
  public deleteTag = new EventEmitter<Tag>();
  @Output()
  public editTag = new EventEmitter<TagEditAction>();
}
