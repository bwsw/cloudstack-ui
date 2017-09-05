import { MdlModule } from '@angular-mdl/core';
import { MdlSelectModule } from '@angular-mdl/select';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MdSelectModule, MdTooltipModule, MdMenuModule, MdButtonModule, MdIconModule,
  MdTabsModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { SgRuleComponent } from './sg-rules/sg-rule.component';
import { SgRulesComponent } from './sg-rules/sg-rules.component';
import { SgTemplateCreationComponent } from './sg-template-creation/sg-template-creation.component';
import { SgTemplateListItemComponent } from './sg-template-list/sg-template-list-item.component';
import { SgTemplateListComponent } from './sg-template-list/sg-template-list.component';
import { SgTemplateCreationDialogComponent } from './sg-template-creation/sg-template-creation-dialog.component';
import { sgRouting } from './sg.routing';
import { SgFilterComponent } from './sg-filter/sg-filter.component';
import { SecurityGroupActionsComponent } from './sg-actions/sg-actions-component/sg-actions.component';
import { SecurityGroupActionsService } from './sg-actions/sg-action.service';
import { SecurityGroupViewAction } from './sg-actions/sg-view';
import { SecurityGroupEditAction } from './sg-actions/sg-edit';
import { SecurityGroupRemoveAction } from './sg-actions/sg-remove';
import {
  PrivateSecurityGroupCreationService
} from './services/creation-services/private-security-group-creation.service';
import {
  SharedSecurityGroupCreationService
} from './services/creation-services/shared-security-group-creation.service';
import {
  TemplateSecurityGroupCreationService
} from './services/creation-services/template-security-group-creation.service';
import { NetworkRuleService } from './services/network-rule.service';
import { SecurityGroupService } from './services/security-group.service';
// tslint:disable-next-line
import { SecurityGroupCreationSecurityGroupComponent } from './sg-template-creation/security-group-creation-security-group/security-group-creation-security-group.component';
// tslint:disable-next-line
import { SecurityGroupCreationRulesManagerComponent } from './sg-template-creation/security-group-rules-manager/security-group-creation-rules-manager.component';


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
    MdTabsModule,
    sgRouting
  ],
  exports: [
    SgTemplateListComponent
  ],
  declarations: [
    SecurityGroupActionsComponent,
    SgFilterComponent,
    SgTemplateListComponent,
    SgTemplateListItemComponent,
    SgTemplateCreationComponent,
    SgTemplateCreationDialogComponent,
    SgRulesComponent,
    SgRuleComponent,
    SecurityGroupCreationSecurityGroupComponent,
    SecurityGroupCreationRulesManagerComponent
  ],
  providers: [
    NetworkRuleService,
    SecurityGroupService,
    SecurityGroupActionsService,
    SecurityGroupViewAction,
    SecurityGroupEditAction,
    SecurityGroupRemoveAction,
    PrivateSecurityGroupCreationService,
    SharedSecurityGroupCreationService,
    TemplateSecurityGroupCreationService
  ],
  entryComponents: [
    SgTemplateCreationComponent,
    SgRulesComponent,
    SecurityGroupCreationSecurityGroupComponent
  ]
})
export class SecurityGroupModule { }
