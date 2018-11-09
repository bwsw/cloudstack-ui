import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { Tag } from '../../shared/models';
import { SnackBarService } from '../../core/services';

@Component({
  selector: 'cs-tag',
  templateUrl: 'tag.component.html',
  styleUrls: ['tag.component.scss'],
})
export class TagComponent {
  @Input()
  public query: string;
  @Input()
  public tag: Tag;
  @Input()
  public hasPermissions = false;
  @Output()
  public tagEdited: EventEmitter<Tag>;
  @Output()
  public tagRemoved: EventEmitter<Tag>;

  public loading: boolean;

  constructor(private dialogService: DialogService, private notificationService: SnackBarService) {
    this.tagEdited = new EventEmitter<Tag>();
    this.tagRemoved = new EventEmitter<Tag>();
  }

  public edit(): void {
    this.tagEdited.emit(this.tag);
  }

  public showRemoveDialog(): void {
    this.dialogService
      .confirm({ message: 'DIALOG_MESSAGES.TAG.CONFIRM_DELETION' })
      .subscribe(res => {
        if (res) {
          this.remove();
        }
      });
  }

  public onCopySuccess(): void {
    this.notificationService.open('CLIPBOARD.COPY_SUCCESS').subscribe();
  }

  public onCopyFail(): void {
    this.notificationService.open('CLIPBOARD.COPY_FAIL').subscribe();
  }

  private remove(): void {
    this.loading = true;
    this.tagRemoved.emit(this.tag);
  }
}
