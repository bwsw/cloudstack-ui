import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class ListService {
  public onAction = new Subject<void>();

  private selectedId: string;

  constructor(protected route: ActivatedRoute, protected router: Router) {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.route.firstChild)
      .subscribe((activatedRoute) => {
        if (activatedRoute) {
          this.selectedId = activatedRoute.snapshot.params['id'] || null;
        }
      });
  }

  public showDetails(id: string): void {
    this.router.navigate([id], {
      relativeTo: this.route,
      preserveQueryParams: true
    });
  }

  public deselectItem(): void {
    this.selectedId = null;
    this.router.navigate([this.route.parent.snapshot.url], {
      preserveQueryParams: true
    });
  }

  public isSelected(id: string): boolean {
    return id === this.selectedId;
  }
}
