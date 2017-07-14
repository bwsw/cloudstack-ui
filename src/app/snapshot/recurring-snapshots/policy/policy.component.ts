import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Policy } from '../policy-editor/policy-editor.component';


@Component({
  selector: 'cs-policy',
  templateUrl: 'policy.component.html',
  styleUrls: ['policy.component.scss']
})
export class PolicyComponent {
  @Input() public policy: Policy;
  @Output() public onPolicyDelete: EventEmitter<Policy>;

  constructor() {
    this.onPolicyDelete = new EventEmitter<Policy>();
  }
}
