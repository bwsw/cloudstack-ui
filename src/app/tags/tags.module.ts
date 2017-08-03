import { MdlModule } from '@angular-mdl/core';
import { MdlSelectModule } from '@angular-mdl/select';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardModule } from 'ngx-clipboard/dist';
import { SharedModule } from '../shared/shared.module';
import { TagCategoryComponent } from './tag-category/tag-category.component';
import { TagEditComponent } from './tag-edit/tag-edit.component';
import { TagComponent } from './tag/tag.component';
import { TagsViewComponent } from './tags-view/tags-view.component';
import { MdTooltipModule } from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MdTooltipModule,
    MdlModule,
    MdlSelectModule,
    SharedModule,
    ClipboardModule
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
