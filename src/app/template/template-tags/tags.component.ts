import { Tag } from '../../shared/models';
import { BaseTemplateModel } from '../shared/base-template.model';
import { EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { TagService } from '../../shared/services/tags/tag.service';
import { BaseTemplateService } from '../shared/base-template.service';
import { KeyValuePair, TagEditAction } from '../../tags/tags-view/tags-view.component';


export abstract class BaseTemplateTagsComponent {
  @Input() public entity: BaseTemplateModel;
  @Input() public tags: Array<Tag>;
  @Output() public onTagAdded = new EventEmitter<KeyValuePair>();
  @Output() public onTagRemoved = new EventEmitter<Tag>();
  @Output() public onTagEdited = new EventEmitter<TagEditAction>();

  public get hasPermissions(): boolean {
    return this.entity.account === this.authService.user.username || this.authService.isAdmin();
  }

  constructor(
    protected service: BaseTemplateService,
    protected dialogService: DialogService,
    protected tagService: TagService,
    protected authService: AuthService
  ) {
  }

  public onTagAdd(tag: KeyValuePair): void {
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
        tags => this.onTagAdded.emit(tag),
        error => this.onError(error)
      );
  }

  public onTagEdit(tagEditAction: TagEditAction): void {
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
        tags => this.onTagEdited.emit(tagEditAction),
        error => this.onError(error)
      );

  }

  public onTagDelete(tag: Tag): void {
    this.tagService.remove({
      resourceIds: tag.resourceId,
      resourceType: tag.resourceType,
      'tags[0].key': tag.key
    })
      .subscribe(
        tags => this.onTagRemoved.emit(tag),
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
