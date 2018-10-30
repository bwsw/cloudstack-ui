import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
// tslint:disable-next-line
import { PrivateSecurityGroupCreationService } from '../../../security-group/services/creation-services/private-security-group-creation.service';
// tslint:disable-next-line
import { SharedSecurityGroupCreationService } from '../../../security-group/services/creation-services/shared-security-group-creation.service';
// tslint:disable-next-line
import { TemplateSecurityGroupCreationService } from '../../../security-group/services/creation-services/template-security-group-creation.service';
import { NetworkRuleService } from '../../../security-group/services/network-rule.service';
import { SecurityGroupService } from '../../../security-group/services/security-group.service';
import { AsyncJobService } from '../../../shared/services/async-job.service';
import { SecurityGroupTagService } from '../../../shared/services/tags/security-group-tag.service';
import { TagService } from '../../../shared/services/tags/tag.service';
import { VmCreationSecurityGroupService } from './vm-creation-security-group.service';

describe('VM creation security group service', () => {
  let vmCreationSecurityGroupService: VmCreationSecurityGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SecurityGroupService,
        VmCreationSecurityGroupService,
        TemplateSecurityGroupCreationService,
        PrivateSecurityGroupCreationService,
        SharedSecurityGroupCreationService,
        SecurityGroupTagService,
        TagService,
        AsyncJobService,
        NetworkRuleService,
      ],
      imports: [HttpClientTestingModule],
    });
    vmCreationSecurityGroupService = TestBed.get(VmCreationSecurityGroupService);
  });

  it('should assign VM name to the private security group', () => {
    const result = vmCreationSecurityGroupService['securityGroupCreationData']('new-vm');
    expect(result.name).toBe('sg-new-vm');
  });
});
