import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { MdlModule } from 'angular2-mdl';
import { MdlSelectModule } from '@angular2-mdl-ext/select';

import { SecurityGroupService } from './security-group.service';
import { SecurityGroupCreationComponent } from './security-group-creation.component';
import { SecurityGroupRulesManagerComponent } from './security-group-rules-manager.component';
import { SecurityGroupTemplateListComponent } from './security-group-template-list.component';
import { SecurityGroupTemplateListItemComponent } from './security-group-template-list-item.component';
import { SecurityGroupRulesComponent } from './security-group-rules.component';
import { SecurityGroupRuleComponent } from './security-group-rule.component';
import { MaxValueValidatorDirective } from '../shared/directives/max-value.directive';
import { MinValueValidatorDirective } from '../shared/directives/min-value.directive';
import { SecurityGroupTemplateCreationComponent } from './security-group-template-creation.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MdlModule,
    MdlSelectModule
  ],
  exports: [
    SecurityGroupCreationComponent,
    SecurityGroupRulesManagerComponent,
    SecurityGroupTemplateListComponent
  ],
  declarations: [
    SecurityGroupCreationComponent,
    SecurityGroupRulesManagerComponent,
    SecurityGroupTemplateListComponent,
    SecurityGroupTemplateListItemComponent,
    SecurityGroupTemplateCreationComponent,
    SecurityGroupRulesComponent,
    SecurityGroupRuleComponent,
    MaxValueValidatorDirective,
    MinValueValidatorDirective
  ],
  providers: [ SecurityGroupService ],
  entryComponents: [
    SecurityGroupCreationComponent,
    SecurityGroupTemplateCreationComponent,
    SecurityGroupRulesComponent
  ]
})
export class SecurityGroupModule { }
