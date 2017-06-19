import { ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { MdlTextFieldComponent } from '@angular-mdl/core';
import { TranslateService } from '@ngx-translate/core';
import { AbstractInlineEditComponent } from './abstract-inline-edit.component';


@Component({
  selector: 'cs-inline-edit',
  templateUrl: 'inline-edit.component.html',
  styleUrls: ['inline-edit.scss', 'inline-edit.component.scss']
})
export class InlineEditComponent extends AbstractInlineEditComponent implements OnInit {
  @Input() public rows: number;
  @Input() public maxrows: number;
  @Input() public maxLength: number;

  @ViewChild(MdlTextFieldComponent) public textFieldComponent: MdlTextFieldComponent;

  public constructor(
    protected changeDetectorRef: ChangeDetectorRef,
    protected translateService: TranslateService,
    protected zone: NgZone
  ) {
    super(changeDetectorRef);
    this.inputPlaceholder = this.contentPlaceholder || 'ENTER_TEXT';
  }

  public edit(): void {
    super.edit();
    this.textFieldComponent.setFocus();
  }

  public updateTextFieldText(newText: string): void {
    this.textFieldText = newText;

    if (this.maxLength && this.textFieldText.length > this.maxLength) {
      this.textFieldText = this.textFieldText.substr(0, this.maxLength);
      this.changeDetectorRef.detectChanges();
      this.textFieldComponent.writeValue(this.textFieldText);
    }
  }

  public onKeyUp(event: KeyboardEvent): void {
    this.zone.runOutsideAngular(() => {
      if (event.which === 13 || event.charCode === 13) {
        event.stopPropagation();
        if (event.ctrlKey) {
          super.onSubmit();
        }
      }
    });
  }
}
