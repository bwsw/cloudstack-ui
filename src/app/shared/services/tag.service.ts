import { BaseBackendService } from './base-backend.service';
import { Tag } from '../models/tag.model';
import { BackendResource } from '../decorators/backend-resource.decorator';

@BackendResource({
  entity: 'Tag',
  entityModel: Tag
})
export class TagService extends BaseBackendService<Tag> { }
