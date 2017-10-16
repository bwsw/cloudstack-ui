import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tag } from '../../shared/models/tag.model';


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
  @Input() public tags: Array<Tag>;
  @Input() public query: string;
  @Input() public hasPermissions = false;
  @Output() public onTagAdd: EventEmitter<TagCategory>;
  @Output() public onTagEdit: EventEmitter<Tag>;
  @Output() public onTagDelete: EventEmitter<Tag>;

  public loading: boolean;

  constructor() {
    this.onTagAdd = new EventEmitter<TagCategory>();
    this.onTagEdit = new EventEmitter<Tag>();
    this.onTagDelete = new EventEmitter<Tag>();
  }

  public addTag(): void {
    this.onTagAdd.emit(this.category);
  }

  public editTag(tag: Tag): void {
    this.onTagEdit.emit(tag);
  }

  public removeTag(tag: Tag): void {
    this.onTagDelete.emit(tag);
  }
}
