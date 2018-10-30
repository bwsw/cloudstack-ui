import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplateCreationContainerComponent } from './containers/template-creation.container';

@Component({
  selector: 'cs-template-create-dialog',
  template: ``,
})
export class TemplateCreationDialogComponent {
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.dialog
      .open(TemplateCreationContainerComponent, {
        data: {},
        disableClose: true,
        width: '650px',
      })
      .afterClosed()
      .subscribe(() => {
        this.router.navigate(['../'], {
          queryParamsHandling: 'preserve',
          relativeTo: this.activatedRoute,
        });
      });
  }
}
