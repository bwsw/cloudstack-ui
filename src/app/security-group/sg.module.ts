import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MdlModule } from 'angular2-mdl';
import { MdlPopoverModule } from '@angular2-mdl-ext/popover';
import { MdlSelectModule } from '@angular2-mdl-ext/select';

import { SgCreationComponent } from './sg-creation/sg-creation.component';
import { SgTemplateListComponent } from './sg-template-list/sg-template-list.component';
import { SgTemplateListItemComponent } from './sg-template-list/sg-template-list-item.component';
import { SgTemplateCreationComponent } from './sg-template-creation/sg-template-creation.component';
import { SgRulesComponent } from './sg-rules/sg-rules.component';
import { SgRuleComponent } from './sg-rules/sg-rule.component';
import { SharedModule } from '../shared/shared.module';
import { SgCreationRuleComponent } from './sg-creation/sg-creation-rule.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MdlModule,
    MdlPopoverModule,
    MdlSelectModule,
    SharedModule
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
