import { Component, Input } from '@angular/core';
import { ResourceTypes, Tag } from '../../../../shared/models';
import { TagService } from '../../../../shared/services';
import { DialogService } from '../../../../dialog/dialog-module/dialog.service';


@Component({
  selector: 'cs-vm-tag',
  templateUrl: 'vm-tag.component.html',
  styleUrls: ['vm-tag.component.scss']
})
export class VmTagComponent {
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
      resourceIds: this.tag.resourceId,
      resourceType: ResourceTypes.VM,
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
