import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TemplateService } from '../../../shared/template/template.service';
import { Template } from '../../../shared/template/template.model';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'cs-template-details',
  templateUrl: 'template-details.component.html',
  styleUrls: ['template-details.component.scss']
})
export class TemplateDetailsComponent implements OnInit {
  public entity: Template;

  constructor(
    public route: ActivatedRoute,
    public templateService: TemplateService
  ) {}

  public ngOnInit(): void {
    const params = this.route.snapshot.parent.params;
    this.loadEntity(params.id).subscribe(entity => this.entity = entity);
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
