import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AbstractInlineEditComponent } from './abstract-inline-edit.component';
import { MdlAutocompleteComponent } from '../autocomplete/mdl-autocomplete.component';


@Component({
  selector: 'cs-inline-edit-autocomplete',
  templateUrl: 'inline-edit-autocomplete.component.html',
  styleUrls: ['inline-edit.scss', 'inline-edit-autocomplete.component.scss']
})
export class InlineEditAutocompleteComponent extends AbstractInlineEditComponent implements OnInit {
  @Input() public autocompleteOptions: Array<string>;
  @ViewChild(MdlAutocompleteComponent) public autocompleteComponent: MdlAutocompleteComponent;

  public constructor(
    protected changeDetectorRef: ChangeDetectorRef,
    protected translateService: TranslateService
  ) {
    super(changeDetectorRef);
    this.contentPlaceholder = 'CLICK_TO_EDIT';
    this.inputPlaceholder = 'SELECT_AN_OPTION';
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.autocompleteOptions = this.autocompleteOptions || [];
  }

  public edit(): void {
    super.edit();
    this.autocompleteComponent.addFocus();
  }

  public updateTextFieldText(newText: string): void {
    this.textFieldText = newText;
  }
}
