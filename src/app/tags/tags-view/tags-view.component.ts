import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges, OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { MdDialog } from '@angular/material';
import * as cloneDeep from 'lodash/cloneDeep';
import * as groupBy from 'lodash/groupBy';
import * as sortBy from 'lodash/sortBy';
import { defaultCategoryName, Tag } from '../../shared/models';
import { Utils } from '../../shared/services/utils/utils.service';
import { TagCategory } from '../tag-category/tag-category.component';
import { TagEditComponent } from '../tag-edit/tag-edit.component';
import { filterWithPredicates } from '../../shared/utils/filter';
import { UserTagService } from '../../shared/services/tags/user-tag.service';


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
export class TagsViewComponent implements OnInit, OnChanges {
  @Input() public tags: Array<Tag>;
  @Input() public canAddTag = true;
  @Input() public hasPermissions = false;
  @Output() public onTagAdd: EventEmitter<Partial<Tag>>;
  @Output() public onTagEdit: EventEmitter<TagEditAction>;
  @Output() public onTagDelete: EventEmitter<Tag>;

  public categories: Array<TagCategory>;
  public query: string;
  public visibleCategories: Array<TagCategory>;
  public showSystemTags = false;

  constructor(
    private cd: ChangeDetectorRef,
    private dialog: MdDialog,
    private userTagService: UserTagService
  ) {
    this.onTagAdd = new EventEmitter<Tag>();
    this.onTagEdit = new EventEmitter<TagEditAction>();
    this.onTagDelete = new EventEmitter<Tag>();
  }

  public ngOnInit(): void {
    this.userTagService.getShowSystemTags()
      .subscribe(show => {
        this.showSystemTags = show;
        this.updateFilterResults();
      });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('tags' in changes) {
      this.updateResults();
    }
  }

  public addTag(category?: TagCategory): void {
    const forbiddenKeys = category ? category.tags.map(_ => _.key) : [];
    this.dialog.open(TagEditComponent, {
      width: '375px',
      data: {
        forbiddenKeys: forbiddenKeys,
        title: 'TAGS.CREATE_NEW_TAG',
        confirmButtonText: 'COMMON.CREATE',
        categoryName: category && category.name
      }
    })
      .afterClosed()
      .subscribe(tag => this.onTagAdd.emit(tag));
  }

  public editTag(tag: Tag): void {
    this.dialog.open(TagEditComponent, {
      width: '375px',
      data: {
        title: 'TAGS.EDIT_TAG',
        confirmButtonText: 'COMMON.EDIT',
        categoryName: tag.categoryName,
        tag
      }
    })
      .afterClosed()
      .subscribe(tagEditAction => this.onTagEdit.emit(tagEditAction));
  }

  public onShowSystemTagsChange(): void {
    this.updateFilterResults();
    this.userTagService
      .setShowSystemTags(this.showSystemTags)
      .subscribe();
  }

  public removeTag(tag: Tag): void {
    this.onTagDelete.emit(tag);
  }

  public updateResults(): void {
    this.categories = this.getCategories();
    this.updateFilterResults();
  }

  public updateFilterResults(): void {
    this.visibleCategories = this.getFilterResults();
    this.cd.detectChanges();
  }

  private getFilterResults(): Array<TagCategory> {
    let categories = cloneDeep(this.categories);

    categories = categories.filter(category => {
      return this.filterTags(category.tags).length;
    });

    categories.sort(this.compareCategories);

    return categories;
  }

  private filterTags(tags: Array<Tag>): Array<Tag> {
    return filterWithPredicates(
      tags,
      [
        this.filterTagsBySearch(),
        this.filterTagsBySystem()
      ]
    );
  }

  private filterTagsBySearch(): (tag) => boolean {
    return (tag) => {
      const keyMatch = Utils.matchLower(tag.key, this.query || '');
      const valueMatch = Utils.matchLower(tag.value, this.query || '');

      return keyMatch || valueMatch;
    };
  }

  private filterTagsBySystem(): (tag: Tag) => boolean {
    return (tag) => {
      return this.showSystemTags || !tag.key.startsWith('csui');
    };
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

    if (a.name.startsWith('csui')) {
      return -1;
    }

    if (b.name.startsWith('csui')) {
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
