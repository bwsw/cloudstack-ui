import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardModule } from 'ngx-clipboard';
import { SharedModule } from '../shared/shared.module';
import { TagCategoryComponent } from './tag-category/tag-category.component';
import { TagEditComponent } from './tag-edit/tag-edit.component';
import { TagComponent } from './tag/tag.component';
import { TagsViewComponent } from './tags-view/tags-view.component';
import { MaterialModule } from '../material/material.module';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    TranslateModule,
    SharedModule,
    ClipboardModule,
  ],
  declarations: [
    TagComponent,
    TagsViewComponent,
    TagEditComponent,
    TagCategoryComponent
  ],
  entryComponents: [
    TagEditComponent
  ],
  exports: [
    TagsViewComponent
  ]
})
export class TagsModule { }
