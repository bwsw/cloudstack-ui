import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tag } from '../../../../shared/models';
import { DialogService } from '../../../../dialog/dialog-module/dialog.service';


export interface TagCategory {
  name: string;
  tags: Array<Tag>;
}

@Component({
  selector: 'cs-vm-tag-category',
  templateUrl: 'vm-tag-category.component.html',
  styleUrls: ['vm-tag-category.component.scss']
})
export class VmTagCategoryComponent {
  @Input() public category: TagCategory;
  @Output() public onNewTag: EventEmitter<TagCategory>;

  constructor() {
    this.onNewTag = new EventEmitter<TagCategory>();
  }

  public addTag(): void {
    this.onNewTag.emit(this.category);
  }
}
