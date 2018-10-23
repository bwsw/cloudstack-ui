import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cs-parameters-edit-pair',
  templateUrl: 'parameters-edit-pair.component.html',
  styleUrls: ['parameters-pair.component.scss'],
})
export class ParametersEditPairComponent {
  @Input()
  public name: string;
  @Input()
  public value: number;
  @Input()
  public index: number;
  @Output()
  public valueChange = new EventEmitter();
}
