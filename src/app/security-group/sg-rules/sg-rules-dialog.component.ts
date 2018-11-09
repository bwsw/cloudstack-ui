import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { SgRulesContainerComponent } from '../containers/sg-rules.container';

@Component({
  selector: 'cs-sg-rules-dialog',
  template: ``,
})
export class SecurityGroupRulesDialogComponent {
  constructor(private route: ActivatedRoute, private dialog: MatDialog, private router: Router) {
    const params = this.route.snapshot.params;
    this.showDialog(params['id']);
  }

  private showDialog(securityGroupId: string) {
    const editMode = !!this.route.snapshot.queryParams.hasOwnProperty('vm');

    this.dialog.open(SgRulesContainerComponent, {
      width: '910px',
      data: { securityGroupId, editMode },
    } as MatDialogConfig);

    this.dialog.afterAllClosed.subscribe(() => {
      this.router.navigate(['../../'], { queryParamsHandling: 'preserve', relativeTo: this.route });
    });
  }
}
