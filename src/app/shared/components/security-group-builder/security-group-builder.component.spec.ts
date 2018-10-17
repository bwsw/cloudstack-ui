import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { MockTranslatePipe } from '../../../../testutils/mocks/mock-translate.pipe.spec';
import { NetworkProtocol, NetworkRule } from '../../../security-group/network-rule.model';
import { SecurityGroupService } from '../../../security-group/services/security-group.service';
import { SecurityGroup } from '../../../security-group/sg.model';
import { Rules } from './rules';
import { SecurityGroupBuilderComponent } from './security-group-builder.component';
import { TestStore } from '../../../../testutils/ngrx-test-store';

describe('Sg creation component', () => {
  let f;
  let comp: SecurityGroupBuilderComponent;
  let store: TestStore<any>;

  const dialogReferenceMock = {
    close(): void {},
  };

  const mockSg1: SecurityGroup = {
    id: '771ebeac-67cb-47a3-a49a-9b96ca0643b4',
    account: 'account',
    description: 'desc',
    domain: 'ROOT',
    domainid: 'id',
    name: 'eeae63c7-1c0e-4ecd-b4a2-505a167b28be-cs-sg',
    ingressrule: [
      {
        ruleid: 'f7c27f7b-2f3b-4665-8333-89b5aae926e6',
        protocol: NetworkProtocol.UDP,
        startport: 1,
        endport: 65535,
        cidr: '0.0.0.0/0',
      },
    ],
    egressrule: [
      {
        ruleid: 'a81906bd-1eca-4e9d-889b-c426e0182807',
        protocol: NetworkProtocol.ICMP,
        icmptype: -1,
        icmpcode: -1,
        cidr: '0.0.0.0/0',
      },
    ],
    virtualmachinecount: 0,
    virtualmachineids: [],
    tags: [],
  };

  const mockSg2: SecurityGroup = {
    id: 'ccc27528-a753-40f2-a512-670fcdbc9dc3',
    name: '0210dc28-999f-4b2a-9fe4-bc4a58260a3a-cs-sg',
    account: 'account',
    description: 'desc',
    domain: 'ROOT',
    domainid: 'id',
    ingressrule: [
      {
        ruleid: 'f22c9314-a33e-406c-8723-370631363802',
        protocol: NetworkProtocol.TCP,
        startport: 1,
        endport: 65535,
        cidr: '0.0.0.0/0',
      },
    ],
    egressrule: [
      {
        ruleid: '55a564b6-ad19-4130-b9a1-9f353930864a',
        protocol: NetworkProtocol.TCP,
        startport: 1,
        endport: 65535,
        cidr: '0.0.0.0/0',
      },
    ],
    virtualmachinecount: 0,
    virtualmachineids: [],
    tags: [],
  };

  const mockRulesIngress: NetworkRule[] = [
    {
      ruleid: 'f22c9314-a33e-406c-8723-370631363802',
      protocol: NetworkProtocol.TCP,
      startport: 1,
      endport: 65535,
      cidr: '0.0.0.0/0',
    },
  ];

  const mockRuleEgress: NetworkRule[] = [
    {
      ruleid: '55a564b6-ad19-4130-b9a1-9f353930864a',
      protocol: NetworkProtocol.TCP,
      startport: 1,
      endport: 65535,
      cidr: '0.0.0.0/0',
    },
  ];

  const mockRules = new Rules();

  class SecurityGroupServiceMock {
    public getList(): Observable<SecurityGroup[]> {
      return of([mockSg2]);
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SecurityGroupBuilderComponent, MockTranslatePipe],
      providers: [
        { provide: MatDialogRef, useFactory: () => dialogReferenceMock },
        { provide: SecurityGroupService, useClass: SecurityGroupServiceMock },
        { provide: Store, useClass: TestStore },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    TestBed.compileComponents().then(() => {
      f = TestBed.createComponent(SecurityGroupBuilderComponent);
      comp = f.componentInstance;
      comp.inputRules = mockRules;
    });

    store = TestBed.get(Store);
  }));

  it('inits rules', () => {
    store.setState([mockSg1]);
    comp.ngOnInit();

    expect(comp.securityGroups.available).toEqual([mockSg1, mockSg2]);
    expect(comp.securityGroups.selected.length).toBe(0);
    expect(comp.selectedRules.ingress.length).toBe(0);
    expect(comp.selectedRules.egress.length).toBe(0);

    f = TestBed.createComponent(SecurityGroupBuilderComponent);
    comp = f.componentInstance;
    comp.inputRules = mockRules;
    mockRules.templates = [mockSg1];
    store.setState([mockSg1]);
    comp.ngOnInit();
    expect(comp.securityGroups.available).toEqual([mockSg2]);
    expect(comp.securityGroups.selected).toEqual([mockSg1]);
    expect(comp.selectedRules.ingress.length).toBe(mockSg1.ingressrule.length);
    expect(comp.selectedRules.egress.length).toBe(mockSg1.egressrule.length);
    expect(comp.selectedRules.ingress.every(rule => !rule.checked));
    expect(comp.selectedRules.egress.every(rule => !rule.checked));

    f = TestBed.createComponent(SecurityGroupBuilderComponent);
    comp = f.componentInstance;
    comp.inputRules = mockRules;
    mockRules.templates = [mockSg2];
    mockRules.egress = mockRuleEgress;
    mockRules.ingress = mockRulesIngress;
    comp.ngOnInit();
    expect(comp.securityGroups.available).toEqual([mockSg1]);
    expect(comp.securityGroups.selected).toEqual([mockSg2]);
    expect(comp.selectedRules.ingress.length).toBe(mockSg2.ingressrule.length);
    expect(comp.selectedRules.egress.length).toBe(mockSg2.egressrule.length);
    expect(comp.selectedRules.ingress[0].checked).toBe(true);
    expect(comp.selectedRules.egress[0].checked).toBe(true);
  });

  it('handles dialog close', () => {
    store.setState([]);
    spyOn(dialogReferenceMock, 'close').and.callThrough();

    mockRules.templates = [mockSg2];
    mockRules.egress = mockRuleEgress;
    mockRules.ingress = mockRulesIngress;
    comp.ngOnInit();

    comp.selectGroup(0, false);
    comp.moveLeft();

    f = TestBed.createComponent(SecurityGroupBuilderComponent);
    comp = f.componentInstance;
    comp.inputRules = mockRules;
    mockRules.templates = [mockSg2];
    mockRules.egress = mockRuleEgress;
    mockRules.ingress = mockRulesIngress;
    comp.ngOnInit();
    comp.selectGroup(0, false);
    comp.moveLeft();
    expect(comp.rules).toEqual(new Rules([], [], []));
  });
});
