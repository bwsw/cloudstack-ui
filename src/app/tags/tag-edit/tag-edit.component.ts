import { Component, Inject, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MdlDialogReference } from '../../dialog/dialog-module';
import { Taggable } from '../../shared/interfaces/taggable.interface';
import { TagService } from '../../shared/services';
import { TagCategory } from '../tag-category/tag-category.component';


@Component({
  selector: 'cs-tag-edit',
  templateUrl: 'tag-edit.component.html',
  styleUrls: ['tag-edit.component.scss']
})
export class TagEditComponent {
  @ViewChild('keyField') public keyField: NgModel;

  public loading: boolean;

  public key: string;
  public value: string;

  public maxCategoryLength = 250;
  public maxValueLength = 255;

  constructor(
    @Inject('category') public category: TagCategory,
    @Inject('categories') public categories: Array<TagCategory>,
    @Inject('entity') private entity: Taggable,
    private dialog: MdlDialogReference,
    private tagService: TagService
  ) {}

  public get keyFieldErrorMessage(): string {
    if (this.keyField.errors && this.keyField.errors.forbiddenValuesValidator) {
      return 'TAG_ALREADY_EXISTS';
    }

    return '';
  }

  public get categoryNames(): Array<string> {
    return this.categories.map(_ => _.name);
  }

  public get tagKeys(): Array<string> {
    return this.category.tags.map(_ => _.keyWithoutCategory);
  }

  public get maxKeyLength(): number {
    const keyFieldLength = 255;
    const dot = 1;

    return keyFieldLength - dot - this.category.name.length;
  }

  public onUpdate(): void {
    // this.loading = true;
    //
    // this.tagService.create({
    //   resourceIds: this.entity.id,
    //   resourceType: ResourceTypes.VM,
    //   'tags[0].key': `${this.category.name}.${this.key}`,
    //   'tags[0].value': this.value
    // })
    //   .finally(() => this.dialog.hide())
    //   .subscribe();
  }

  public onCancel(): void {
    this.dialog.hide();
  }
}
