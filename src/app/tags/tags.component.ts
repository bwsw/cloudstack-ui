import { Observable } from 'rxjs/Observable';
import { DialogService } from '../dialog/dialog-service/dialog.service';
import { Taggable } from '../shared/interfaces/taggable.interface';
import { Tag } from '../shared/models';
import { TagService } from '../shared/services/tags/tag.service';
import {
  KeyValuePair,
  TagEditAction
} from './tags-view/tags-view.component';
import { EventEmitter } from '@angular/core';


export abstract class TagsComponent<T extends Taggable> {
  public abstract entity: Taggable;
  public onTagAdd = new EventEmitter<KeyValuePair>();
  public onTagEdit = new EventEmitter<TagEditAction>();
  public onTagDelete = new EventEmitter<Tag>();

  public tags: Array<Tag>;

  constructor(
    protected dialogService: DialogService,
    protected tagService: TagService,
  ) { }


  public addTag(tag: KeyValuePair): void {
    if (!tag) {
      return;
    }

    this.tagService.create({
      resourceIds: this.entity.id,
      resourceType: this.entity.resourceType,
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

    Observable.of(null)
      .switchMap(() => {
        return this.tagService.remove({
          resourceIds: tagEditAction.oldTag.resourceId,
          resourceType: tagEditAction.oldTag.resourceType,
          'tags[0].key': tagEditAction.oldTag.key,
          'tags[0].value': tagEditAction.oldTag.value
        });
      })
      .switchMap(() => {
        return this.tagService.create({
          resourceIds: tagEditAction.oldTag.resourceId,
          resourceType: tagEditAction.oldTag.resourceType,
          'tags[0].key': tagEditAction.newTag.key,
          'tags[0].value': tagEditAction.newTag.value
        });
      })
      .subscribe(
        res => this.onTagEdit.emit(tagEditAction),
        error => this.onError(error)
      );

  }

  public deleteTag(tag: Tag): void {
    this.tagService.remove({
      resourceIds: tag.resourceId,
      resourceType: tag.resourceType,
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
