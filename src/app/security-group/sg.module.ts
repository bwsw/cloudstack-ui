import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatSelectModule,
  MatTabsModule,
  MatTooltipModule,
  MatButtonToggleModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
// tslint:disable-next-line
import { PrivateSecurityGroupCreationService } from './services/creation-services/private-security-group-creation.service';
// tslint:disable-next-line
import { SharedSecurityGroupCreationService } from './services/creation-services/shared-security-group-creation.service';
// tslint:disable-next-line
import { TemplateSecurityGroupCreationService } from './services/creation-services/template-security-group-creation.service';
import { NetworkRuleService } from './services/network-rule.service';
import { SecurityGroupService } from './services/security-group.service';
import { SecurityGroupActionsService } from './sg-actions/sg-action.service';
import { SecurityGroupActionsComponent } from './sg-actions/sg-actions-component/sg-actions.component';
import { SecurityGroupEditAction } from './sg-actions/sg-edit';
import { SecurityGroupRemoveAction } from './sg-actions/sg-remove';
import { SecurityGroupViewAction } from './sg-actions/sg-view';
import { SgFilterComponent } from './sg-filter/sg-filter.component';
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
import { SecurityGroupRulesDialogComponent } from './sg-rules/sg-rules-dialog.component';
import { SecurityGroupRowItemComponent } from './sg-list-item/row-item/security-group-row-item.component';
import { DynamicModule } from 'ng-dynamic-component';
import { SecurityGroupListComponent } from './sg-list/security-group-list.component';
import { StoreModule } from '@ngrx/store';
import { securityGroupReducers } from '../reducers/security-groups/redux/sg.reducers';
import { SecurityGroupPageContainerComponent } from './sg-page/containers/security-group-page.container';
import { EffectsModule } from '@ngrx/effects';
import { SecurityGroupEffects } from '../reducers/security-groups/redux/sg.effects';
import { SgFilterContainerComponent } from './sg-filter/containers/sg-filter.container';
import { SecurityGroupRulesDialogContainerComponent } from './sg-rules/containers/sg-rules-dialog.container';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DynamicModule.withComponents([
      SecurityGroupCardItemComponent,
      SecurityGroupRowItemComponent,
      SgRuleComponent
    ]),
    RouterModule,
    TranslateModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    SharedModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    StoreModule.forFeature('securityGroups', securityGroupReducers),
    EffectsModule.forFeature([SecurityGroupEffects]),
  ],
  exports: [
    SecurityGroupPageContainerComponent,
    SecurityGroupPageComponent
  ],
  declarations: [
    SecurityGroupActionsComponent,
    SgFilterContainerComponent,
    SgFilterComponent,
    SecurityGroupListComponent,
    SecurityGroupPageContainerComponent,
    SecurityGroupPageComponent,
    SecurityGroupCardItemComponent,
    SecurityGroupRowItemComponent,
    SecurityGroupCreationComponent,
    SecurityGroupCreationDialogComponent,
    SecurityGroupRulesDialogContainerComponent,
    SecurityGroupRulesDialogComponent,
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
    SecurityGroupCreationComponent,
    SgRulesComponent,
    SecurityGroupCreationSecurityGroupComponent
  ]
})
export class SecurityGroupModule {
}
