import { Input } from '@angular/core';

export class StateIndicator {
  // All supported states listed as css rules
  @Input()
  state: string;
}
