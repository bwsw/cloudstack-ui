import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tag } from '../../shared/models/tag.model';

export interface TagCategory {
  name: string;
  tags: Tag[];
}

@Component({
  selector: 'cs-tag-category',
  templateUrl: 'tag-category.component.html',
  styleUrls: ['tag-category.component.scss'],
})
export class TagCategoryComponent {
  @Input()
  public category: TagCategory;
  @Input()
  public tags: Tag[];
  @Input()
  public query: string;
  @Input()
  public hasPermissions = false;
  @Output()
  public tagAdded: EventEmitter<TagCategory>;
  @Output()
  public tagEdited: EventEmitter<Tag>;
  @Output()
  public tagDeleted: EventEmitter<Tag>;

  public loading: boolean;

  constructor() {
    this.tagAdded = new EventEmitter<TagCategory>();
    this.tagEdited = new EventEmitter<Tag>();
    this.tagDeleted = new EventEmitter<Tag>();
  }

  public addTag(): void {
    this.tagAdded.emit(this.category);
  }

  public editTag(tag: Tag): void {
    this.tagEdited.emit(tag);
  }

  public removeTag(tag: Tag): void {
    this.tagDeleted.emit(tag);
  }
}
