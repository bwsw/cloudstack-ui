import { Injectable } from '@angular/core';
import { SecurityGroupAction } from './sg-action';
import { SecurityGroup, SecurityGroupType } from '../sg.model';
import { Observable } from 'rxjs/Observable';
import { SgRulesComponent } from '../sg-rules/sg-rules.component';
import { MdDialogConfig } from '@angular/material';


@Injectable()
export class SecurityGroupViewAction extends SecurityGroupAction {
  public name = 'COMMON.VIEW';
  public icon = 'visibility';

  public activate(securityGroup: SecurityGroup, params?: {}): Observable<any> {
    return this.dialog.open(SgRulesComponent, <MdDialogConfig>{
      width: '880px',
      data: { securityGroup }
    })
      .afterClosed()
      .map(updatedGroup => {
        return this.securityGroupService.onSecurityGroupUpdate.next(updatedGroup);
      });
  }

  public hidden(securityGroup: SecurityGroup): boolean {
    return securityGroup.type !== SecurityGroupType.PredefinedTemplate;
  }
}
