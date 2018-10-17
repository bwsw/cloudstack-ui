import { Component, Inject, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { defaultCategoryName, Tag } from '../../shared/models';

@Component({
  selector: 'cs-tag-edit',
  templateUrl: 'tag-edit.component.html',
  styleUrls: ['tag-edit.component.scss'],
})
export class TagEditComponent {
  @ViewChild('keyField')
  public keyField: NgModel;

  public loading: boolean;
  public key: string;
  public value: string;
  public maxKeyLength = 255;
  public maxValueLength = 255;

  public forbiddenKeys: string[];
  public title: string;
  public confirmButtonText: string;
  private tag: Tag;
  private categoryName: string;

  constructor(private dialogRef: MatDialogRef<TagEditComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.forbiddenKeys = data.forbiddenKeys;
    this.title = data.title;
    this.confirmButtonText = data.confirmButtonText;
    this.tag = data.tag;
    this.categoryName = data.categoryName;

    if (this.tag) {
      this.key = this.tag.key;
      this.value = this.tag.value;
    } else if (this.categoryName && this.categoryName !== defaultCategoryName) {
      this.key = `${this.categoryName}.`;
    }
  }

  public get keyFieldErrorMessage(): string {
    if (this.keyField.errors && this.keyField.errors.forbiddenValuesValidator) {
      return 'TAGS.TAG_ALREADY_EXISTS';
    }
    if (this.keyField.errors && this.keyField.errors.pattern) {
      return 'TAGS.TAG_START_FROM_SPACE';
    }

    return '';
  }

  public onTagUpdate(): void {
    const newTag = {
      key: this.key,
      value: this.value,
    };

    if (this.tag) {
      this.dialogRef.close({ newTag, oldTag: this.tag });
    } else {
      this.dialogRef.close(newTag);
    }
  }
}
