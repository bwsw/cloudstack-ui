import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MdlModule } from '@angular-mdl/core';
import { Observable } from 'rxjs/Observable';

import { MockTranslatePipe } from '../../../testutils/mocks/mock-translate.pipe.spec';
import { Rules } from '../../security-group/sg-creation/sg-creation.component';
import { NetworkRule, SecurityGroup } from '../../security-group/sg.model';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { SgRulesManagerComponent } from './';
import { FancySelectComponent } from './fancy-select/fancy-select.component';


const mockSg = new SecurityGroup({
  'id': '771ebeac-67cb-47a3-a49a-9b96ca0643b4',
  'name': 'eeae63c7-1c0e-4ecd-b4a2-505a167b28be-cs-sg',
  'account': 'develop',
  'domainid': 'eee2a0bc-a272-11e6-88da-6557869a736f',
  'domain': 'ROOT',
  'ingressrule': [
    {
      'ruleid': 'f7c27f7b-2f3b-4665-8333-89b5aae926e6',
      'protocol': 'udp',
      'startport': 1,
      'endport': 65535,
      'cidr': '0.0.0.0/0',
    },
    {
      'ruleid': '2ae27d8c-973d-4636-922d-7e9d404c2633',
      'protocol': 'icmp',
      'icmptype': -1,
      'icmpcode': -1,
      'cidr': '0.0.0.0/0',
    },
    {
      'ruleid': '2830a644-c860-4562-aa7a-052d33c856bb',
      'protocol': 'tcp',
      'startport': 1,
      'endport': 65535,
      'cidr': '0.0.0.0/0',
    }
  ],
  'egressrule': [
    {
      'ruleid': '9932b4ee-3201-4cf5-97e3-ccf76ec0a0e9',
      'protocol': 'udp',
      'startport': 1,
      'endport': 65535,
      'cidr': '0.0.0.0/0',
    },
    {
      'ruleid': 'a81906bd-1eca-4e9d-889b-c426e0182807',
      'protocol': 'icmp',
      'icmptype': -1,
      'icmpcode': -1,
      'cidr': '0.0.0.0/0',
    },
    {
      'ruleid': '3534384a-ad09-461b-b2a0-f33200ee6045',
      'protocol': 'tcp',
      'startport': 1,
      'endport': 65535,
      'cidr': '0.0.0.0/0',
    }
  ],
  'virtualmachinecount': 0,
  'virtualmachineids': []
});

const mockIngressRules = [new NetworkRule({
  ruleId: 'f7c27f7b-2f3b-4665-8333-89b5aae926e6',
  protocol: 'udp',
  startPort: 1,
  endPort: 65535,
  CIDR: '0.0.0.0/0'
})];

const mockEgressRules = [new NetworkRule({
  ruleId: '9932b4ee-3201-4cf5-97e3-ccf76ec0a0e9',
  protocol: 'udp',
  startPort: 1,
  endPort: 65535,
  CIDR: '0.0.0.0/0'
})];

class MockDialogService {
  public showCustomDialog(): Observable<any> {
    return Observable.of({
      onHide: () => Observable.of(
        new Rules(
          [mockSg],
          mockIngressRules,
          mockEgressRules
        )
      )
    });
  }
}

describe('Sg Rules manager component', () => {
  let f;
  let comp;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SgRulesManagerComponent,
        MockTranslatePipe,
        FancySelectComponent
      ],
      providers: [
        { provide: DialogService, useClass: MockDialogService },
      ],
      imports: [MdlModule]
    });

    TestBed.compileComponents().then(() => {
      f = TestBed.createComponent(SgRulesManagerComponent);
      comp = f.componentInstance;
    });
  }));

  it('sets mode correctly', () => {
    comp.ngOnInit();
    expect(comp.mode).toBe('create');
    f.detectChanges();
    expect(f.debugElement.children.length).toBe(1);

    f = TestBed.createComponent(SgRulesManagerComponent);
    comp = f.componentInstance;
    comp.mode = 'edit';
    comp.ngOnInit();
    expect(comp.mode).toBe('edit');
    f.detectChanges();
    expect(f.debugElement.children.length).toBe(0);
  });

  it('shows dialog', () => {
    const dialogService = TestBed.get(DialogService);
    spyOn(dialogService, 'showCustomDialog').and.callThrough();
    f.detectChanges();
    f.debugElement.query(By.css('mdl-button')).triggerEventHandler('click');

    expect(dialogService.showCustomDialog).toHaveBeenCalled();
  });

  it('updates rules', () => {
    const emptyRules = new Rules();
    expect(comp.savedRules).toEqual(emptyRules);
    expect(comp.rules).toBeUndefined();

    const dialogService = TestBed.get(DialogService);
    spyOn(dialogService, 'showCustomDialog').and.callThrough();
    f.detectChanges();
    f.debugElement.query(By.css('mdl-button')).triggerEventHandler('click');

    const expectedSavedRules = new Rules([mockSg], mockIngressRules, mockEgressRules);
    expect(comp.savedRules).toEqual(expectedSavedRules);
    expect(comp.rules).toEqual(expectedSavedRules);
  });

  it('sets rules using ngModel', fakeAsync(() => {
    f.detectChanges();
    const expectedSavedRules = new Rules([mockSg], mockIngressRules, mockEgressRules);
    comp.writeValue(expectedSavedRules);

    tick();
    f.detectChanges();
    expect(comp.savedRules).toEqual(expectedSavedRules);
    expect(comp.rules).toEqual(expectedSavedRules);
  }));
});
