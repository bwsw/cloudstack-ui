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


@Component({
  selector: 'cs-vm-sidebar',
  templateUrl: 'vm-sidebar.component.html',
  styleUrls: ['vm-sidebar.component.scss']
})
export class VmSidebarComponent {
  @Output() public onClickOutside = new EventEmitter();
  @Input() public vm: VirtualMachine;
  @Input() @HostBinding('class.open') private isOpen;

  constructor(
    private elementRef: ElementRef
  ) { }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const target = event.target;
    if (!target || !this.isOpen) {
      return;
    }

    const isOutside = !this.elementRef.nativeElement.contains(target);

    if (isOutside) {
      this.onClickOutside.emit();
    }
  }
}
