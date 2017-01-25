import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { MdlDialogService } from 'angular2-mdl';

import { SecurityGroup } from '../../security-group/sg.model';
import { ServiceOfferingDialogComponent } from '../../service-offering/service-offering-dialog.component';
import { SgRulesComponent } from '../../security-group/sg-rules/sg-rules.component';
import { VirtualMachine } from '../vm.model';
import { VolumeResizeComponent } from './volume-resize.component';
import { JobsNotificationService, INotificationStatus } from '../../shared/services/jobs-notification.service';
import { Volume } from '../../shared/models/volume.model';
import { TranslateService } from 'ng2-translate';


@Component({
  selector: 'cs-vm-detail',
  templateUrl: 'vm-detail.component.html',
  styleUrls: ['vm-detail.component.scss']
})
export class VmDetailComponent {
  @Output() public onClickOutside = new EventEmitter();
  @Input() public vm: VirtualMachine;
  @Input() @HostBinding('class.open') private isOpen;
  private expandNIC: boolean;
  private expandServiceOffering: boolean;

  constructor(
    private elementRef: ElementRef,
    private dialogService: MdlDialogService,
    private translateService: TranslateService,
    private jobNotificationService: JobsNotificationService
  ) {
    this.expandNIC = false;
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const target = event.target;
    if (!target || !this.isOpen || (<Element>event.target).tagName.toLowerCase() === 'span') { // fix!
      return;
    }

    const isOutside = !this.elementRef.nativeElement.contains(target);

    if (isOutside) {
      this.onClickOutside.emit();
    }
  }

  public toggleNIC(): void {
    this.expandNIC = !this.expandNIC;
  }

  public toggleServiceOffering(): void {
    this.expandServiceOffering = !this.expandServiceOffering;
  }

  public showRulesDialog(securityGroup: SecurityGroup): void {
    this.dialogService.showCustomDialog({
      component: SgRulesComponent,
      providers: [{ provide: 'securityGroup', useValue: securityGroup }],
      isModal: true,
      styles: { 'width': '880px' },
      enterTransitionDuration: 400,
      leaveTransitionDuration: 400
    });
  }

  public showVolumeResizeDialog(): void {
    let notificationId: string;
    let translations;

    this.translateService.get([
      'VOLUME_RESIZING',
      'VOLUME_RESIZED',
      'VOLUME_RESIZE_FAILED',
      'VOLUME_NEWSIZE_LOWER',
      'VOLUME_PRIMARY_STORAGE_EXCEEDED'
    ])
      .switchMap(res => {
        translations = res;
        return this.dialogService.showCustomDialog({
          component: VolumeResizeComponent,
          providers: [{ provide: 'volume', useValue: this.vm.volumes[0] }],
          isModal: true,
          styles: { 'width': '400px' },
          enterTransitionDuration: 400,
          leaveTransitionDuration: 400
        });
      })
      .switchMap(res => res.onHide())
      .switchMap((data: any) => {
        if (data) {
          notificationId = this.jobNotificationService.add(translations['VOLUME_RESIZING']);
          return data;
        }
        return Observable.of(undefined);
      })
      .subscribe((data: any) => {
        if (!data) {
          return;
        }
        this.vm.volumes[0].size = (data as Volume).size;

        this.jobNotificationService.add({
          id: notificationId,
          message: translations['VOLUME_RESIZED'],
          status: INotificationStatus.Finished
        });
      },
        error => {
          let message = '';

          // can't rely on error codes, native ui just prints errortext
          if (error.errortext.startsWith('Going from')) {
            message = translations['VOLUME_NEWSIZE_LOWER'];
          } else if (error.errortext.startsWith('Maximum number of')) {
            message = translations['VOLUME_PRIMARY_STORAGE_EXCEEDED'];
          } else {
            // don't know what errors may occur,
            // so print errortext like native ui
            message = error.errortext;
          }

          this.jobNotificationService.add({
            id: notificationId,
            message: translations['VOLUME_RESIZE_FAILED'],
            status: INotificationStatus.Failed
          });
          this.dialogService.alert(message);
        }
      );
  }

  public openConsole(): void {
    window.open(
      `/client/console?cmd=access&vm=${this.vm.id}`,
      this.vm.displayName,
      'resizable=0,width=820,height=640'
    );
  }

  public changeServiceOffering() {
    this.dialogService.showCustomDialog({
      component: ServiceOfferingDialogComponent,
      providers: [{ provide: 'virtualMachine', useValue: this.vm }],
      isModal: true,
      styles: {
        'overflow': 'visible', // so that the dialog window doesn't cut the SO dropdown
        'width': '400px'
      },
      clickOutsideToClose: true,
      enterTransitionDuration: 400,
      leaveTransitionDuration: 400
    });
  }
}
