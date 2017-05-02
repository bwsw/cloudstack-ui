import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'cs-description',
  templateUrl: 'description.component.html'
})
export class DescriptionComponent {
  @Input() public description: string;
  @Output() public descriptionChange: EventEmitter<string>;

  public maxLength = 255;
  public rows = 3;

  constructor() {
    this.descriptionChange = new EventEmitter<string>();
  }

  public updateDescription(newDescription: string): void {
    this.descriptionChange.next(newDescription);
  }
}
