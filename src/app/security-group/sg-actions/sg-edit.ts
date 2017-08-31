import { Injectable } from '@angular/core';
import { SecurityGroupAction } from './sg-action';
import { SecurityGroup, SecurityGroupType } from '../sg.model';
import { Observable } from 'rxjs/Observable';
import { SgRulesComponent } from '../sg-rules/sg-rules.component';
import { MdDialogConfig } from '@angular/material';


@Injectable()
export class SecurityGroupEditAction extends SecurityGroupAction {
  public name = 'COMMON.EDIT';
  public icon = 'edit';

  public activate(securityGroup: SecurityGroup, params?: {}): Observable<any> {
    return this.dialog.open(SgRulesComponent, <MdDialogConfig>{
      width: '880px',
      data: { securityGroup }
    })
      .afterClosed();
  }

  public hidden(securityGroup: SecurityGroup): boolean {
    return securityGroup.type === SecurityGroupType.PredefinedTemplate;
  }
}
