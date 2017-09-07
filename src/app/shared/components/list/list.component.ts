import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'cs-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.scss']
})
export class ListComponent {
  @Output() onAction = new EventEmitter();
  @Input() isOpen = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  public hideDetails() {
    this.router.navigate([this.route.parent.snapshot.url], {
      queryParamsHandling: 'preserve'
    });
  }
}
