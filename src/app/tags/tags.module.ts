import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClipboardModule } from 'ngx-clipboard';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';

import { TagCategoryComponent } from './tag-category/tag-category.component';
import { TagEditComponent } from './tag-edit/tag-edit.component';
import { TagComponent } from './tag/tag.component';
import { TagsViewComponent } from './tags-view/tags-view.component';

@NgModule({
  imports: [CommonModule, SharedModule, MaterialModule, ClipboardModule],
  declarations: [TagComponent, TagsViewComponent, TagEditComponent, TagCategoryComponent],
  entryComponents: [TagEditComponent],
  exports: [TagsViewComponent],
})
export class TagsModule {}
