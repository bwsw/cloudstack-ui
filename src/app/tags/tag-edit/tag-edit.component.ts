import { Component, Inject, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MdlDialogReference } from '../../dialog/dialog-module';
import { Taggable } from '../../shared/interfaces/taggable.interface';
import { TagService } from '../../shared/services';
import { TagCategory } from '../tag-category/tag-category.component';
import { defaultCategoryName, Tag } from '../../shared/models';


@Component({
  selector: 'cs-tag-edit',
  templateUrl: 'tag-edit.component.html',
  styleUrls: ['tag-edit.component.scss']
})
export class TagEditComponent {
  @ViewChild('keyField') public keyField: NgModel;

  public loading: boolean;

  public categoryName: string;
  public key: string;
  public value: string;

  public maxCategoryLength = 250;
  public maxValueLength = 255;

  constructor(
    @Inject('category') public category: TagCategory,
    @Inject('categories') public categories: Array<TagCategory>,
    @Inject('tag') private tag: Tag,
    private dialog: MdlDialogReference,
    private tagService: TagService
  ) {
    this.categoryName = category.name;
    this.key = tag.keyWithoutCategory;
    this.value = tag.value;
  }

  public get categoryNames(): Array<string> {
    return this.categories.map(_ => _.name);
  }

  public get maxKeyLength(): number {
    const keyFieldLength = 255;
    const dot = 1;

    return keyFieldLength - dot - this.category.name.length;
  }

  public get keyString(): string {
    if (this.categoryName === defaultCategoryName) {
      return this.key;
    }

    return `${this.categoryName}.${this.key}`;
  }

  public onUpdate(): void {
    this.loading = true;

    this.tagService.remove({
      resourceIds: this.tag.resourceId,
      resourceType: this.tag.resourceType,
      'tags[0].key': this.tag.key,
    })
      .switchMap(() => {
        return this.tagService.create({
          resourceIds: this.tag.resourceId,
          resourceType: this.tag.resourceType,
          'tags[0].key': this.keyString,
          'tags[0].value': this.value
        })
      })
      .finally(() => this.dialog.hide())
      .subscribe();
  }

  public onCancel(): void {
    this.dialog.hide();
  }
}
