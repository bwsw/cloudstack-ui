import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DialogService } from '../dialog/dialog-module/dialog.service';
import { Taggable } from '../shared/interfaces/taggable.interface';
import { defaultCategoryName, Tag } from '../shared/models';
import { UtilsService } from '../shared/services';
import { TagCategoryCreationComponent } from './tag-category-creation-dialog/tag-category-creation.component';
import { TagCategory } from './tag-category/tag-category.component';
import { TagCreationDialogComponent } from './tag-creation-dialog/tag-creation-dialog.component';
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

  public addTag(category: TagCategory): void {
    this.dialogService.showCustomDialog({
      component: TagCreationDialogComponent,
      classes: 'vm-tag-creation-dialog',
      providers: [
        { provide: 'category', useValue: this.getCategoryByName(category.name) },
        { provide: 'entity', useValue: this.entity }
      ]
    })
      .switchMap(res => res.onHide())
      .subscribe(() => this.onTagUpdated.emit());
  }

  public addCategory(): void {
    this.dialogService.showCustomDialog({
      component: TagCategoryCreationComponent,
      classes: 'tag-category-creation-dialog',
      providers: [
        { provide: 'categories', useValue: this.categories },
        { provide: 'entity', useValue: this.entity }
      ]
    })
      .switchMap(res => res.onHide())
      .subscribe(vm => this.onTagUpdated.emit());
  }

  public updateResults(): void {
    this.categories = this.getCategories();
    this.updateSearchResults();
  }

  public updateSearchResults(): void {
    this.visibleCategories = this.getSearchResults();
    this.cd.detectChanges();
  }

  private getCategoryByName(name: string): TagCategory {
    return this.categories.find(_ => _.name === name);
  }

  private getSearchResults(): Array<TagCategory> {
    const categories = cloneDeep(this.categories);

    if (!this.query) {
      return categories;
    }

    const categoryResults = groupBy(
      categories,
      _ => this.utilsService.matchLower(_.name, this.query)
    );

    const matchingCategories = categoryResults['true'] || [];
    const rest = (categoryResults['false'] || [])
      .map(category => {
        category.tags = this.filterTags(category.tags);
        return category.tags.length ? category : false;
      })
      .filter(_ => _);

    const result = matchingCategories.concat(rest);
    result.sort(this.compareCategories);

    return result;
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
      .map(categoryName => this.getCategory(groupedTags, categoryName));

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
