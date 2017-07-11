import { Component, Input } from '@angular/core';
import { Tag } from '../../shared/models';
import { TagService } from '../../shared/services';
import { Taggable } from '../../shared/interfaces/taggable.interface';


@Component({
  selector: 'cs-tag',
  templateUrl: 'tag.component.html',
  styleUrls: ['tag.component.scss']
})
export class TagComponent {
  @Input() public entity: Taggable;
  @Input() public query: string;
  @Input() public tag: Tag;

  public loading: boolean;

  constructor(private tagService: TagService) {}

  public update(value: string): void {
    this.loading = true;

    this.tagService.update(
      this.tag.resourceId,
      this.tag.resourceType,
      this.tag.key,
      value
    )
      .finally(() => this.loading = false)
      .subscribe();
  }

  public remove(): void {
    this.loading = true;

    this.tagService.remove({
      resourceIds: this.entity.id,
      resourceType: this.entity.resourceType,
      'tags[0].key': this.tag.key
    })
      .finally(() => this.loading = false)
      .subscribe();
  }

  public onTagValueChange(value: string): void {
    if (value) {
      this.update(value);
    } else {
      this.remove();
    }
  }
}
