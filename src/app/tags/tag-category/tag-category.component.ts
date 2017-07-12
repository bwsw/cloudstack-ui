import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Taggable } from '../../shared/interfaces/taggable.interface';
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
  @Input() public entity: Taggable;
  @Input() public query: string;
  @Output() public onNewTag: EventEmitter<TagCategory>;
  @Output() public onTagEdit: EventEmitter<Tag>;
  @Output() public onTagDelete: EventEmitter<Tag>;

  public loading: boolean;

  constructor() {
    this.onNewTag = new EventEmitter<TagCategory>();
    this.onTagEdit = new EventEmitter<Tag>();
    this.onTagDelete = new EventEmitter<Tag>();
  }

  public addTag(): void {
    this.onNewTag.emit(this.category);
  }

  public editTag(tag: Tag): void {
    this.onTagEdit.emit(tag);
  }

  public removeTag(tag: Tag): void {
    this.onTagDelete.emit(tag);
  }
}
