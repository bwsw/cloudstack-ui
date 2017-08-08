import { Injectable } from '@angular/core';
import { EntityTagService } from './entity-tag.service';
import { Observable } from 'rxjs/Observable';
import { StatusTagService } from './common-tags/status-tag.service';
import { TagService } from './tag.service';
import { SecurityGroup } from '../../../security-group/sg.model';


type SecurityGroupTag = 'status';

type SecurityGroupStatus = 'removed';
const SecurityGroupStatuses = {
  removed: 'removed' as SecurityGroupStatus
};

@Injectable()
export class SecurityGroupTagService extends EntityTagService {
  public keys = {
    status: 'status' as SecurityGroupTag
  };
  protected entityPrefix = 'security-group';

  constructor(
    private statusTagService: StatusTagService,
    protected tagService: TagService
  ) {
    super(tagService);
  }

  public getStatus(securityGroup: SecurityGroup): Observable<SecurityGroupStatus> {
    return this.statusTagService.getStatus(securityGroup, this);
  }

  public setStatus(securityGroup: SecurityGroup, status: SecurityGroupStatus): Observable<SecurityGroup> {
    return this.statusTagService.setStatus(securityGroup, status, this);
  }
}
