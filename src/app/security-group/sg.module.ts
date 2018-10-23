import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DynamicModule } from 'ng-dynamic-component';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { TagsModule } from '../tags/tags.module';
import { DraggableSelectModule } from '../shared/components/draggable-select/draggable-select.module';
// tslint:disable-next-line
import { PrivateSecurityGroupCreationService } from './services/creation-services/private-security-group-creation.service';
// tslint:disable-next-line
import { SharedSecurityGroupCreationService } from './services/creation-services/shared-security-group-creation.service';
// tslint:disable-next-line
import { TemplateSecurityGroupCreationService } from './services/creation-services/template-security-group-creation.service';
import { NetworkRuleService } from './services/network-rule.service';
import { SecurityGroupService } from './services/security-group.service';
import { SecurityGroupActionService } from './sg-actions/sg-action.service';
import { SecurityGroupActionsComponent } from './sg-actions/sg-actions-component/sg-actions.component';
import { SgFilterComponent } from './sg-filter/sg-filter.component';
import { SecurityGroupGroupedListComponent } from './sg-list/security-group-grouped-list.component';
import { SgRuleComponent } from './sg-rules/sg-rule.component';
import { SgRulesComponent } from './sg-rules/sg-rules.component';
// tslint:disable-next-line
import { SecurityGroupCreationSecurityGroupComponent } from './sg-creation/security-group-creation-security-group/security-group-creation-security-group.component';
// tslint:disable-next-line
import { SecurityGroupCreationRulesManagerComponent } from './sg-creation/security-group-rules-manager/security-group-creation-rules-manager.component';
import { SecurityGroupCreationDialogComponent } from './sg-creation/security-group-creation-dialog.component';
import { SecurityGroupCreationComponent } from './sg-creation/security-group-creation.component';
import { SecurityGroupCardItemComponent } from './sg-list-item/card-item/security-group-card-item.component';
import { SecurityGroupPageComponent } from './sg-page/security-group-page.component';
import { SecurityGroupRowItemComponent } from './sg-list-item/row-item/security-group-row-item.component';
import { SecurityGroupListComponent } from './sg-list/security-group-list.component';
import { securityGroupReducers } from '../reducers/security-groups/redux/sg.reducers';
import { SecurityGroupPageContainerComponent } from './containers/security-group-page.container';
import { SecurityGroupEffects } from '../reducers/security-groups/redux/sg.effects';
import { SgFilterContainerComponent } from './sg-filter/containers/sg-filter.container';
import { SgRulesContainerComponent } from './containers/sg-rules.container';
import { SecurityGroupActionsContainerComponent } from './containers/sg-actions.container';
import { SecurityGroupSidebarContainerComponent } from './containers/security-group-sidebar.container';
import { SecurityGroupDetailsContainerComponent } from './containers/security-group-details.container';
import { SecurityGroupSidebarComponent } from './sg-sidebar/security-group-sidebar.component';
import { SecurityGroupDetailsComponent } from './sg-sidebar/sg-details/security-group-details.component';
import { SecurityGroupVmListComponent } from './sg-sidebar/sg-vm-list/security-group-vm-list.component';
import { virtualMachineReducers } from '../reducers/vm/redux/vm.reducers';
import { VirtualMachinesEffects } from '../reducers/vm/redux/vm.effects';
import { SecurityGroupCreationContainerComponent } from './containers/security-group-creation.container';
import { SecurityGroupRulesDialogComponent } from './sg-rules/sg-rules-dialog.component';
import { accountReducers } from '../reducers/accounts/redux/accounts.reducers';
import { AccountsEffects } from '../reducers/accounts/redux/accounts.effects';
import { SecurityGroupTagsComponent } from './sg-sidebar/sg-tags/sg-tags.component';
import { SecurityGroupTagsContainerComponent } from './containers/sg-tags.container';
import { SGRuleAdditionFormComponent } from './components/sg-rule-addition-form/sg-rule-addition-form.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    DynamicModule.withComponents([
      SecurityGroupCardItemComponent,
      SecurityGroupRowItemComponent,
      SgRuleComponent,
    ]),
    RouterModule,
    DraggableSelectModule,
    TagsModule,
    StoreModule.forFeature('securityGroups', securityGroupReducers),
    StoreModule.forFeature('virtualMachines', virtualMachineReducers),
    StoreModule.forFeature('accounts', accountReducers),
    EffectsModule.forFeature([SecurityGroupEffects, VirtualMachinesEffects, AccountsEffects]),
  ],
  exports: [
    SecurityGroupPageContainerComponent,
    SecurityGroupPageComponent,
    SecurityGroupSidebarContainerComponent,
    SecurityGroupDetailsContainerComponent,
  ],
  declarations: [
    SecurityGroupActionsContainerComponent,
    SecurityGroupActionsComponent,
    SgFilterContainerComponent,
    SgFilterComponent,
    SecurityGroupListComponent,
    SecurityGroupPageContainerComponent,
    SecurityGroupPageComponent,
    SecurityGroupCardItemComponent,
    SecurityGroupRowItemComponent,
    SecurityGroupCreationContainerComponent,
    SecurityGroupCreationComponent,
    SecurityGroupCreationDialogComponent,
    SgRulesContainerComponent,
    SgRulesComponent,
    SgRuleComponent,
    SecurityGroupCreationSecurityGroupComponent,
    SecurityGroupCreationRulesManagerComponent,
    SecurityGroupSidebarContainerComponent,
    SecurityGroupDetailsContainerComponent,
    SecurityGroupDetailsComponent,
    SecurityGroupVmListComponent,
    SecurityGroupTagsComponent,
    SecurityGroupTagsContainerComponent,
    SecurityGroupSidebarComponent,
    SecurityGroupRulesDialogComponent,
    SecurityGroupGroupedListComponent,
    SGRuleAdditionFormComponent,
  ],
  providers: [
    NetworkRuleService,
    SecurityGroupService,
    SecurityGroupActionService,
    PrivateSecurityGroupCreationService,
    SharedSecurityGroupCreationService,
    TemplateSecurityGroupCreationService,
  ],
  entryComponents: [
    SecurityGroupCreationContainerComponent,
    SgRulesContainerComponent,
    SecurityGroupCreationSecurityGroupComponent,
  ],
})
export class SecurityGroupModule {}
