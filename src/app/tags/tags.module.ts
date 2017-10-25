import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatTooltipModule,
  MatCheckboxModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardModule } from 'ngx-clipboard/dist';
import { SharedModule } from '../shared/shared.module';
import { TagCategoryComponent } from './tag-category/tag-category.component';
import { TagEditComponent } from './tag-edit/tag-edit.component';
import { TagComponent } from './tag/tag.component';
import { TagsViewComponent } from './tags-view/tags-view.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    MatDialogModule,
    SharedModule,
    ClipboardModule,
    MatCheckboxModule
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
