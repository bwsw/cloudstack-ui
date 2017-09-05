import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MdButtonModule,
  MdCheckboxModule,
  MdDialogModule,
  MdIconModule,
  MdInputModule,
  MdMenuModule,
  MdSelectModule,
  MdTooltipModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../shared/shared.module';
import { SgCreationRuleComponent } from './sg-creation/sg-creation-rule.component';
import { SgCreationComponent } from './sg-creation/sg-creation.component';
import { SgRuleComponent } from './sg-rules/sg-rule.component';
import { SgRulesComponent } from './sg-rules/sg-rules.component';
import { SgTemplateCreationDialogComponent } from './sg-template-creation/sg-template-creation-dialog.component';
import { SgTemplateCreationComponent } from './sg-template-creation/sg-template-creation.component';
import { SgTemplateListItemComponent } from './sg-template-list/sg-template-list-item.component';
import { SgTemplateListComponent } from './sg-template-list/sg-template-list.component';
import { sgRouting } from './sg.routing';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MdCheckboxModule,
    MdSelectModule,
    MdTooltipModule,
    MdDialogModule,
    SharedModule,
    MdMenuModule,
    MdButtonModule,
    MdIconModule,
    MdInputModule,
    sgRouting
  ],
  exports: [
    SgCreationComponent,
    SgTemplateListComponent
  ],
  declarations: [
    SgCreationComponent,
    SgCreationRuleComponent,
    SgTemplateListComponent,
    SgTemplateListItemComponent,
    SgTemplateCreationComponent,
    SgTemplateCreationDialogComponent,
    SgRulesComponent,
    SgRuleComponent,
  ],
  entryComponents: [
    SgCreationComponent,
    SgTemplateCreationComponent,
    SgRulesComponent
  ]
})
export class SecurityGroupModule { }
