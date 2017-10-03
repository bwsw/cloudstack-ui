import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { Action } from '../../shared/interfaces/action.interface';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { VirtualMachine } from '../shared/vm.model';
import { VmService } from '../shared/vm.service';


export enum VmActions {
  START = 'start',
  STOP = 'stop',
  REBOOT = 'reboot',
  RESTORE = 'restore',
  DESTROY = 'destroy',
  EXPUNGE = 'expunge',
  RECOVER = 'recover',
  RESET_PASSWORD = 'resetPasswordFor',
  CONSOLE = 'console',
  CHANGE_SERVICE_OFFERING = 'changeServiceOffering',
  WEB_SHELL = 'webShell',
  PULSE = 'pulse'
}

@Injectable()
export abstract class VirtualMachineAction implements Action<VirtualMachine> {
  public name: string;
  public action: VmActions;
  public icon?: string;

  public tokens?: {
    [key: string]: string;
  };

  constructor(
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
    protected vmService: VmService
  ) {}

  public activate(vm: VirtualMachine, params?: {}): Observable<any> {
    return this.showConfirmationDialog()
      .switchMap((res) => res ? this.onActionConfirmed(vm) : this.onActionDeclined());
  }

  public canActivate(vm: VirtualMachine): boolean {
    return true;
  }

  public hidden(vm: VirtualMachine): boolean {
    return false;
  }

  protected onActionConfirmed(vm: VirtualMachine): Observable<any> {
    return Observable.of(null);
  }

  protected onActionDeclined(): Observable<void> {
    return Observable.of(null);
  }

  protected addNotifications(actionObservable: Observable<any>): Observable<any> {
    const notificationId = this.jobsNotificationService.add(this.tokens.progressMessage);

    return actionObservable
      .do(() => this.onActionFinished(notificationId))
      .catch(job => this.onActionFailed(notificationId, job));
  }

  protected onActionFinished(notificationId: any): void {
    this.jobsNotificationService.finish({
      id: notificationId,
      message: this.tokens.successMessage
    });
  }

  protected onActionFailed(notificationId: any, job: any): Observable<any> {
    this.dialogService.alert({ message: job.message });
    this.jobsNotificationService.fail({
      id: notificationId,
      message: this.tokens.failMessage
    });

    return job;
  }

  protected showConfirmationDialog(): Observable<void> {
    return this.dialogService.confirm({ message: this.tokens.confirmMessage });
  }
}
