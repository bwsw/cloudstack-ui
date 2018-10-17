import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cs-parameters-pair',
  templateUrl: 'parameters-pair.component.html',
  styleUrls: ['parameters-pair.component.scss'],
})
export class ParametersPairComponent {
  @Input()
  public name: string;
  @Input()
  public value: string;
  @Input()
  public canBeEdit = false;
  @Input()
  public canBeCopy = false;
  @Output()
  public buttonClicked = new EventEmitter();

  constructor() {}
}
