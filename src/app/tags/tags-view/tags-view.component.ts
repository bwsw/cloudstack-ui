import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import * as cloneDeep from 'lodash/cloneDeep';
import * as groupBy from 'lodash/groupBy';
import * as sortBy from 'lodash/sortBy';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { defaultCategoryName, Tag } from '../../shared/models';
import { Utils } from '../../shared/services/utils.service';
import { TagCategory } from '../tag-category/tag-category.component';
import { TagEditComponent } from '../tag-edit/tag-edit.component';

export interface TagEditAction {
  oldTag: Tag;
  newTag: KeyValuePair;
}

export interface KeyValuePair {
  key: string;
  value: string;
}

@Component({
  selector: 'cs-tags-view',
  templateUrl: 'tags-view.component.html',
  styleUrls: ['tags-view.component.scss']
})
export class TagsViewComponent implements OnChanges {
  @Input() public tags: Array<Tag>;
  @Output() public onTagAdd: EventEmitter<Partial<Tag>>;
  @Output() public onTagEdit: EventEmitter<TagEditAction>;
  @Output() public onTagDelete: EventEmitter<Tag>;

  public categories: Array<TagCategory>;
  public query: string;
  public visibleCategories: Array<TagCategory>;

  constructor(private cd: ChangeDetectorRef, private dialogService: DialogService) {
    this.onTagAdd = new EventEmitter<Tag>();
    this.onTagEdit = new EventEmitter<TagEditAction>();
    this.onTagDelete = new EventEmitter<Tag>();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('tags' in changes) {
      this.updateResults();
    }
  }

  public addTag(category?: TagCategory): void {
    const forbiddenKeys = category ? category.tags.map(_ => _.key) : [];
    this.dialogService
      .showCustomDialog({
        component: TagEditComponent,
        classes: 'tag-edit',
        providers: [
          { provide: 'forbiddenKeys', useValue: forbiddenKeys },
          { provide: 'title', useValue: 'TAGS.CREATE_NEW_TAG' },
          { provide: 'confirmButtonText', useValue: 'COMMON.CREATE' },
          { provide: 'categoryName', useValue: category && category.name }
        ]
      })
      .switchMap(res => res.onHide())
      .subscribe(tag => this.onTagAdd.emit(tag));
  }

  public editTag(tag: Tag): void {
    this.dialogService
      .showCustomDialog({
        component: TagEditComponent,
        classes: 'tag-edit',
        providers: [
          { provide: 'title', useValue: 'TAGS.EDIT_TAG' },
          { provide: 'confirmButtonText', useValue: 'COMMON.EDIT' },
          { provide: 'categoryName', useValue: tag.categoryName },
          { provide: 'tag', useValue: tag }
        ]
      })
      .switchMap(res => res.onHide())
      .subscribe(tagEditAction => this.onTagEdit.emit(tagEditAction));
  }

  public removeTag(tag: Tag): void {
    this.onTagDelete.emit(tag);
  }

  public updateResults(): void {
    this.categories = this.getCategories();
    this.updateSearchResults(this.query);
  }

  public updateSearchResults(query: string): void {
    this.visibleCategories = this.getSearchResults(query);
    this.cd.detectChanges();
  }

  private getSearchResults(query: string): Array<TagCategory> {
    let categories = cloneDeep(this.categories);

    if (!query) {
      return categories;
    }

    categories = categories.filter(category => {
      return this.filterTags(category.tags).length;
    });

    categories.sort(this.compareCategories);

    return categories;
  }

  private filterTags(tags: Array<Tag>): Array<Tag> {
    return tags.filter(tag => {
      const keyMatch = Utils.matchLower(tag.key, this.query);
      const valueMatch = Utils.matchLower(tag.value, this.query);

      return keyMatch || valueMatch;
    });
  }

  private getCategories(): Array<TagCategory> {
    const groupedTags = groupBy(this.tags, 'categoryName');

    const categories = Object.keys(groupedTags)
      .map(categoryName => this.getCategory(groupedTags, categoryName))
      .filter(_ => _.tags.length);

    categories.sort(this.compareCategories);

    return categories;
  }

  private compareCategories(a: TagCategory, b: TagCategory): number {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    if (a.name === defaultCategoryName) {
      return -1;
    }
    if (b.name === defaultCategoryName) {
      return 1;
    }

    if (aName < bName) {
      return -1;
    }
    if (aName > bName) {
      return 1;
    }

    return 0;
  }

  private getCategory(groupedTags: any, name: string): TagCategory {
    const tags = groupedTags[name].filter(_ => _.keyWithoutCategory);
    const sortedTags = sortBy(tags, [_ => _.key.toLowerCase()]);

    return {
      name,
      tags: sortedTags
    };
  }
}
