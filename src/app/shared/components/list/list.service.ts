import { EventEmitter, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class ListService {
  public onUpdate = new EventEmitter();

  private selectedId: string;

  constructor(protected route: ActivatedRoute, protected router: Router) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.route.firstChild),
      )
      .subscribe(activatedRoute => {
        this.selectedId = activatedRoute ? activatedRoute.snapshot.params['id'] || null : null;
      });
  }

  public showDetails(id: string): void {
    this.router.navigate([id], {
      relativeTo: this.route,
      queryParamsHandling: 'preserve',
    });
  }

  public deselectItem(): void {
    this.router
      .navigate([this.route.parent.snapshot.url], {
        queryParamsHandling: 'preserve',
      })
      .then(() => (this.selectedId = undefined));
  }

  public isSelected(id: string): boolean {
    return id === this.selectedId;
  }

  public hasSelected(): boolean {
    return !!this.selectedId;
  }
}
