import { Component, Input } from '@angular/core';


@Component({
  selector: 'cs-character-count',
  templateUrl: 'character-count.component.html',
  styleUrls: ['character-count.component.scss']
})
export class CharacterCountComponent {
  @Input() public maxLength: number;
  @Input() public value: string;
}
