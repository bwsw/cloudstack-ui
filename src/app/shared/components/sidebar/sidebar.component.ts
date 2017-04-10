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


@Component({
  selector: 'cs-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss']
})
export class SidebarComponent {
  @Output() public onClickOutside = new EventEmitter();
  @Input() @HostBinding('class.open') private isOpen;

  private dialogsOpen: boolean; // true if any mdl dialog is open
  private dialogWasOpen: boolean; // true if last dialog was closed

  constructor(
    private elementRef: ElementRef,
    private dialogService: MdlDialogService
  ) {
    this.dialogService.onDialogsOpenChanged
      .subscribe(dialogsOpen => {
        this.dialogsOpen = dialogsOpen;
        if (dialogsOpen) {
          this.dialogWasOpen = true;
        }
      });
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const originalTarget = event.target;
    // used to stop propagation when mdl dialogs are clicked
    // so that vm sidebar stays open.

    if (this.dialogsOpen) {
      return;
    }

    // this is needed because this method handles click after
    // the last dialog is closed and dialogsOpen is already false
    if (!this.dialogsOpen && this.dialogWasOpen) {
      this.dialogWasOpen = false;
      return;
    }

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
