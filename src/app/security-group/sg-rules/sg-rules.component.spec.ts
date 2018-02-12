import { Injectable, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA, MatAutocompleteModule, MatDialogRef
} from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { MockNotificationService } from '../../../testutils/mocks/mock-notification.service';
import { MockTranslatePipe } from '../../../testutils/mocks/mock-translate.pipe.spec';
import { MockTranslateService } from '../../../testutils/mocks/mock-translate.service.spec';
import { ICMPv6Types } from '../../shared/icmp/icmp-types';
import { NotificationService } from '../../shared/services/notification.service';
import { SecurityGroupService } from '../services/security-group.service';
import { IPVersion, NetworkRuleType, SecurityGroup } from '../sg.model';
import { SgRulesComponent } from './sg-rules.component';
import { NetworkProtocol, NetworkRule } from '../network-rule.model';
import { NetworkRuleService } from '../services/network-rule.service';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { Router } from '@angular/router';
import { LoadingDirective } from '../../shared/directives/loading.directive';

const securityGroupTemplates: Array<Object> = require(
  '../../../testutils/mocks/model-services/fixtures/securityGroupTemplates.json');

@Injectable()
class MockRouter {
  public navigate(route: any): Promise<any> {
    return Promise.resolve(route);
  }
}

describe('Security group firewall rules component', () => {
  let f;
  let comp;

  const mockSecurityGroup = new SecurityGroup({
    id: '9d1f0e3b-82a7-4528-b02e-70c4f9eff4b0',
    name: 'test',
    description: '',
    account: 'develop',
    domain: 'ROOT',
    ingressRules: [],
    tags: [],
    virtualMachinesCount: 0,
    virtualMachineIds: []
  });
  const mockSecurityGroupWithRules = new SecurityGroup({
    id: '9d1f0e3b-82a7-4528-b02e-70c4f9eff4b0',
    name: 'test',
    description: '',
    account: 'develop',
    domain: 'ROOT',
    ingressRules: [
      {
        ruleId: 'ed4a91f5-35f2-48a3-b706-6a00dba50708',
        protocol: 'icmp',
        icmpType: 3,
        icmpCode: 2,
        CIDR: '2001:DB8::/128',
        tags: []
      },
      {
        ruleId: '293a8e35-7c26-4216-851e-c87a46c9620f',
        protocol: 'tcp',
        startPort: 0,
        endPort: 65535,
        CIDR: '2001:DB8::/128',
        tags: []
      },
      {
        ruleId: 'af34ea6c-dd50-4cab-9f5e-ca4e454e59d3',
        protocol: 'icmp',
        icmpType: 2,
        icmpCode: 0,
        CIDR: '2001:DB8::/128',
        tags: []
      },
      {
        ruleId: '41ce53d6-5274-49b0-a2e9-7b0ebc87c89a',
        protocol: 'icmp',
        icmpType: 132,
        icmpCode: 0,
        CIDR: '2001:DB8::/128',
        tags: []
      },
      {
        ruleId: '02990ed4-827f-49a1-bb27-4ea6d565c1fd',
        protocol: 'icmp',
        icmpType: 4,
        icmpCode: 1,
        CIDR: '2001:DB8::/128',
        tags: []
      },
      {
        ruleId: '787ee1c9-ec5f-4612-9894-1080acec515e',
        protocol: 'icmp',
        icmpType: 0,
        icmpCode: 0,
        CIDR: '0.0.0.0/0',
        tags: []
      }
    ],
    tags: [],
    virtualMachinesCount: 0,
    virtualMachineIds: []
  });

  class SecurityGroupServiceMock {
    public getPredefinedTemplates(): Array<SecurityGroup> {
      return [mockSecurityGroup];
    }

    public getList(): Observable<Array<SecurityGroup>> {
      return Observable.of([mockSecurityGroup]);
    }
  }

  class NetworkRuleServiceMock {
    public addRule(type: NetworkRuleType, data): Observable<NetworkRule> {
      return Observable.of(null);
    }

    public removeRule(type: NetworkRuleType, data): Observable<null> {
      return Observable.of(null);
    }

    public removeDuplicateRules(rules: Array<NetworkRule>): Array<NetworkRule> {
      return [];
    }
  }

  beforeEach(async(() => {
    const dialog = jasmine.createSpyObj('MdDialogRef', ['close']);
    const dialogService = jasmine.createSpyObj('DialogService', ['confirm', 'alert']);

    TestBed.configureTestingModule({
      imports: [FormsModule, MatAutocompleteModule],
      declarations: [SgRulesComponent, MockTranslatePipe, LoadingDirective],
      providers: [
        { provide: MatDialogRef, useValue: dialog },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: MAT_DIALOG_DATA, useValue: { securityGroup: mockSecurityGroup } },
        { provide: SecurityGroupService, useClass: SecurityGroupServiceMock },
        { provide: Router, useClass: MockRouter },
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: NetworkRuleService, useClass: NetworkRuleServiceMock },
        { provide: DialogService, useValue: dialogService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    TestBed.compileComponents().then(() => {
      f = TestBed.createComponent(SgRulesComponent);
      comp = f.componentInstance;
    });
  }));

  it('filter lists of ICMP types and codes', async(() => {
    comp.cidr = '::/128';
    const filteredTypes = comp.filterTypes('255');
    expect(filteredTypes.length).toEqual(1);

    comp.selectedType = filteredTypes[0].type.toString();
    comp.setIcmpTypes(filteredTypes);
    const filteredCodes = comp.filterCodes('255');
    expect(filteredCodes.length).toEqual(1);

    comp.selectedCode = filteredCodes[0].toString();
    comp.setIcmpCodes(comp.selectedCode);
    expect(comp.icmpType).toEqual(255);
    expect(comp.icmpCode).toEqual(0);
  }));

  it('filter network rules by IP version, type or protocol', () => {
    comp.securityGroup = mockSecurityGroupWithRules;
    comp.ngOnChanges();

    expect(comp.visibleRules.length).toEqual(6);

    comp.selectedIPVersion = [IPVersion.ipv6];
    comp.filter();
    expect(comp.visibleRules.length).toEqual(5);

    comp.selectedType = [NetworkRuleType.Ingress];
    comp.filter();
    expect(comp.visibleRules.length).toEqual(5);
    comp.selectedIPVersion = [];
    comp.selectedType = [];
    comp.filter();
    expect(comp.visibleRules.length).toEqual(6);

    comp.selectedProtocols = [NetworkProtocol.ICMP];
    comp.filter();
    expect(comp.visibleRules.length).toEqual(5);
  });

  it('should filter predefined templates', async(() => {
    comp.securityGroup = securityGroupTemplates[0];
    expect(comp.isPredefinedTemplate).toBeTruthy();
    comp.securityGroup = mockSecurityGroupWithRules;
    expect(comp.isPredefinedTemplate).toBeFalsy();
  }));

  it('should select types by CIDR IP version', async(() => {
    comp.cidr = '2001:DB8::/128';
    comp.onCidrChange();
    expect(comp.icmpTypes).toEqual(ICMPv6Types);
  }));

  it('should change view or edit mode', async(() => {
    comp.editMode = false;
    comp.securityGroup = securityGroupTemplates[0];
    comp.confirmChangeMode();
    expect(comp.editMode).toBeTruthy();
  }));
});
