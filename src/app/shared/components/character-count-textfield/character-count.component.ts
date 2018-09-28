import { Component, Input } from '@angular/core';

@Component({
  selector: 'cs-character-count',
  template: '{{ value?.length || 0 }} / {{ maxLength }}',
})
export class CharacterCountComponent {
  @Input()
  public maxLength: number;
  @Input()
  public value: string;
}
