import { Injectable } from '@angular/core';
import { ConfigService } from '../shared/config.service';
import { SecurityGroup } from './security-group.model';
import { BaseBackendService } from '../shared/services/base-backend.service';
import { BackendResource } from '../shared/decorators/backend-resource.decorator';

@Injectable()
@BackendResource({
  entity: 'SecurityGroup',
  entityModel: SecurityGroup
})
export class SecurityGroupService extends BaseBackendService<SecurityGroup> {

  constructor(private configService: ConfigService) {
    super();
  }

  public getTemplates(): Promise<Array<SecurityGroup>> {
    return this.configService.get('securityGroupTemplates')
      .then(groups => {
        for (let i = 0; i< groups.length; i++) {
          groups[i] = new SecurityGroup(groups[i]);
        }
        return groups;
      });
  }
}
