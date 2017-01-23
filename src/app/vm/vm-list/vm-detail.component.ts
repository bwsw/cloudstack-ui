import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { VirtualMachine } from '../vm.model';
import { MdlDialogService } from 'angular2-mdl';
import { ServiceOfferingDialogComponent } from '../../service-offering/service-offering-dialog.component';


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
    private dialogService: MdlDialogService
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

  public toggleNIC() {
    this.expandNIC = !this.expandNIC;
  }

  public toggleServiceOffering(): void {
    this.expandServiceOffering = !this.expandServiceOffering;
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
