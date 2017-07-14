import { Component, Input, OnInit } from '@angular/core';
import { Policy } from '../policy-editor/policy-editor.component';


@Component({
  selector: 'cs-policy-list',
  templateUrl: 'policy-list.component.html',
  styleUrls: ['policy-list.component.scss']
})
export class PolicyListComponent implements OnInit {
  @Input() public policies: Array<Policy>;

  constructor() { }

  public ngOnInit(): void {
  }
}
