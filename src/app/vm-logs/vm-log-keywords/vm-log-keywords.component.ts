import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';

/**
 * @title Chips Autocomplete
 */
@Component({
  selector: 'cs-vm-log-keywords',
  templateUrl: 'vm-log-keywords.component.html'
})
export class VmLogKeywordsComponent {
  visible = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  keywords = [];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.keywords.push({ text: value.trim() });
    }

    if (input) {
      input.value = '';
    }
  }

  remove(keyword): void {
    const index = this.keywords.indexOf(keyword);

    if (index >= 0) {
      this.keywords.splice(index, 1);
    }
  }
}
