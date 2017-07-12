import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Taggable } from '../../shared/interfaces/taggable.interface';
import { Tag } from '../../shared/models';
import { NotificationService, TagService } from '../../shared/services';


@Component({
  selector: 'cs-tag',
  templateUrl: 'tag.component.html',
  styleUrls: ['tag.component.scss']
})
export class TagComponent {
  @Input() public entity: Taggable;
  @Input() public query: string;
  @Input() public tag: Tag;
  @Output() public onTagEdit: EventEmitter<Tag>;
  @Output() public onTagRemove: EventEmitter<Tag>;

  public loading: boolean;

  constructor(
    private notificationService: NotificationService,
    private tagService: TagService
  ) {
    this.onTagEdit = new EventEmitter<Tag>();
    this.onTagRemove = new EventEmitter<Tag>();
  }

  public edit(): void {
    this.onTagEdit.emit(this.tag);
  }

  public remove(): void {
    this.loading = true;

    this.tagService.remove({
      resourceIds: this.tag.resourceId,
      resourceType: this.tag.resourceType,
      'tags[0].key': this.tag.key
    })
      .finally(() => this.loading = false)
      .subscribe(() => this.onTagRemove.emit(this.tag));
  }

  public onCopySuccess(): void {
    this.notificationService.message('COPY_SUCCESS');
  }

  public onCopyFail(): void {
    this.notificationService.message('COPY_FAIL');
  }
}
