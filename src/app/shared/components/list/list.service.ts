import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { BaseModel } from '../../models';


@Injectable()
export class ListService {
  public onSelected = new Subject<BaseModel>();
  public onDeselected = new Subject<void>();
  public onAction = new Subject<void>();

  constructor(private route: ActivatedRoute, private router: Router) { }

  public selectItem(model: BaseModel): void {
    this.router.navigate([model.id], {
      relativeTo: this.route,
      preserveQueryParams: true
    })
      .then(() => this.onSelected.next(model));
  }

  public deselectItem(): void {
    this.router.navigate([this.route.parent.snapshot.url], {
      preserveQueryParams: true
    })
      .then(() => this.onDeselected.next());
  }
}
