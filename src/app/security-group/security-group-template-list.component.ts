import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MdlDialogService, MdlDialogReference } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';

import { SecurityGroupService } from './security-group.service';
import { SecurityGroup } from './security-group.model';
import { SecurityGroupTemplateCreationComponent } from './security-group-template-creation.component';

@Component({
  selector: 'cs-security-group-template-list',
  templateUrl: './security-group-template-list.component.html'
})
export class SecurityGroupTemplateListComponent implements OnInit {
  private securityGroupList: Array<SecurityGroup>;
  private dialogObservable: Observable<MdlDialogReference>;

  constructor(
    private securityGroupService: SecurityGroupService,
    private dialogService: MdlDialogService,
    private translate: TranslateService
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
      .then(([template, tagObservable]) => {
        tagObservable.subscribe(res => {
          if (!res || !res.jobResult.success) {
            return;
          }
          template.labels = [res.jobResult.tag.value];
          this.securityGroupList.push(template);
        });
      });
  }

  public deleteSecurityGroupTemplate(id) {
    this.translate.get([
      'YES',
      'NO',
      'CONFIRM_DELETE_TEMPLATE'
    ]).subscribe(translations => {
      this.dialogService.confirm(
        translations['CONFIRM_DELETE_TEMPLATE'],
        translations['NO'],
        translations['YES']
      ).toPromise()
        .then(() => {
          return this.securityGroupService.deleteTemplate(id);
        })
        .then(res => {
          if (res && res.success === 'true') {
            this.securityGroupList = this.securityGroupList.filter(sg => sg.id !== id);
          }
        })
        .catch(() => {});
    });
  }
}
