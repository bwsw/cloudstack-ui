import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { MdlDialogService } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';

import { Iso } from '../shared';
import { INotificationStatus, JobsNotificationService } from '../../shared/services';
import { TemplateCreationComponent } from '../template-creation/template-creation.component';
import { NotificationService } from '../../shared/services/notification.service';


@Component({
  selector: 'cs-template-list',
  templateUrl: 'template-list.component.html',
  styleUrls: ['template-list.component.scss']
})
export class TemplateListComponent {
  private dialogObservable: Observable<any>;

  constructor(
    private dialogService: MdlDialogService,
    private jobNotificationService: JobsNotificationService,
    private translateService: TranslateService,
    private notificationService: NotificationService
  ) {}

  public showCreationDialog(): void {
    let translatedStrings;
    let notificationId;

    this.dialogObservable = this.dialogService.showCustomDialog({
      component: TemplateCreationComponent,
      isModal: true,
      styles: { 'width': '720px', 'overflow': 'visible' },
      clickOutsideToClose: true,
      enterTransitionDuration: 400,
      leaveTransitionDuration: 400
    });

    this.translateService.get([
      'ISO_REGISTER_IN_PROGRESS',
      'ISO_REGISTER_DONE',
      'ISO_REGISTER_FAILED'
    ])
      .switchMap(strs => {
        translatedStrings = strs;
        return this.dialogObservable;
      })
      .switchMap(res => res.onHide())
      .switchMap((registerObservable: any) => {
        if (!registerObservable) { return; }
        notificationId = this.jobNotificationService.add(translatedStrings['ISO_REGISTER_IN_PROGRESS']);
        return this.addIso(registerObservable);
      })
      .subscribe(() => {
        this.jobNotificationService.add({
          id: notificationId,
          message: translatedStrings['ISO_REGISTER_DONE'],
          status: INotificationStatus.Finished
        });
      }, error => {
        this.notificationService.error(error.json()['registerisoresponse']['errortext']);
        this.jobNotificationService.add({
          id: notificationId,
          message: translatedStrings['ISO_REGISTER_FAILED'],
          status: INotificationStatus.Failed
        });
      });
  }

  public addIso(registerObservable: Observable<any>): Observable<Iso> {
    return registerObservable.map(result => {
      // add iso to list
      return result;
    });
  }
}
