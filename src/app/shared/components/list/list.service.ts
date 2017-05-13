import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class ListService {
  public onSelected = new Subject<string>();
  public onDeselected = new Subject<void>();
  public onAction = new Subject<void>();

  private selectedId: string;

  constructor(protected route: ActivatedRoute, protected router: Router) {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.route.firstChild)
      .subscribe((route) => {
        if (route) {
          this.selectedId = route.snapshot.params['id'] || null;
        }
      });
  }

  public showDetails(id: string): void {
    this.router.navigate([id], {
      relativeTo: this.route,
      preserveQueryParams: true
    });
  }

  public selectItem(id: string): void {
    this.selectedId = id;
    this.onSelected.next(this.selectedId);
  }

  public deselectItem(): void {
    this.selectedId = null;
    this.router
      .navigate([this.route.parent.snapshot.url], {
        preserveQueryParams: true
      })
      .then(() => this.onDeselected.next());
  }

  public isSelected(id: string): boolean {
    return id === this.selectedId;
  }
}
