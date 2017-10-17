import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { Tag } from '../../shared/models';
import { NotificationService } from '../../shared/services/notification.service';


@Component({
  selector: 'cs-tag',
  templateUrl: 'tag.component.html',
  styleUrls: ['tag.component.scss']
})
export class TagComponent {
  @Input() public query: string;
  @Input() public tag: Tag;
  @Input() public hasPermissions = false;
  @Output() public onTagEdit: EventEmitter<Tag>;
  @Output() public onTagRemove: EventEmitter<Tag>;

  public loading: boolean;

  constructor(
    private dialogService: DialogService,
    private notificationService: NotificationService
  ) {
    this.onTagEdit = new EventEmitter<Tag>();
    this.onTagRemove = new EventEmitter<Tag>();
  }

  public edit(): void {
    this.onTagEdit.emit(this.tag);
  }

  public showRemoveDialog(): void {
    this.dialogService.confirm({ message: 'DIALOG_MESSAGES.TAG.CONFIRM_DELETION'})
      .subscribe(
        (res) => { if (res) { this.remove(); } });
  }

  public onCopySuccess(): void {
    this.notificationService.message('CLIPBOARD.COPY_SUCCESS');
  }

  public onCopyFail(): void {
    this.notificationService.message('CLIPBOARD.COPY_FAIL');
  }

  private remove(): void {
    this.loading = true;
    this.onTagRemove.emit(this.tag);
  }
}
