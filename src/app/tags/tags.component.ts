import { OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../dialog/dialog-module/dialog.service';
import { Taggable } from '../shared/interfaces/taggable.interface';
import { Tag } from '../shared/models';
import { TagService } from '../shared/services';
import { KeyValuePair, TagEditAction } from './tags-view/tags-view.component';


export abstract class TagsComponent implements OnInit {
  public abstract entity: Taggable;

  public tags: BehaviorSubject<Array<Tag>>;

  constructor(
    protected dialogService: DialogService,
    protected tagService: TagService,
  ) {
    this.tags = new BehaviorSubject<Array<Tag>>([]);
  }

  public ngOnInit(): void {
    this.tags.next(this.entity.tags);
    this.tags.subscribe(tags => this.entity.tags = tags);
  }

  public onTagAdd(tag: KeyValuePair): void {
    this.tagService.create({
      resourceIds: this.entity.id,
      resourceType: this.entity.resourceType,
      'tags[0].key': tag.key,
      'tags[0].value': tag.value
    })
      .switchMap(() => this.entityTags)
      .subscribe(
        tags => this.tags.next(tags),
        error => this.onError(error)
      );
  }

  public onTagEdit(tagEditAction: TagEditAction): void {
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
          'tags[0].value': tagEditAction.newTag
        });
      })
      .switchMap(() => this.entityTags)
      .subscribe(
        tags => this.tags.next(tags),
        error => this.onError(error)
      );

  }

  public onTagDelete(tag: Tag): void {
    this.tagService.remove({
      resourceIds: tag.resourceId,
      resourceType: tag.resourceType,
      'tags[0].key': tag.key
    })
      .switchMap(() => this.entityTags)
      .subscribe(
        tags => this.tags.next(tags),
        error => this.onError(event)
      );
  }

  protected onError(error: any): void {
    this.dialogService.alert({
      translationToken: error.message,
      interpolateParams: error.params
    });
  }

  protected abstract get entityTags(): Observable<Array<Tag>>;
}
