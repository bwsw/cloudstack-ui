import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MdlDialogService, MdlDialogReference } from 'angular2-mdl';

import { SecurityGroupService } from './security-group.service';
import { SecurityGroup } from './security-group.model';
import { SecurityGroupTemplateCreationComponent } from './security-group-template-creation.component';

@Component({
  selector: 'cs-security-group-template-list',
  templateUrl: './security-group-template-list.component.html',
  styleUrls: ['./security-group-template-list.component.scss']
})
export class SecurityGroupTemplateListComponent implements OnInit {
  private securityGroupList: Array<SecurityGroup>;
  private dialogObservable: Observable<MdlDialogReference>;

  constructor(
    private securityGroupService: SecurityGroupService,
    private dialogService: MdlDialogService
  ) { }

  public ngOnInit() {
    const securityGroupTemplates = this.securityGroupService.getTemplates();
    const accountSecurityGroups = this.securityGroupService.getList({
      'tags[0].key': 'template',
      'tags[0].value': 'true'
    });

    Promise.all([securityGroupTemplates, accountSecurityGroups])
      .then(([templates, groups]) => {
        this.securityGroupList = templates.concat(groups);
      });
  }

  public showCreationDialog() {
    this.dialogObservable = this.dialogService.showCustomDialog({
      component: SecurityGroupTemplateCreationComponent,
      isModal: true,
      styles: { 'width': '450px' },
      clickOutsideToClose: true,
      enterTransitionDuration: 400,
      leaveTransitionDuration: 400
    });

    this.dialogObservable.switchMap(res => res.onHide())
      .subscribe((data: any) => {
        if (!data) {
          return;
        }
        this.createSecurityGroupTemplate(data);
      });
  }

  public createSecurityGroupTemplate(data) {
    this.securityGroupService.createTemplate(data)
      .then(res => this.securityGroupList.push(res));
  }
}
