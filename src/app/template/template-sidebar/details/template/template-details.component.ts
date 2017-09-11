import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TemplateService } from '../../../shared/template/template.service';
import { Template } from '../../../shared/template/template.model';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../../../shared/services/auth.service';


@Component({
  selector: 'cs-template-details',
  templateUrl: 'template-details.component.html'
})
export class TemplateDetailsComponent implements OnInit {
  public entity: Template;

  constructor(
    public authService: AuthService,
    public route: ActivatedRoute,
    public templateService: TemplateService
  ) {}

  public ngOnInit(): void {
    const params = this.route.snapshot.parent.params;
    this.loadEntity(params.id).subscribe(entity => this.entity = entity);
  }

  public get isSelf(): boolean {
    return this.authService.user.username === this.entity.account;
  }

  protected loadEntity(id: string): Observable<Template> {
    return this.templateService.get(id)
      .switchMap(template => {
        if (template) {
          return Observable.of(template);
        } else {
          return Observable.throw('ENTITY_DOES_NOT_EXIST');
        }
      });
  }
}
