import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { MockTranslatePipe } from '../../../../testutils/mocks/mock-translate.pipe.spec';
import { NetworkRule } from '../../../security-group/network-rule.model';
import { SecurityGroupService } from '../../../security-group/services/security-group.service';
import { SecurityGroup } from '../../../security-group/sg.model';
import { Rules } from './rules';
import { SecurityGroupBuilderComponent } from './security-group-builder.component';


describe('Sg creation component', () => {
  let f;
  let comp: SecurityGroupBuilderComponent;

  const dialogReferenceMock = {
    close(): void {}
  };

  const mockSg1 = new SecurityGroup({
    'id': '771ebeac-67cb-47a3-a49a-9b96ca0643b4',
    'name': 'eeae63c7-1c0e-4ecd-b4a2-505a167b28be-cs-sg',
    'ingressrule': [{
      'ruleid': 'f7c27f7b-2f3b-4665-8333-89b5aae926e6',
      'protocol': 'udp',
      'startport': 1,
      'endport': 65535,
      'cidr': '0.0.0.0/0',
    }],
    'egressrule': [{
      'ruleid': 'a81906bd-1eca-4e9d-889b-c426e0182807',
      'protocol': 'icmp',
      'icmptype': -1,
      'icmpcode': -1,
      'cidr': '0.0.0.0/0',
    }]
  });

  const mockSg2 = new SecurityGroup({
    'id': 'ccc27528-a753-40f2-a512-670fcdbc9dc3',
    'name': '0210dc28-999f-4b2a-9fe4-bc4a58260a3a-cs-sg',
    'ingressrule': [{
      'ruleid': 'f22c9314-a33e-406c-8723-370631363802',
      'protocol': 'tcp',
      'startport': 1,
      'endport': 65535,
      'cidr': '0.0.0.0/0',
    }],
    'egressrule': [{
      'ruleid': '55a564b6-ad19-4130-b9a1-9f353930864a',
      'protocol': 'tcp',
      'startport': 1,
      'endport': 65535,
      'cidr': '0.0.0.0/0',
    }]
  });

  const mockRulesIngress = [new NetworkRule({
    'ruleid': 'f22c9314-a33e-406c-8723-370631363802',
    'protocol': 'tcp',
    'startport': 1,
    'endport': 65535,
    'cidr': '0.0.0.0/0',
  })];

  const mockRuleEgress = [new NetworkRule({
    'ruleid': '55a564b6-ad19-4130-b9a1-9f353930864a',
    'protocol': 'tcp',
    'startport': 1,
    'endport': 65535,
    'cidr': '0.0.0.0/0',
  })];

  const mockRules = new Rules();

  class SecurityGroupServiceMock {
    public getPredefinedTemplates(): Array<SecurityGroup> {
      return [mockSg1];
    }

    public getList(): Observable<Array<SecurityGroup>> {
      return Observable.of([mockSg2]);
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SecurityGroupBuilderComponent, MockTranslatePipe],
      providers: [
        { provide: MatDialogRef, useFactory: () => dialogReferenceMock },
        { provide: SecurityGroupService, useClass: SecurityGroupServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    TestBed.compileComponents().then(() => {
      f = TestBed.createComponent(SecurityGroupBuilderComponent);
      comp = f.componentInstance;
      comp.inputRules = mockRules;
    });
  }));

  it('inits rules', () => {
    comp.ngOnInit();

    expect(comp.items[0]).toEqual([mockSg1, mockSg2]);
    expect(comp.items[1].length).toBe(0);
    expect(comp.selectedRules[0].length).toBe(0);
    expect(comp.selectedRules[1].length).toBe(0);

    f = TestBed.createComponent(SecurityGroupBuilderComponent);
    comp = f.componentInstance;
    comp.inputRules = mockRules;
    mockRules.templates = [mockSg1];
    comp.ngOnInit();
    expect(comp.items[0]).toEqual([mockSg2]);
    expect(comp.items[1]).toEqual([mockSg1]);
    expect(comp.selectedRules[0].length).toBe(mockSg1.ingressRules.length);
    expect(comp.selectedRules[1].length).toBe(mockSg1.egressRules.length);
    expect(comp.selectedRules[0].every(rule => !rule.checked));
    expect(comp.selectedRules[1].every(rule => !rule.checked));

    f = TestBed.createComponent(SecurityGroupBuilderComponent);
    comp = f.componentInstance;
    comp.inputRules = mockRules;
    mockRules.templates = [mockSg2];
    mockRules.egress = mockRuleEgress;
    mockRules.ingress = mockRulesIngress;
    comp.ngOnInit();
    expect(comp.items[0]).toEqual([mockSg1]);
    expect(comp.items[1]).toEqual([mockSg2]);
    expect(comp.selectedRules[0].length).toBe(mockSg2.ingressRules.length);
    expect(comp.selectedRules[1].length).toBe(mockSg2.egressRules.length);
    expect(comp.selectedRules[0][0].checked).toBe(true);
    expect(comp.selectedRules[1][0].checked).toBe(true);
  });

  it('handles dialog close', () => {
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
