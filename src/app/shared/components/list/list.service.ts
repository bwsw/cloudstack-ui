import { EventEmitter, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';


@Injectable()
export class ListService {
  public onDelete = new EventEmitter();

  private selectedId: string;

  constructor(protected route: ActivatedRoute, protected router: Router) {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.route.firstChild)
      .subscribe((activatedRoute) => {
        if (activatedRoute) {
          this.selectedId = activatedRoute.snapshot.params['id'] || null;
        } else {
          this.selectedId = null;
        }
      });
  }

  public showDetails(id: string): void {
    this.router.navigate([id], {
      relativeTo: this.route,
      queryParamsHandling: 'preserve'
    });
  }

  public deselectItem(): void {
    this.router.navigate([this.route.parent.snapshot.url], {
      queryParamsHandling: 'preserve'
    });
  }

  public isSelected(id: string): boolean {
    return id === this.selectedId;
  }

  public hasSelected(): boolean {
    return !!this.selectedId;
  }
}
