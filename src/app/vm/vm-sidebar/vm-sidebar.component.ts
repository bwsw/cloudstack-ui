import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output
} from '@angular/core';

import { MdlDialogService } from 'angular2-mdl';
import { SecurityGroup } from '../../security-group/sg.model';
import { ServiceOfferingDialogComponent } from '../../service-offering/service-offering-dialog.component';
import { SgRulesComponent } from '../../security-group/sg-rules/sg-rules.component';
import { VirtualMachine } from '../vm.model';
import { SnapshotCreationComponent } from '../../snapshot/snapshot-creation.component';


@Component({
  selector: 'cs-vm-detail',
  templateUrl: 'vm-sidebar.component.html',
  styleUrls: ['vm-sidebar.component.scss']
})
export class VmSidebarComponent {
  @Output() public onClickOutside = new EventEmitter();
  @Input() public vm: VirtualMachine;
  @Input() @HostBinding('class.open') private isOpen;
  private expandNIC: boolean;
  private expandStorage: boolean;
  private expandServiceOffering: boolean;

  constructor(
    private elementRef: ElementRef,
    private dialogService: MdlDialogService
  ) {
    this.expandNIC = false;
    this.expandStorage = false;
    this.expandServiceOffering = false;
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

  public toggleStorage() {
    this.expandStorage = !this.expandStorage;
  }

  public toggleServiceOffering(): void {
    this.expandServiceOffering = !this.expandServiceOffering;
  }

  public showRulesDialog(securityGroup: SecurityGroup) {
    this.dialogService.showCustomDialog({
      component: SgRulesComponent,
      providers: [{ provide: 'securityGroup', useValue: securityGroup }],
      isModal: true,
      styles: { 'width': '880px' },
      enterTransitionDuration: 400,
      leaveTransitionDuration: 400
    });
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

  public takeSnapshot(volumeId: string): void {
    this.dialogService.showCustomDialog({
      component: SnapshotCreationComponent,
      providers: [{ provide: 'volumeId', useValue: volumeId }],
      isModal: true,
      styles: { 'width': '400px' },
      clickOutsideToClose: true,
      enterTransitionDuration: 400,
      leaveTransitionDuration: 400
    });
  }
}
