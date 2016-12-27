import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate';
import { MdlModule } from 'angular2-mdl';

import { SecurityGroupService } from './security-group.service';
import { SecurityGroupCreationComponent } from './security-group-creation.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MdlModule
  ],
  exports: [
    SecurityGroupCreationComponent
  ],
  declarations: [ SecurityGroupCreationComponent ],
  providers: [ SecurityGroupService ]
})
export class SecurityGroupModule { }
