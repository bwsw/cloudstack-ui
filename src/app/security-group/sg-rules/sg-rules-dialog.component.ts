import { Component } from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { SecurityGroupService } from '../services/security-group.service';
import {
  MatDialog,
  MatDialogConfig
} from '@angular/material';
import { SgRulesContainerComponent } from '../containers/sg-rules.container';

@Component({
  selector: 'cs-sg-rules-dialog',
  template: ``
})
export class SecurityGroupRulesDialogComponent {
  constructor(
    private entityService: SecurityGroupService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    const params = this.activatedRoute.snapshot.parent.params;
    this.showDialog(params['id']);
  }

  private showDialog(id: string) {
    const editMode = !!this.route.snapshot.queryParams.hasOwnProperty('vm');

    this.dialog.open(SgRulesContainerComponent, <MatDialogConfig>{
      width: '910px',
      data: { id, editMode }
    })
      .afterClosed()
      .map(updatedGroup => {
        return (<SecurityGroupService>this.entityService).onSecurityGroupUpdate.next(
          updatedGroup);
      });

    this.dialog.afterAllClosed.subscribe(() => {
      this.router.navigate(
        ['../../'],
        { queryParamsHandling: 'preserve', relativeTo: this.route }
      );
    });
  }
}
