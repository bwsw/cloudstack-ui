import { Component, Input } from '@angular/core';


@Component({
  selector: 'cs-sg-creation-rule',
  templateUrl: 'sg-creation-rule.component.html'
})
export class SgCreationRuleComponent {
  @Input() public item;
  @Input() public type: string;
}
