import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Iso } from '../../../shared/iso/iso.model';
import { IsoService } from '../../../shared/iso/iso.service';
import { AuthService } from '../../../../shared/services/auth.service';


@Component({
  selector: 'cs-iso-details',
  templateUrl: 'iso-details.component.html',
  styleUrls: ['iso-details.component.scss']
})
export class IsoDetailsComponent implements OnInit {
  @Input() public entity: Iso;

  constructor(
    public authService: AuthService,
    public route: ActivatedRoute,
    public isoService: IsoService
  ) {}

  public ngOnInit(): void {
    const params = this.route.snapshot.parent.params;
    this.loadEntity(params.id).subscribe(entity => this.entity = entity);
  }

  public get isSelf(): boolean {
    return this.authService.user.username === this.entity.account;
  }

  protected loadEntity(id: string): Observable<Iso> {
    return this.isoService.get(id)
      .switchMap(template => {
        if (template) {
          return Observable.of(template);
        } else {
          return Observable.throw('ENTITY_DOES_NOT_EXIST');
        }
      });
  }
}
