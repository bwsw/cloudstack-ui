import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { MdlModule } from 'angular2-mdl';

import { SecurityGroupService } from './security-group.service';
import { SecurityGroupCreationComponent } from './security-group-creation.component';
import { SecurityGroupRulesManagerComponent } from './security-group-rules-manager.component';
import { SecurityGroupTemplateListComponent } from './security-group-template-list.component';
import { SecurityGroupTemplateListItemComponent } from './security-group-template-list-item.component';
import { SecurityGroupTemplateCreationComponent } from './security-group-template-creation.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MdlModule
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
    SecurityGroupTemplateCreationComponent
  ],
  providers: [ SecurityGroupService ],
  entryComponents: [
    SecurityGroupCreationComponent,
    SecurityGroupTemplateCreationComponent
  ]
})
export class SecurityGroupModule { }
