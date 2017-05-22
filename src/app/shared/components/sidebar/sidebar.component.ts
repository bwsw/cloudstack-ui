import {
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { DialogService } from '../../services/dialog/dialog.service';


@Component({
  selector: 'cs-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss']
})
export class SidebarComponent {
  @Input() @HostBinding('class.open') private isOpen;

  private dialogsOpen: boolean; // true if any mdl dialog is open
  private dialogWasOpen: boolean; // true if last dialog was closed

  constructor(
    private dialogService: DialogService
  ) {
    this.isOpen = false;
    this.dialogService.onDialogsOpenChanged
      .subscribe(dialogsOpen => {
        this.dialogsOpen = dialogsOpen;
        if (dialogsOpen) {
          this.dialogWasOpen = true;
        }
      });
  }
}
