import { MdlModule } from '@angular-mdl/core';
import { MdlSelectModule } from '@angular-mdl/select';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MdButtonModule,
  MdIconModule,
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
import { SgTemplateCreationComponent } from './sg-template-creation/sg-template-creation.component';
import { SgTemplateListItemComponent } from './sg-template-list/sg-template-list-item.component';
import { SgTemplateListComponent } from './sg-template-list/sg-template-list.component';
import { SecurityGroupsRouting } from './sg.routing';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MdSelectModule,
    MdTooltipModule,
    MdlModule,
    MdlSelectModule,
    SharedModule,
    MdMenuModule,
    MdButtonModule,
    MdIconModule,
    SecurityGroupsRouting
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
