import { Component, Inject, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MdlDialogReference } from '../../dialog/dialog-module';
import { Taggable } from '../../shared/interfaces/taggable.interface';
import { ResourceTypes } from '../../shared/models';
import { TagService } from '../../shared/services';
import { TagCategory } from '../tag-category/tag-category.component';


const categoryTagValue = 'CS_CATEGORY';

@Component({
  selector: 'cs-tag-category-creation',
  templateUrl: 'tag-category-creation.component.html',
  styleUrls: ['tag-category-creation.component.scss']
})
export class TagCategoryCreationComponent {
  @ViewChild('categoryField') public categoryField: NgModel;

  public loading: boolean;

  public categoryName: string;

  public maxLength = 250;

  constructor(
    @Inject('categories') private categories: Array<TagCategory>,
    @Inject('entity') private entity: Taggable,
    private dialog: MdlDialogReference,
    private tagService: TagService
  ) {}

  public get categoryNames(): Array<string> {
    return this.categories.map(_ => _.name);
  }

  public get categoryNameErrorMessage(): string {
    if (this.categoryField.errors && this.categoryField.errors.forbiddenValuesValidator) {
      return 'TAG_CATEGORY_ALREADY_EXISTS';
    }

    return '';
  }

  public onCreate(): void {
    const categoryTagName = this.categoryName + '.';
    this.loading = true;

    this.tagService.create({
      resourceIds: this.entity.id,
      resourceType: this.entity.resourceType,
      'tags[0].key': categoryTagName,
      'tags[0].value': categoryTagValue
    })
      .subscribe(
        () => this.dialog.hide(this.categoryName),
        () => this.dialog.hide()
      );
  }

  public onCancel(): void {
    this.dialog.hide();
  }
}
