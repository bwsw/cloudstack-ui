import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { MdlModule } from 'angular2-mdl';

import { SecurityGroupService } from './security-group.service';
import { SecurityGroupCreationComponent } from './security-group-creation.component';
import { SecurityGroupRulesManagerComponent } from './security-group-rules-manager.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MdlModule
  ],
  exports: [
    SecurityGroupCreationComponent,
    SecurityGroupRulesManagerComponent
  ],
  declarations: [
    SecurityGroupCreationComponent,
    SecurityGroupRulesManagerComponent
  ],
  providers: [ SecurityGroupService ],
  entryComponents: [ SecurityGroupCreationComponent ]
})
export class SecurityGroupModule { }
