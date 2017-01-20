import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { MdlModule } from 'angular2-mdl';

import { SgCreationComponent } from './sg-creation/sg-creation.component';
import { SgTemplateListComponent } from './sg-template-list/sg-template-list.component';
import { SgTemplateListItemComponent } from './sg-template-list/sg-template-list-item.component';
import { SgTemplateCreationComponent } from './sg-template-creation/sg-template-creation.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MdlModule
  ],
  exports: [
    SgCreationComponent,
    SgTemplateListComponent
  ],
  declarations: [
    SgCreationComponent,
    SgTemplateListComponent,
    SgTemplateListItemComponent,
    SgTemplateCreationComponent
  ],
  entryComponents: [
    SgCreationComponent,
    SgTemplateCreationComponent
  ]
})
export class SecurityGroupModule { }
