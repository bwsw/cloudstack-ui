import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';
import { Keyword } from '../models/keyword.model';

/**
 * @title Chips Autocomplete
 */
@Component({
  selector: 'cs-vm-log-keywords',
  templateUrl: 'vm-log-keywords.component.html',
  styleUrls: ['vm-log-keywords.component.scss']
})
export class VmLogKeywordsComponent {
  @Input() public keywords: Array<Keyword>;
  @Output() public onKeywordAdd = new EventEmitter<Keyword>();
  @Output() public onKeywordRemove = new EventEmitter<Keyword>();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];

  public add({ input, value }: MatChipInputEvent): void {
    const text = (value || '').trim();

    if (text) {
      this.onKeywordAdd.emit({ text });
    }

    if (input) {
      input.value = '';
    }
  }

  public remove(keyword: Keyword): void {
    this.onKeywordRemove.emit(keyword);
  }
}
