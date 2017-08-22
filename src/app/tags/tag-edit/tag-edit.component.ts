import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MdlDialogReference } from '../../dialog/dialog-module';
import { defaultCategoryName, Tag } from '../../shared/models';


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

  public maxKeyLength = 255;
  public maxValueLength = 255;

  constructor(
    @Optional() @Inject('forbiddenKeys') public forbiddenKeys: Array<string>,
    @Optional() @Inject('title') public title: string,
    @Optional() @Inject('confirmButtonText') public confirmButtonText: string,
    @Optional() @Inject('tag') private tag: Tag,
    @Optional() @Inject('categoryName') private categoryName: string,
    private dialog: MdlDialogReference
  ) {
    if (tag) {
      this.key = tag.key;
      this.value = tag.value;
    } else if (categoryName && categoryName !== defaultCategoryName) {
      this.key = `${categoryName}.`;
    }
  }

  public get keyFieldErrorMessage(): string {
    if (this.keyField.errors && this.keyField.errors.forbiddenValuesValidator) {
      return 'TAGS.TAG_ALREADY_EXISTS';
    }

    return '';
  }

  public onTagUpdate(): void {
    const newTag = {
      key: this.key,
      value: this.value
    };

    if (this.tag) {
      this.dialog.hide({ oldTag: this.tag, newTag });
    } else {
      this.dialog.hide(newTag);
    }
  }

  public onCancel(): void {
    this.dialog.hide();
  }
}
