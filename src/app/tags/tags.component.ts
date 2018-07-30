import { DialogService } from '../dialog/dialog-service/dialog.service';
import { Taggable } from '../shared/interfaces/taggable.interface';
import { Tag } from '../shared/models';
import { TagService } from '../shared/services/tags/tag.service';
import { KeyValuePair, TagEditAction } from './tags-view/tags-view.component';
import { EventEmitter, Input, Output } from '@angular/core';


export abstract class TagsComponent<T extends Taggable> {
  public abstract entity: Taggable;
  @Input() public tags: Array<Tag>;
  @Output() public onTagAdd = new EventEmitter<KeyValuePair>();
  @Output() public onTagDelete = new EventEmitter<Tag>();
  @Output() public onTagEdit = new EventEmitter<TagEditAction>();
  public resourceType: string;

  constructor(
    protected dialogService: DialogService,
    protected tagService: TagService,
  ) {
  }

  public addTag(tag: KeyValuePair): void {
    if (!tag) {
      return;
    }

    this.tagService.create({
      resourceIds: this.entity.id,
      resourceType: this.entity.resourceType || this.resourceType,
      'tags[0].key': tag.key,
      'tags[0].value': tag.value
    })
      .subscribe(
        res => this.onTagAdd.emit(tag),
        error => this.onError(error)
      );
  }

  public editTag(tagEditAction: TagEditAction): void {
    if (!tagEditAction) {
      return;
    }

    const oldTagParams = {
      resourceIds: tagEditAction.oldTag.resourceid,
      resourceType: tagEditAction.oldTag.resourcetype,
      'tags[0].key': tagEditAction.oldTag.key,
      'tags[0].value': tagEditAction.oldTag.value
    };

    const newTagParams = {
      resourceIds: tagEditAction.oldTag.resourceid,
      resourceType: tagEditAction.oldTag.resourcetype,
      'tags[0].key': tagEditAction.newTag.key,
      'tags[0].value': tagEditAction.newTag.value
    };

    this.tagService.remove(oldTagParams)
      .switchMap(() => this.tagService.create(newTagParams))
      .subscribe(
        res => this.onTagEdit.emit(tagEditAction),
        error => this.onError(error)
      );

  }

  public deleteTag(tag: Tag): void {
    this.tagService.remove({
      resourceIds: tag.resourceid,
      resourceType: tag.resourcetype,
      'tags[0].key': tag.key
    })
      .subscribe(
        res => this.onTagDelete.emit(tag),
        error => this.onError(event)
      );
  }

  protected onError(error: any): void {
    this.dialogService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params
      }
    });
  }
}
