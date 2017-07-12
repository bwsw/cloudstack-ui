import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MdlDialogReference } from '../../dialog/dialog-module';
import { Taggable } from '../../shared/interfaces/taggable.interface';
import { TagService } from '../../shared/services';
import { TagCategory } from '../tag-category/tag-category.component';
import { defaultCategoryName, Tag } from '../../shared/models';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-module/dialog.service';


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
    @Optional() @Inject('entity') private entity: Taggable,
    @Optional() @Inject('categoryName') private categoryName: string,
    private dialog: MdlDialogReference,
    private dialogService: DialogService,
    private tagService: TagService
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
      return 'TAG_ALREADY_EXISTS';
    }

    return '';
  }

  public onUpdate(): void {
    this.loading = true;

    const resourceIds = this.tag && this.tag.resourceId || this.entity && this.entity.id;
    const resourceType = this.tag && this.tag.resourceType || this.entity && this.entity.resourceType;

    Observable.of(null)
      .switchMap(() => {
        if (!this.tag) {
          return Observable.of(null);
        }

        return this.tagService.remove({
          resourceIds,
          resourceType,
          'tags[0].key': this.tag.key,
          'tags[0].value': this.tag.value
        });
      })
      .switchMap(() => {
        return this.tagService.create({
          resourceIds,
          resourceType,
          'tags[0].key': this.key,
          'tags[0].value': this.value
        });
      })
      .finally(() => this.loading = false)
      .subscribe(
        () => this.dialog.hide(),
        error => this.onError(error)
      );
  }

  public onCancel(): void {
    this.dialog.hide();
  }

  private onError(error: any): void {
    this.dialogService.alert({
      translationToken: error.message,
      interpolateParams: error.params
    });
  }
}
