import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { Router } from '@angular/router';
import { SgTemplateCreationComponent } from './sg-template-creation.component';
import { SecurityGroup } from '../sg.model';
import { SgRulesComponent } from '../sg-rules/sg-rules.component';
import { NotificationService } from '../../shared/services/notification.service';
import { SecurityGroupService } from '../../shared/services/security-group.service';

@Component({
  selector: 'cs-sg-template-create-dialog',
  template: ``
})
export class SgTemplateCreationDialogComponent implements OnInit {
  constructor(
    private dialogService: DialogService,
    private router: Router,
    private notificationService: NotificationService,
    private securityGroupService: SecurityGroupService
  ) {
  }

  ngOnInit() {
    this.dialogService.showCustomDialog({
      component: SgTemplateCreationComponent,
      clickOutsideToClose: false,
      classes: 'sg-template-creation-dialog'
    })
      .switchMap(res => res.onHide())
      .subscribe((template: SecurityGroup) => {
        if (!template) {
          return;
        }
        this.securityGroupService.onCreation.next(template);
        this.notificationService.message({
          translationToken: 'TEMPLATE_CREATED',
          interpolateParams: { name: template.name }
        });
        this.showRulesDialog(template);
      });
  }

  public showRulesDialog(group: SecurityGroup): void {
    this.dialogService.showCustomDialog({
      component: SgRulesComponent,
      classes: 'sg-rules-dialog',
      providers: [{ provide: 'securityGroup', useValue: group }],
    })
      .switchMap(res => res.onHide())
      .subscribe(() => {
        this.router.navigate(['/sg-templates']);
      });
  }
}
