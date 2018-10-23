import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { MockTranslatePipe } from '../../../../../testutils/mocks/mock-translate.pipe.spec';
import { NetworkProtocol, NetworkRule } from '../../../../security-group/network-rule.model';
import { SecurityGroup } from '../../../../security-group/sg.model';
import { VmCreationSecurityGroupRulesManagerComponent } from './vm-creation-security-group-rules-manager.component';
import { FancySelectComponent } from '../../../../shared/components';
import { Rules } from '../../../../shared/components/security-group-builder/rules';
import { VmCreationSecurityGroupData } from '../../security-group/vm-creation-security-group-data';

const mockSg: SecurityGroup = {
  id: '771ebeac-67cb-47a3-a49a-9b96ca0643b4',
  name: 'eeae63c7-1c0e-4ecd-b4a2-505a167b28be-cs-sg',
  description: 'desc',
  account: 'develop',
  domainid: 'eee2a0bc-a272-11e6-88da-6557869a736f',
  domain: 'ROOT',
  ingressrule: [
    {
      ruleid: 'f7c27f7b-2f3b-4665-8333-89b5aae926e6',
      protocol: NetworkProtocol.UDP,
      startport: 1,
      endport: 65535,
      cidr: '0.0.0.0/0',
    },
    {
      ruleid: '2ae27d8c-973d-4636-922d-7e9d404c2633',
      protocol: NetworkProtocol.ICMP,
      icmptype: -1,
      icmpcode: -1,
      cidr: '0.0.0.0/0',
    },
    {
      ruleid: '2830a644-c860-4562-aa7a-052d33c856bb',
      protocol: NetworkProtocol.TCP,
      startport: 1,
      endport: 65535,
      cidr: '0.0.0.0/0',
    },
  ],
  egressrule: [
    {
      ruleid: '9932b4ee-3201-4cf5-97e3-ccf76ec0a0e9',
      protocol: NetworkProtocol.UDP,
      startport: 1,
      endport: 65535,
      cidr: '0.0.0.0/0',
    },
    {
      ruleid: 'a81906bd-1eca-4e9d-889b-c426e0182807',
      protocol: NetworkProtocol.ICMP,
      icmptype: -1,
      icmpcode: -1,
      cidr: '0.0.0.0/0',
    },
    {
      ruleid: '3534384a-ad09-461b-b2a0-f33200ee6045',
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

const mockIngressRules: NetworkRule[] = [
  {
    ruleid: 'f7c27f7b-2f3b-4665-8333-89b5aae926e6',
    protocol: NetworkProtocol.UDP,
    startport: 1,
    endport: 65535,
    cidr: '0.0.0.0/0',
  },
];

const mockEgressRules: NetworkRule[] = [
  {
    ruleid: '9932b4ee-3201-4cf5-97e3-ccf76ec0a0e9',
    protocol: NetworkProtocol.UDP,
    startport: 1,
    endport: 65535,
    cidr: '0.0.0.0/0',
  },
];

class MockMdDialog {
  public open(): any {
    const rules = new Rules([mockSg], mockIngressRules, mockEgressRules);
    const dialogCloseValue = VmCreationSecurityGroupData.fromRules(rules);

    return {
      afterClosed: () => of(dialogCloseValue),
    };
  }
}

describe('Sg Rules manager component', () => {
  let f;
  let comp: VmCreationSecurityGroupRulesManagerComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        VmCreationSecurityGroupRulesManagerComponent,
        MockTranslatePipe,
        FancySelectComponent,
      ],
      providers: [{ provide: MatDialog, useClass: MockMdDialog }],
      schemas: [NO_ERRORS_SCHEMA],
    });

    TestBed.compileComponents().then(() => {
      f = TestBed.createComponent(VmCreationSecurityGroupRulesManagerComponent);
      comp = f.componentInstance;
    });
  }));

  it('shows dialog', () => {
    const dialog = TestBed.get(MatDialog);
    spyOn(dialog, 'open').and.callThrough();
    f.detectChanges();
    f.debugElement.query(By.css('.fancy-select-button')).triggerEventHandler('click');

    expect(dialog.open).toHaveBeenCalled();
  });

  it('updates rules', () => {
    const emptyRules = new Rules();
    expect(comp.savedData.rules).toEqual(emptyRules);
    expect(comp.securityGroupRulesManagerData).toBeUndefined();

    const dialog = TestBed.get(MatDialog);
    spyOn(dialog, 'open').and.callThrough();
    f.detectChanges();
    f.debugElement.query(By.css('.fancy-select-button')).triggerEventHandler('click');

    const expectedSavedRules = new Rules([mockSg], mockIngressRules, mockEgressRules);
    expect(comp.savedData.rules).toEqual(expectedSavedRules);
    expect(comp.securityGroupRulesManagerData.rules).toEqual(expectedSavedRules);
  });

  it('sets rules using ngModel', fakeAsync(() => {
    f.detectChanges();
    const expectedSavedRules = new Rules([mockSg], mockIngressRules, mockEgressRules);
    comp.writeValue(VmCreationSecurityGroupData.fromRules(expectedSavedRules));

    tick();
    f.detectChanges();
    expect(comp.savedData.rules).toEqual(expectedSavedRules);
    expect(comp.securityGroupRulesManagerData.rules).toEqual(expectedSavedRules);
  }));
});
