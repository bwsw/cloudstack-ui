import { ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { AbstractInlineEditComponent } from './abstract-inline-edit.component';

@Component({
  selector: 'cs-inline-edit',
  templateUrl: 'inline-edit.component.html',
  styleUrls: ['inline-edit.scss', 'inline-edit.component.scss'],
})
export class InlineEditComponent extends AbstractInlineEditComponent implements OnInit {
  @Input()
  public rows: number;
  @Input()
  public maxrows: number;
  @Input()
  public maxLength: number;

  @ViewChild(MatInput)
  public textArea: MatInput;

  public constructor(
    protected changeDetectorRef: ChangeDetectorRef,
    protected translateService: TranslateService,
    protected zone: NgZone,
  ) {
    super(changeDetectorRef);
    this.inputPlaceholder = this.contentPlaceholder || 'INLINE_EDIT.ENTER_TEXT';
  }

  public edit(): void {
    super.edit();
    this.textArea.focus();
  }

  public updateTextFieldText(newText: string): void {
    this.textFieldText = newText;

    if (this.maxLength && this.textFieldText.length > this.maxLength) {
      this.textFieldText = this.textFieldText.substr(0, this.maxLength);
      this.changeDetectorRef.detectChanges();
      this.textArea.value = this.textFieldText; // seems like a hack
    }
  }

  public onKeyUp(event: KeyboardEvent): void {
    this.zone.runOutsideAngular(() => {
      // Enter key
      if (event.which === 13 || event.charCode === 13) {
        event.stopPropagation();
        if (event.ctrlKey) {
          super.onSubmit();
        }
      }
    });
  }
}
