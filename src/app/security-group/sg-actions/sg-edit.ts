import { Injectable } from '@angular/core';
import { SecurityGroupAction } from './sg-action';
import { SecurityGroup, SecurityGroupType } from '../sg.model';
import { Observable } from 'rxjs/Observable';
import { SgRulesComponent } from '../sg-rules/sg-rules.component';
import { MatDialogConfig } from '@angular/material';


@Injectable()
export class SecurityGroupEditAction extends SecurityGroupAction {
  public name = 'COMMON.EDIT';
  public icon = 'edit';

  public activate(securityGroup: SecurityGroup, params?: {}): Observable<any> {
    return this.dialog.open(SgRulesComponent, <MatDialogConfig>{
      width: '880px',
      data: { securityGroup }
    })
      .afterClosed()
      .map(updatedGroup => {
        return this.securityGroupService.onSecurityGroupUpdate.next(updatedGroup);
      });
  }

  public hidden(securityGroup: SecurityGroup): boolean {
    return securityGroup.type === SecurityGroupType.PredefinedTemplate;
  }
}
