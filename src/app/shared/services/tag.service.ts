import { Observable } from 'rxjs';

import { BaseBackendService } from './base-backend.service';
import { Tag } from '../models/tag.model';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { AsyncJobService } from './async-job.service';


@BackendResource({
  entity: 'Tag',
  entityModel: Tag
})
export class TagService extends BaseBackendService<Tag> {
  constructor(private asyncJob: AsyncJobService) {
    super();
  }

  public create(params?: {}): Observable<any> {
    return super.create(params)
      .switchMap(tagJob => this.asyncJob.queryJob(tagJob.jobid));
  }

  public remove(params?: {}): Observable<any> {
    return super.remove(params)
      .switchMap(tagJob => this.asyncJob.queryJob(tagJob.jobid));
  }
}
