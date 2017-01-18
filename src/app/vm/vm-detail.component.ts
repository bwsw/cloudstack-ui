import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { VirtualMachine } from './vm.model';

@Component({
  selector: 'cs-vm-detail',
  templateUrl: './vm-detail.component.html',
  styleUrls: ['./vm-detail.component.scss']
})
export class VmDetailComponent {
  @Output() public onClickOutside = new EventEmitter();
  @Input() public vm: VirtualMachine;
  @Input() @HostBinding('class.open') private isOpen;
  private expandNetworkInterfaceController: boolean;
  private expandServiceOffering: boolean;


  constructor(private elementRef: ElementRef) {
    this.expandNetworkInterfaceController = false;
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent) {
    const target = event.target;
    if (!target || !this.isOpen || (<Element>event.target).tagName.toLowerCase() === 'span') { // fix!
      return;
    }

    const isOutside = !this.elementRef.nativeElement.contains(target);

    if (isOutside) {
      this.onClickOutside.emit();
    }
  }

  public toggleNetworkInterfaceController() {
    this.expandNetworkInterfaceController = !this.expandNetworkInterfaceController;
  }

  public toggleServiceOffering() {
    this.expandServiceOffering = !this.expandServiceOffering;
  }
}
