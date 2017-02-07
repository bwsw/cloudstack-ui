import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output
} from '@angular/core';

import { VirtualMachine } from '../shared/vm.model';


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
    const originalTarget = event.target;
    // used to stop propagation when mdl dialogs are clicked
    // so that vm sidebar stays open.
    let target = (event.target as Element);

    do {
      const tagName = target.tagName.toLowerCase();
      if (tagName === 'mdl-dialog-host-component') {
        return;
      }

      if (tagName === 'body') {
        break;
      }
      target = (target.parentNode as Element);
    } while (target);

    if (!originalTarget || !this.isOpen) {
      return;
    }

    // close vm sidebar if clicked outside of it
    const isOutside = !this.elementRef.nativeElement.contains(originalTarget);

    if (isOutside) {
      this.onClickOutside.emit();
    }
  }
}
