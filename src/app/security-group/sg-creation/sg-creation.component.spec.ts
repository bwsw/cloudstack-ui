import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { MockTranslatePipe } from '../../../testutils/mocks/mock-translate.pipe.spec';

import { SecurityGroupService } from '../../shared/services/security-group.service';
import { NetworkRule, SecurityGroup } from '../sg.model';
import { Rules, SgCreationComponent } from './sg-creation.component';
import { MdlDialogReference } from '../../shared/services/dialog';


describe('Sg creation component', () => {
  let f;
  let comp;

  const dialogReferenceMock = {
    hide(): void {}
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
    public getTemplates(): Observable<Array<SecurityGroup>> {
      return Observable.of([mockSg1]);
    }

    public getList(): Observable<Array<SecurityGroup>> {
      return Observable.of([mockSg2]);
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SgCreationComponent, MockTranslatePipe],
      providers: [
        { provide: MdlDialogReference, useFactory: () => dialogReferenceMock },
        { provide: SecurityGroupService, useClass: SecurityGroupServiceMock },
        { provide: 'rules', useValue: mockRules }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    TestBed.compileComponents().then(() => {
      f = TestBed.createComponent(SgCreationComponent);
      comp = f.componentInstance;
    });
  }));

  it('inits rules', () => {
    comp.ngOnInit();

    expect(comp.items[0]).toEqual([mockSg1, mockSg2]);
    expect(comp.items[1].length).toBe(0);
    expect(comp.selectedRules[0].length).toBe(0);
    expect(comp.selectedRules[1].length).toBe(0);

    f = TestBed.createComponent(SgCreationComponent);
    comp = f.componentInstance;
    mockRules.templates = [mockSg1];
    comp.ngOnInit();
    expect(comp.items[0]).toEqual([mockSg2]);
    expect(comp.items[1]).toEqual([mockSg1]);
    expect(comp.selectedRules[0].length).toBe(mockSg1.ingressRules.length);
    expect(comp.selectedRules[1].length).toBe(mockSg1.egressRules.length);
    expect(comp.selectedRules[0].every(rule => !rule.checked));
    expect(comp.selectedRules[1].every(rule => !rule.checked));

    f = TestBed.createComponent(SgCreationComponent);
    comp = f.componentInstance;
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
    spyOn(dialogReferenceMock, 'hide').and.callThrough();

    mockRules.templates = [mockSg2];
    mockRules.egress = mockRuleEgress;
    mockRules.ingress = mockRulesIngress;
    comp.ngOnInit();

    comp.selectGroup(0, false);
    comp.move(true);

    const buttons = f.debugElement.queryAll(By.css('.mdl-dialog__actions button'));
    buttons[1].triggerEventHandler('click');
    expect(dialogReferenceMock.hide).toHaveBeenCalledTimes(1);
    expect(dialogReferenceMock.hide).toHaveBeenCalledWith(mockRules);

    f = TestBed.createComponent(SgCreationComponent);
    comp = f.componentInstance;
    mockRules.templates = [mockSg2];
    mockRules.egress = mockRuleEgress;
    mockRules.ingress = mockRulesIngress;
    comp.ngOnInit();
    comp.selectGroup(0, false);
    comp.move(true);
    buttons[0].triggerEventHandler('click');
    expect(dialogReferenceMock.hide).toHaveBeenCalledTimes(2);
    expect(dialogReferenceMock.hide).toHaveBeenCalledWith({
      templates: [],
      ingress: [],
      egress: []
    });
  });
});
