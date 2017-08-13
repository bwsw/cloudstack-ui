import {
  Component,
  OnInit,
} from '@angular/core';
import { DialogService } from '../../../dialog/dialog-module/dialog.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'cs-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public isOpen = false;

  private dialogsOpen: boolean; // true if any mdl dialog is open
  private dialogWasOpen: boolean; // true if last dialog was closed

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService
  ) {
    this.dialogService.onDialogsOpenChanged
      .subscribe(dialogsOpen => {
        this.dialogsOpen = dialogsOpen;
        if (dialogsOpen) {
          this.dialogWasOpen = true;
        }
      });
  }

  ngOnInit() {
    setTimeout(() => this.isOpen = true);
  }

  public onDetailsHide(): void {
    this.router.navigate([this.route.parent.snapshot.url], {
      queryParamsHandling: 'preserve'
    });
  }
}
