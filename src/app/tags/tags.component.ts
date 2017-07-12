import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DialogService } from '../dialog/dialog-module/dialog.service';
import { Taggable } from '../shared/interfaces/taggable.interface';
import { defaultCategoryName, Tag } from '../shared/models';
import { UtilsService } from '../shared/services';
import { TagCategory } from './tag-category/tag-category.component';
import { TagEditComponent } from './tag-edit/tag-edit.component';
import cloneDeep = require('lodash/cloneDeep');
import groupBy = require('lodash/groupBy');
import sortBy = require('lodash/sortBy');


@Component({
  selector: 'cs-tags',
  templateUrl: 'tags.component.html',
  styleUrls: ['tags.component.scss']
})
export class TagsComponent implements OnChanges {
  @Input() public entity: Taggable;
  @Output() public onTagUpdated: EventEmitter<void>;

  public categories: Array<TagCategory>;
  public query: string;
  public visibleCategories: Array<TagCategory>;

  constructor(
    private cd: ChangeDetectorRef,
    private dialogService: DialogService,
    private utilsService: UtilsService
  ) {
    this.onTagUpdated = new EventEmitter<void>();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('entity' in changes) {
      this.updateResults();
    }
  }

  public addTag(category?: TagCategory): void {
    const forbiddenKeys = category ? category.tags.map(_ => _.key) : [];
    this.dialogService.showCustomDialog({
      component: TagEditComponent,
      classes: 'tag-edit',
      providers: [
        { provide: 'forbiddenKeys', useValue: forbiddenKeys },
        { provide: 'title', useValue: 'CREATE_NEW_TAG' },
        { provide: 'confirmButtonText', useValue: 'CREATE' },
        { provide: 'entity', useValue: this.entity },
        { provide: 'categoryName', useValue: category && category.name }
      ]
    })
      .switchMap(res => res.onHide())
      .subscribe(() => this.onTagUpdated.emit());
  }

  public editTag(tag: Tag): void {
    this.dialogService.showCustomDialog({
      component: TagEditComponent,
      classes: 'tag-edit',
      providers: [
        { provide: 'title', useValue: 'EDIT_TAG' },
        { provide: 'confirmButtonText', useValue: 'EDIT' },
        { provide: 'categoryName', useValue: tag.categoryName },
        { provide: 'tag', useValue: tag }
      ]
    })
      .switchMap(res => res.onHide())
      .subscribe(() => this.onTagUpdated.emit());
  }

  public removeTag(): void {
    this.onTagUpdated.emit();
  }

  public updateResults(): void {
    this.categories = this.getCategories();
    this.updateSearchResults();
  }

  public updateSearchResults(): void {
    this.visibleCategories = this.getSearchResults();
    this.cd.detectChanges();
  }

  private getSearchResults(): Array<TagCategory> {
    let categories = cloneDeep(this.categories);

    if (!this.query) {
      return categories;
    }

    categories = categories.map(category => {
      category.tags = this.filterTags(category.tags);
      return category.tags.length ? category : false;
    })
      .filter(_ => _);

    categories.sort(this.compareCategories);

    return categories;
  }

  private filterTags(tags: Array<Tag>): Array<Tag> {
    return tags.filter(tag => {
      const keyMatch = this.utilsService.matchLower(tag.key, this.query);
      const valueMatch = this.utilsService.matchLower(tag.value, this.query);

      return keyMatch || valueMatch;
    });
  }

  private getCategories(): Array<TagCategory> {
    const groupedTags = groupBy(this.entity.tags, 'categoryName');

    const categories = Object.keys(groupedTags)
      .map(categoryName => this.getCategory(groupedTags, categoryName))
      .filter(_ => _.tags.length);

    categories.sort(this.compareCategories);

    return categories;
  }

  private compareCategories(a: TagCategory, b: TagCategory): number {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    if (a.name === defaultCategoryName) { return -1; }
    if (b.name === defaultCategoryName) { return  1; }

    if (aName < bName) { return -1; }
    if (aName > bName) { return  1; }

    return 0;
  }

  private getCategory(groupedTags: any, name: string): TagCategory {
    const tags = groupedTags[name].filter(_ => _.keyWithoutCategory);
    const sortedTags = sortBy(tags, [_ => _.key.toLowerCase()]);

    return {
      name,
      tags: sortedTags
    }
  }
}
