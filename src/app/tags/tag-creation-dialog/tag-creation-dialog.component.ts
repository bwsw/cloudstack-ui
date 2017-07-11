import { Component, Inject, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MdlDialogReference } from '../../dialog/dialog-module';
import { Taggable } from '../../shared/interfaces/taggable.interface';
import { TagService } from '../../shared/services';
import { TagCategory } from '../tag-category/tag-category.component';


@Component({
  selector: 'cs-tag-creation',
  templateUrl: 'tag-creation-dialog.component.html',
  styleUrls: ['tag-creation-dialog.component.scss']
})
export class TagCreationDialogComponent {
  @ViewChild('keyField') public keyField: NgModel;

  public loading: boolean;

  public key: string;
  public value: string;

  public maxValueLength = 255;

  constructor(
    @Inject('category') public category: TagCategory,
    @Inject('entity') private entity: Taggable,
    private dialog: MdlDialogReference,
    private tagService: TagService
  ) {}

  public get tagKeys(): Array<string> {
    return this.category.tags.map(_ => _.keyWithoutCategory);
  }

  public get keyFieldErrorMessage(): string {
    if (this.keyField.errors && this.keyField.errors.forbiddenValuesValidator) {
      return 'TAG_ALREADY_EXISTS';
    }

    return '';
  }

  public get maxKeyLength(): number {
    const keyFieldLength = 255;
    const dot = 1;

    return keyFieldLength - dot - this.category.name.length;
  }

  public onCreate(): void {
    this.loading = true;

    this.tagService.create({
      resourceIds: this.entity.id,
      resourceType: this.entity.resourceType,
      'tags[0].key': `${this.category.name}.${this.key}`,
      'tags[0].value': this.value
    })
      .finally(() => this.dialog.hide())
      .subscribe();
  }

  public onCancel(): void {
    this.dialog.hide();
  }
}
