import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SnackBarService } from '../../../core/services';

@Component({
  selector: 'cs-clipboard-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-icon-button
      ngxClipboard
      [cbContent]="value"
      (cbOnSuccess)="onCopySuccess()"
      (cbOnError)="onCopyFail()"
    >
      <mat-icon
        [matTooltipPosition]="tooltipPosition"
        [matTooltip]="'CLIPBOARD.COPY' | translate"
        class="mdi-content-copy"
      >
      </mat-icon>
    </button>
  `,
})
export class ClipboardButtonComponent {
  @Input()
  value: string;
  @Input()
  tooltipPosition = 'after';

  constructor(private snackBarService: SnackBarService) {}

  public onCopySuccess(): void {
    this.snackBarService.open('CLIPBOARD.COPY_SUCCESS').subscribe();
  }

  public onCopyFail(): void {
    this.snackBarService.open('CLIPBOARD.COPY_FAIL').subscribe();
  }
}
