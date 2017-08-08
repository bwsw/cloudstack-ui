import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tag } from '../../shared/models';
import { NotificationService } from '../../shared/services';
import { DialogService } from '../../dialog/dialog-module/dialog.service';


@Component({
  selector: 'cs-tag',
  templateUrl: 'tag.component.html',
  styleUrls: ['tag.component.scss']
})
export class TagComponent {
  @Input() public query: string;
  @Input() public tag: Tag;
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
    this.dialogService.confirm('TAG_DELETE_CONFIRMATION')
      .subscribe(
        () => this.remove(),
        () => {}
      );
  }

  public onCopySuccess(): void {
    this.notificationService.message('COPY_SUCCESS');
  }

  public onCopyFail(): void {
    this.notificationService.message('COPY_FAIL');
  }

  private remove(): void {
    this.loading = true;
    this.onTagRemove.emit(this.tag);
  }
}
