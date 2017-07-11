import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tag } from '../../shared/models';


export interface TagCategory {
  name: string;
  tags: Array<Tag>;
}

@Component({
  selector: 'cs-tag-category',
  templateUrl: 'tag-category.component.html',
  styleUrls: ['tag-category.component.scss']
})
export class TagCategoryComponent {
  @Input() public category: TagCategory;
  @Input() public query: string;
  @Output() public onNewTag: EventEmitter<TagCategory>;

  constructor() {
    this.onNewTag = new EventEmitter<TagCategory>();
  }

  public addTag(): void {
    this.onNewTag.emit(this.category);
  }
}
