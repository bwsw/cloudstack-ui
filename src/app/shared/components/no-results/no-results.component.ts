import { Component, Input } from '@angular/core';


@Component({
  selector: 'cs-no-results',
  templateUrl: 'no-results.component.html',
  styleUrls: ['no-results.component.scss']
})
export class NoResultsComponent {
  @Input() public text = 'NO_RESULTS';
}
