import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityGroupService } from '../services/security-group.service';
import { SecurityGroup } from '../sg.model';
import { NotificationService } from '../../shared/services/notification.service';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { SgRulesComponent } from './sg-rules.component';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'cs-sg-rules-dialog',
  template: ``
})
export class SecurityGroupRulesDialogComponent {
  constructor(
    private entityService: SecurityGroupService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private dialog: MdDialog,
    private router: Router
  ) {
    this.pluckId()
      .switchMap(id => this.loadEntity(id))
      .subscribe(
        entity => this.showDialog(entity),
        error => this.onError(error)
      );
  }

  private showDialog(entity: SecurityGroup) {
    const editMode = !!this.route.snapshot.queryParams.hasOwnProperty('vm');

    this.dialog.open(SgRulesComponent, <MdDialogConfig>{
      width: '880px',
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

  private pluckId(): Observable<string> {
    return this.route.params.pluck('id').filter(id => !!id) as Observable<string>;
  }

  private loadEntity(id: string): Observable<SecurityGroup> {
    return this.entityService.get(id);
  }

  private onError(error: any): void {
    this.notificationService.error(error.message);
  }
}
