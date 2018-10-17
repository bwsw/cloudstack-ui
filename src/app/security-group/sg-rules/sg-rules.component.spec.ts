import { Injectable, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatAutocompleteModule, MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

import { MockSnackBarService } from '../../../testutils/mocks/mock-snack-bar.service';
import { MockTranslatePipe } from '../../../testutils/mocks/mock-translate.pipe.spec';
import { MockTranslateService } from '../../../testutils/mocks/mock-translate.service.spec';
import { SnackBarService } from '../../core/services';
import { SecurityGroupService } from '../services/security-group.service';
import { IPVersion, NetworkRuleType, SecurityGroup, SecurityGroupTemplate } from '../sg.model';
import { SgRulesComponent } from './sg-rules.component';
import { NetworkProtocol } from '../network-rule.model';
import { NetworkRuleService } from '../services/network-rule.service';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { LoadingDirective } from '../../shared/directives/loading.directive';

// tslint:disable-next-line:max-line-length
const securityGroupTemplates: SecurityGroupTemplate[] = require('../../../testutils/mocks/model-services/fixtures/securityGroupTemplates.json');

@Injectable()
class MockRouter {
  public navigate(route: any): Promise<any> {
    return Promise.resolve(route);
  }
}

describe('Security group firewall rules component', () => {
  let f;
  let comp;

  const mockSecurityGroup: SecurityGroup = {
    id: '9d1f0e3b-82a7-4528-b02e-70c4f9eff4b0',
    name: 'test',
    description: '',
    account: 'develop',
    domain: 'ROOT',
    domainid: 'id',
    ingressrule: [],
    egressrule: [],
    tags: [],
    virtualmachinecount: 0,
    virtualmachineids: [],
  };
  const mockSecurityGroupWithRules: SecurityGroup = {
    id: '9d1f0e3b-82a7-4528-b02e-70c4f9eff4b0',
    name: 'test',
    description: '',
    account: 'develop',
    domain: 'ROOT',
    domainid: 'id',
    ingressrule: [
      {
        ruleid: 'ed4a91f5-35f2-48a3-b706-6a00dba50708',
        protocol: NetworkProtocol.ICMP,
        icmptype: 3,
        icmpcode: 2,
        cidr: '2001:DB8::/128',
      },
      {
        ruleid: '293a8e35-7c26-4216-851e-c87a46c9620f',
        protocol: NetworkProtocol.TCP,
        startport: 0,
        endport: 65535,
        cidr: '2001:DB8::/128',
      },
      {
        ruleid: 'af34ea6c-dd50-4cab-9f5e-ca4e454e59d3',
        protocol: NetworkProtocol.ICMP,
        icmptype: 2,
        icmpcode: 0,
        cidr: '2001:DB8::/128',
      },
      {
        ruleid: '41ce53d6-5274-49b0-a2e9-7b0ebc87c89a',
        protocol: NetworkProtocol.ICMP,
        icmptype: 132,
        icmpcode: 0,
        cidr: '2001:DB8::/128',
      },
      {
        ruleid: '02990ed4-827f-49a1-bb27-4ea6d565c1fd',
        protocol: NetworkProtocol.ICMP,
        icmptype: 4,
        icmpcode: 1,
        cidr: '2001:DB8::/128',
      },
      {
        ruleid: '787ee1c9-ec5f-4612-9894-1080acec515e',
        protocol: NetworkProtocol.ICMP,
        icmptype: 0,
        icmpcode: 0,
        cidr: '0.0.0.0/0',
      },
    ],
    egressrule: [],
    tags: [],
    virtualmachinecount: 0,
    virtualmachineids: [],
  };

  class SecurityGroupServiceMock {
    public getList(): Observable<SecurityGroup[]> {
      return of([mockSecurityGroup]);
    }
  }

  class NetworkRuleServiceMock {}

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
        { provide: SnackBarService, useClass: MockSnackBarService },
        { provide: NetworkRuleService, useClass: NetworkRuleServiceMock },
        { provide: DialogService, useValue: dialogService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    TestBed.compileComponents().then(() => {
      f = TestBed.createComponent(SgRulesComponent);
      comp = f.componentInstance;
    });
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

  it('should change view mode for not shared group', async(() => {
    comp.editMode = false;
    comp.inputs = {
      canRemove: true,
    };
    comp.securityGroup = securityGroupTemplates[0];
    comp.confirmChangeMode();
    expect(comp.editMode).toBeTruthy();
  }));
});
