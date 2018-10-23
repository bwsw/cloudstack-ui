import { Component, HostBinding, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cs-sidebar',
  templateUrl: 'sidebar-container.component.html',
  styleUrls: ['sidebar-container.component.scss'],
})
export class SidebarContainerComponent {
  @Input()
  @HostBinding('class.open')
  public isOpen;

  constructor(private route: ActivatedRoute, private router: Router) {}

  public onDetailsHide(): void {
    this.router.navigate([this.route.parent.snapshot.url], {
      queryParamsHandling: 'preserve',
    });
  }
}
