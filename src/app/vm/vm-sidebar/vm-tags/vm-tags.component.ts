import { Component, Input, OnChanges, } from '@angular/core';
import { VmResourceType } from '../../';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { TagService } from '../../../shared/services/tags/tag.service';
import { KeyValuePair } from '../../../tags/tags-view/tags-view.component';
import { TagsComponent } from '../../../tags/tags.component';
import { VirtualMachine } from '../../shared/vm.model';


@Component({
  selector: 'cs-vm-tags',
  templateUrl: 'vm-tags.component.html'
})
export class VmTagsComponent extends TagsComponent<VirtualMachine> implements OnChanges {
  @Input() public entity: VirtualMachine;

  constructor(
    protected dialogService: DialogService,
    protected tagService: TagService,
  ) {
    super(dialogService, tagService);
  }

  public ngOnChanges(): void {
    this.tags = this.entity && this.entity.tags;
  }

  public addTag(tag: KeyValuePair): void {
    if (!tag) {
      return;
    }

    this.tagService.create({
      resourceIds: this.entity.id,
      resourceType: VmResourceType,
      'tags[0].key': tag.key,
      'tags[0].value': tag.value
    })
      .subscribe(
        res => this.onTagAdd.emit(tag),
        error => this.onError(error)
      );
  }
}
