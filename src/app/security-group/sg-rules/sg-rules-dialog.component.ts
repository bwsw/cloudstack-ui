import { ChangeDetectorRef, Component, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityGroupService } from '../services/security-group.service';
import { SecurityGroup } from '../sg.model';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { SgRulesComponent } from './sg-rules.component';

@Component({
  selector: 'cs-sg-rules-dialog',
  template: ``
})
export class SecurityGroupRulesDialogComponent implements OnChanges {
  @Input() securityGroup: SecurityGroup;

  constructor(
    private entityService: SecurityGroupService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
  }

  public ngOnChanges(changes) {
    this.cd.detectChanges();

    if (changes.securityGroup) {
      this.showDialog(this.securityGroup);
    }
  }

  private showDialog(entity: SecurityGroup) {
    const editMode = !!this.route.snapshot.queryParams.hasOwnProperty('vm');

    this.dialog.open(SgRulesComponent, <MatDialogConfig>{
      width: '910px',
      data: { entity, editMode }
    })
      .afterClosed()
      .map(updatedGroup => {
        return (<SecurityGroupService>this.entityService).onSecurityGroupUpdate.next(
          updatedGroup);
      });

    this.dialog.afterAllClosed.subscribe(() => {
      this.router.navigate(
        ['../'],
        { queryParamsHandling: 'preserve', relativeTo: this.route }
      );
    });
  }
}
