import { MdlModule } from '@angular-mdl/core';
import { MdlSelectModule } from '@angular-mdl/select';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardModule } from 'ngx-clipboard/dist';
import { SharedModule } from '../shared/shared.module';
import { TagsComponent } from './tags.component';
import { TagComponent } from './tag/tag.component';
import { TagCategoryComponent } from './tag-category/tag-category.component';
import { TagCategoryCreationComponent } from './tag-category-creation-dialog/tag-category-creation.component';
import { TagCreationDialogComponent } from './tag-creation-dialog/tag-creation-dialog.component';
import { TagEditComponent } from './tag-edit/tag-edit.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MdlModule,
    MdlSelectModule,
    SharedModule,
    ClipboardModule
  ],
  exports: [
    TagsComponent
  ],
  declarations: [
    TagComponent,
    TagsComponent,
    TagEditComponent,
    TagCategoryComponent,
    TagCreationDialogComponent,
    TagCategoryCreationComponent
  ],
  entryComponents: [
    TagEditComponent,
    TagCreationDialogComponent,
    TagCategoryCreationComponent
  ]
})
export class TagsModule { }
