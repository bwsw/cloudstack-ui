import { Component, HostBinding, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarContainerService } from '../../../services/sidebar-container.service';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';


@Component({
  selector: 'cs-sidebar',
  templateUrl: 'sidebar-container.component.html',
  styleUrls: ['sidebar-container.component.scss']
})
export class SidebarContainerComponent {
  @Input() @HostBinding('class.open') public isOpen;

  constructor(
    public sidebarContainerService: SidebarContainerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  public onDetailsHide(): void {
    this.router.navigate([this.route.parent.snapshot.url], {
      queryParamsHandling: 'preserve'
    });
  }

  public onResize(event: IResizeEvent) {
    this.sidebarContainerService.width.next(Math.min(Math.max(event.size.width, 330), 700));
  }
}
