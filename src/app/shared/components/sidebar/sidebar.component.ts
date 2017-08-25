import {
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cs-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss']
})
export class SidebarComponent {
  @Input() public isOpen = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.isOpen = false;
  }

  public onDetailsHide(): void {
    this.router.navigate([this.route.parent.snapshot.url], {
      queryParamsHandling: 'preserve'
    });
  }
}
