import { Component, Injectable, ViewChild } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatSelectModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DynamicModule } from 'ng-dynamic-component';
import { Observable } from 'rxjs/Observable';
import { MockDialogService } from '../../../testutils/mocks/mock-dialog.service';
import { MockNotificationService } from '../../../testutils/mocks/mock-notification.service';
import { MockTranslatePipe } from '../../../testutils/mocks/mock-translate.pipe.spec';
import { MockTranslateService } from '../../../testutils/mocks/mock-translate.service.spec';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { DraggableSelectModule } from '../../shared/components/draggable-select/draggable-select.module';
import { GroupedListComponent } from '../../shared/components/grouped-list/grouped-list.component';
import { LoadingDirective } from '../../shared/directives/loading.directive';
import { ICMPtypes, ICMPv6Types } from '../../shared/icmp/icmp-types';
import { NotificationService } from '../../shared/services/notification.service';
import { NetworkProtocol, NetworkRule } from '../network-rule.model';
import { NetworkRuleService } from '../services/network-rule.service';
import { IPVersion, NetworkRuleType, SecurityGroup } from '../sg.model';
import { SgRuleComponent } from './sg-rule.component';
import { SgRulesComponent } from './sg-rules.component';

const securityGroupTemplates: Array<Object> = require(
  '../../../testutils/mocks/model-services/fixtures/securityGroupTemplates.json');

@Injectable()
class MockRouter {
  public navigate(route: any): Promise<any> {
    return Promise.resolve(route);
  }
}

const mockSecurityGroup = <SecurityGroup>{
  id: 'sg-id1',
  name: 'test',
  description: '',
  account: 'develop',
  domain: 'ROOT',
  ingressrule: [],
  egressrule: [],
  tags: [],
  virtualmachineids: []
};

const mockSecurityGroupWithRules = <SecurityGroup>{
  id: '9d1f0e3b-82a7-4528-b02e-70c4f9eff4b0',
  name: 'test',
  description: '',
  account: 'develop',
  domain: 'ROOT',
  virtualmachineids: [],
  egressrule: [],
  ingressrule: [
    <NetworkRule>{
      ruleid: 'ed4a91f5-35f2-48a3-b706-6a00dba50708',
      protocol: NetworkProtocol.ICMP,
      icmptype: 3,
      icmpCode: 2,
      cidr: '2001:DB8::/128',
      tags: []
    },
    <NetworkRule>{
      ruleid: '293a8e35-7c26-4216-851e-c87a46c9620f',
      protocol: NetworkProtocol.TCP,
      startport: 0,
      endport: 65535,
      cidr: '2001:DB8::/128',
      tags: []
    },
    <NetworkRule>{
      ruleid: 'af34ea6c-dd50-4cab-9f5e-ca4e454e59d3',
      protocol: NetworkProtocol.ICMP,
      icmptype: 2,
      icmpcode: 0,
      cidr: '2001:DB8::/128',
      tags: []
    },
    <NetworkRule>{
      ruleid: '41ce53d6-5274-49b0-a2e9-7b0ebc87c89a',
      protocol: NetworkProtocol.ICMP,
      icmptype: 132,
      icmpcode: 0,
      cidr: '2001:DB8::/128',
      tags: []
    },
    <NetworkRule>{
      ruleid: '02990ed4-827f-49a1-bb27-4ea6d565c1fd',
      protocol: NetworkProtocol.ICMP,
      icmptype: 4,
      icmpcode: 1,
      cidr: '2001:DB8::/128',
      tags: []
    },
    <NetworkRule>{
      ruleid: '787ee1c9-ec5f-4612-9894-1080acec515e',
      protocol: NetworkProtocol.ICMP,
      icmptype: 0,
      icmpcode: 0,
      cidr: '0.0.0.0/0',
      tags: []
    }
  ],
  tags: [],
  virtualMachinesCount: 0,
  virtualMachineIds: []
};

const mockNetworkRule = <NetworkRule>{
  ruleid: 'nr-id1',
  protocol: NetworkProtocol.UDP,
  startport: 1,
  endport: 65535,
  cidr: '0.0.0.0/0'
};

const mockNetworkICMPRule = <NetworkRule>{
  ruleid: 'nr-id1',
  protocol: NetworkProtocol.ICMP,
  startport: 1,
  endport: 65535,
  cidr: '0.0.0.0/0'
};

@Component({
  selector: 'cs-test',
  template: `
    <cs-security-group-rules
      [securityGroup]="securityGroup"
      [editMode]="editMode"
      [vmId]="vmId"
      (onFirewallRulesChange)="changeSG($event)"
    ></cs-security-group-rules>
  `
})
class TestComponent {
  @ViewChild(SgRulesComponent) public sgRulesComponent: SgRulesComponent;
  public securityGroup: SecurityGroup;
  public editMode = false;
  public vmId = 'vm-id1';

  public changeSG(sg: SecurityGroup) {
    this.securityGroup = sg;
  }
}

describe('Security group firewall rules component', () => {
  let component;
  let fixture;
  let networkRuleService: NetworkRuleService;
  let notificationService: NotificationService;
  let dialogService: DialogService;
  let router: Router;

  const dialog = jasmine.createSpyObj('MdDialogRef', ['close']);

  class NetworkRuleServiceMock {
    public addRule(type: NetworkRuleType, data): Observable<NetworkRule> {
      return Observable.of(mockNetworkRule);
    }

    public removeRule(type: NetworkRuleType, data): Observable<null> {
      return Observable.of(null);
    }

    public removeDuplicateRules(rules: Array<NetworkRule>): Array<NetworkRule> {
      return [];
    }
  }

  function createTestComponent() {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    component.securityGroup = mockSecurityGroup;
    return { fixture, component };
  }

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatAutocompleteModule,
        DynamicModule.withComponents([SgRuleComponent]),
        MatListModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        DraggableSelectModule,
        BrowserAnimationsModule
      ],
      declarations: [
        TestComponent,
        GroupedListComponent,
        SgRulesComponent,
        SgRuleComponent,
        MockTranslatePipe,
        LoadingDirective
      ],
      providers: [
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: Router, useClass: MockRouter },
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: NetworkRuleService, useClass: NetworkRuleServiceMock },
        { provide: DialogService, useClass: MockDialogService }
      ]
    }).compileComponents();

    networkRuleService = TestBed.get(NetworkRuleService);
    notificationService = TestBed.get(NotificationService);
    dialogService = TestBed.get(DialogService);
    router = TestBed.get(Router);

  }));

  it('should init component and inputs', async(async () => {
    const { fixture } = createTestComponent();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.sgRulesComponent.adding).toBeFalsy();
    expect(component.sgRulesComponent.protocol).toEqual(NetworkProtocol.TCP);
    expect(component.sgRulesComponent.type).toEqual(NetworkRuleType.Ingress);
    expect(component.sgRulesComponent.securityGroup).toEqual(mockSecurityGroup);
    expect(component.sgRulesComponent.vmId).toEqual('vm-id1');
  }));

  it('filter network rules by IP version, type or protocol', () => {
    component.sgRulesComponent.securityGroup = mockSecurityGroupWithRules;
    component.sgRulesComponent.ngOnChanges();

    expect(component.sgRulesComponent.visibleRules.length).toEqual(6);

    component.sgRulesComponent.selectedIPVersion = [IPVersion.ipv6];
    component.sgRulesComponent.filter();
    expect(component.sgRulesComponent.visibleRules.length).toEqual(5);

    component.sgRulesComponent.selectedType = [NetworkRuleType.Ingress];
    component.sgRulesComponent.filter();
    expect(component.sgRulesComponent.visibleRules.length).toEqual(5);
    component.sgRulesComponent.selectedIPVersion = [];
    component.sgRulesComponent.selectedType = [];
    component.sgRulesComponent.filter();
    expect(component.sgRulesComponent.visibleRules.length).toEqual(6);

    component.sgRulesComponent.selectedProtocols = [NetworkProtocol.ICMP];
    component.sgRulesComponent.filter();
    expect(component.sgRulesComponent.visibleRules.length).toEqual(5);
  });

  it('should filter predefined templates', async(() => {
    component.sgRulesComponent.securityGroup = securityGroupTemplates[0];
    expect(component.sgRulesComponent.isPredefinedTemplate).toBeTruthy();
    component.sgRulesComponent.securityGroup = mockSecurityGroupWithRules;
    expect(component.sgRulesComponent.isPredefinedTemplate).toBeFalsy();
  }));

  it('should select types by CIDR IP version', async(() => {
    component.sgRulesComponent.cidr = '2001:DB8::/128';
    component.sgRulesComponent.onCidrChange();
    expect(component.sgRulesComponent.icmpTypes).toEqual(ICMPv6Types);
  }));

  it('should change view or edit mode', async(() => {
    component.sgRulesComponent.editMode = false;
    component.sgRulesComponent.securityGroup = securityGroupTemplates[0];
    component.sgRulesComponent.confirmChangeMode();
    expect(component.sgRulesComponent.editMode).toBeTruthy();
  }));

  it('should add new ingress rule', async(async () => {
    const { fixture } = createTestComponent();
    const spyEmit = spyOn(component.sgRulesComponent, 'emitChanges').and.callThrough();
    const spyRest = spyOn(component.sgRulesComponent, 'resetForm').and.callThrough();

    await fixture.whenStable();
    fixture.detectChanges();

    component.sgRulesComponent.startPort = 1;
    component.sgRulesComponent.endPort = 3;
    fixture.detectChanges();

    component.sgRulesComponent.addRule(new Event('click'));
    fixture.detectChanges();
    expect(spyEmit).toHaveBeenCalled();
    expect(spyRest).toHaveBeenCalled();
    expect(component.sgRulesComponent.ingressRules).toEqual([mockNetworkRule]);
  }));

  it('should add new egress rule', async(async () => {
    const { fixture } = createTestComponent();
    const spyEmit = spyOn(component.sgRulesComponent, 'emitChanges').and.callThrough();
    const spyRest = spyOn(component.sgRulesComponent, 'resetForm').and.callThrough();

    await fixture.whenStable();
    fixture.detectChanges();

    component.sgRulesComponent.startPort = 1;
    component.sgRulesComponent.endPort = 3;
    component.sgRulesComponent.type = NetworkRuleType.Egress;
    fixture.detectChanges();

    component.sgRulesComponent.addRule(new Event('click'));
    fixture.detectChanges();
    expect(spyEmit).toHaveBeenCalled();
    expect(spyRest).toHaveBeenCalled();
    expect(component.sgRulesComponent.egressRules).toEqual([mockNetworkRule]);
  }));

  it('should add new egress ICMP-type rule', async(async () => {
    const { fixture } = createTestComponent();
    const spyEmit = spyOn(component.sgRulesComponent, 'emitChanges').and.callThrough();
    const spyRest = spyOn(component.sgRulesComponent, 'resetForm').and.callThrough();
    const spyAdd = spyOn(networkRuleService, 'addRule').and
      .returnValue(Observable.of(mockNetworkICMPRule));

    await fixture.whenStable();
    fixture.detectChanges();

    component.sgRulesComponent.icmpType = 1;
    component.sgRulesComponent.icmpCode = 3;
    component.sgRulesComponent.type = NetworkRuleType.Egress;
    component.sgRulesComponent.protocol = NetworkProtocol.ICMP;
    fixture.detectChanges();

    component.sgRulesComponent.addRule(new Event('click'));
    fixture.detectChanges();
    expect(spyEmit).toHaveBeenCalled();
    expect(spyRest).toHaveBeenCalled();
    expect(component.sgRulesComponent.egressRules).toEqual([mockNetworkICMPRule]);
  }));

  it('should return an error during adding new rule', async(async () => {
    const { fixture } = createTestComponent();
    const spyEmit = spyOn(component.sgRulesComponent, 'emitChanges');
    const spyRest = spyOn(component.sgRulesComponent, 'resetForm');
    const spyAdd = spyOn(networkRuleService, 'addRule').and
      .returnValue(Observable.throw(new Error('Error occurred!')));

    await fixture.whenStable();
    fixture.detectChanges();
    component.sgRulesComponent.addRule(new Event('click'));
    fixture.detectChanges();
    expect(spyEmit).not.toHaveBeenCalled();
    expect(spyRest).not.toHaveBeenCalled();
  }));

  it('should remove egress rule', async(async () => {
    const { fixture } = createTestComponent();
    const spyEmit = spyOn(component.sgRulesComponent, 'emitChanges').and.callThrough();
    const spyRemove = spyOn(networkRuleService, 'removeRule').and
      .returnValue(Observable.of(null));

    await fixture.whenStable();
    fixture.detectChanges();

    component.sgRulesComponent.egressRules = [mockNetworkRule];
    fixture.detectChanges();

    component.sgRulesComponent.removeRule({ type: NetworkRuleType.Egress, id: 'nr-id1' });
    fixture.detectChanges();
    expect(spyEmit).toHaveBeenCalled();
    expect(component.sgRulesComponent.egressRules).toEqual([]);
  }));

  it('should remove ingress rule twice', async(async () => {
    const { fixture } = createTestComponent();
    const spyEmit = spyOn(component.sgRulesComponent, 'emitChanges').and.callThrough();
    const spyRemove = spyOn(networkRuleService, 'removeRule').and
      .returnValue(Observable.of(null));

    await fixture.whenStable();
    fixture.detectChanges();

    component.sgRulesComponent.ingressRules = [mockNetworkRule];
    fixture.detectChanges();

    component.sgRulesComponent.removeRule({
      type: NetworkRuleType.Ingress,
      id: 'nr-id1'
    });
    fixture.detectChanges();
    expect(spyEmit).toHaveBeenCalled();
    expect(component.sgRulesComponent.ingressRules).toEqual([]);
    component.sgRulesComponent.removeRule({
      type: NetworkRuleType.Ingress,
      id: 'nr-id1'
    });
    fixture.detectChanges();
    expect(spyEmit).toHaveBeenCalledTimes(1);
  }));

  it('should return an error during removing rule', async(async () => {
    const { fixture } = createTestComponent();
    const spyEmit = spyOn(component.sgRulesComponent, 'emitChanges');
    const spyMessage = spyOn(notificationService, 'message');
    const spyRemove = spyOn(networkRuleService, 'removeRule').and
      .returnValue(Observable.throw(new Error('Error occurred!')));

    await fixture.whenStable();
    fixture.detectChanges();
    component.sgRulesComponent.removeRule({
      type: NetworkRuleType.Ingress,
      id: 'nr-id1'
    });
    fixture.detectChanges();
    expect(spyEmit).not.toHaveBeenCalled();
    expect(spyMessage).toHaveBeenCalled();

  }));

  it('should filter lists of ICMP types and codes (1)', async(async () => {
    const { fixture } = createTestComponent();
    await fixture.whenStable();
    fixture.detectChanges();

    const filteredTypes = component.sgRulesComponent.filterTypes('-1');
    expect(filteredTypes.length).toEqual(1);

    component.sgRulesComponent.selectedType = filteredTypes[0].type.toString();
    component.sgRulesComponent.setIcmpTypes(filteredTypes);
    const filteredCodes = component.sgRulesComponent.filterCodes('-1');
    expect(filteredCodes.length).toEqual(1);

    component.sgRulesComponent.selectedCode = filteredCodes[0].toString();
    component.sgRulesComponent.setIcmpCodes(component.sgRulesComponent.selectedCode);
    expect(component.sgRulesComponent.icmpType).toEqual(-1);
    expect(component.sgRulesComponent.icmpCode).toEqual(-1);
  }));

  it('should filter lists of ICMP types and codes (2)', async(async () => {
    const { fixture } = createTestComponent();
    await fixture.whenStable();
    fixture.detectChanges();

    const filteredTypes = component.sgRulesComponent.filterTypes(3);
    expect(filteredTypes.length).toEqual(12);

    component.sgRulesComponent.selectedType = 3;
    component.sgRulesComponent.setIcmpTypes(filteredTypes);
    expect(component.sgRulesComponent.icmpCodes).toEqual(ICMPtypes[2].codes);

    const filteredCodes = component.sgRulesComponent.filterCodes(15);
    expect(filteredCodes.length).toEqual(1);

    component.sgRulesComponent.selectedCode = 15;
    component.sgRulesComponent.setIcmpCodes(filteredCodes);
    expect(component.sgRulesComponent.icmpType).toEqual(3);
    expect(component.sgRulesComponent.icmpCode).toEqual(15);
  }));

  it('should filter lists of ICMP types and codes (3)', async(async () => {
    const { fixture } = createTestComponent();
    await fixture.whenStable();
    fixture.detectChanges();

    const filteredTypes = component.sgRulesComponent.filterTypes('');
    expect(filteredTypes).toEqual(ICMPtypes);

    component.sgRulesComponent.icmpType = 3;
    const filteredCodes = component.sgRulesComponent.filterCodes('');
    expect(filteredCodes).toEqual(ICMPtypes[2].codes);
  }));

  it('should change mode (with vmId)', async(async () => {
    const { fixture } = createTestComponent();
    await fixture.whenStable();
    fixture.detectChanges();

    component.sgRulesComponent.editMode = false;
    spyOn(dialogService, 'confirm').and.returnValue(Observable.of(true));
    const spyRouter = spyOn(router, 'navigate');
    const spyRest = spyOn(component.sgRulesComponent, 'resetFilters');
    component.sgRulesComponent.confirmChangeMode();
    expect(spyRouter).toHaveBeenCalledWith([
      'security-group', 'sg-id1', 'rules'
    ], {
      queryParams: { vm: 'vm-id1' }
    });
    expect(spyRest).not.toHaveBeenCalled();
  }));

  it('should change mode (without vmId)', async(async () => {
    const { fixture } = createTestComponent();
    await fixture.whenStable();
    fixture.detectChanges();

    component.sgRulesComponent.editMode = false;
    component.sgRulesComponent.vmId = null;
    spyOn(dialogService, 'confirm').and.returnValue(Observable.of(true));
    const spyRest = spyOn(component.sgRulesComponent, 'resetFilters').and.callThrough();
    const spyRouter = spyOn(router, 'navigate');
    component.sgRulesComponent.confirmChangeMode();
    expect(spyRouter).not.toHaveBeenCalled();
    expect(spyRest).toHaveBeenCalled();
  }));

  it('should not change mode', async(async () => {
    const { fixture } = createTestComponent();
    await fixture.whenStable();
    fixture.detectChanges();

    component.sgRulesComponent.editMode = false;
    spyOn(dialogService, 'confirm').and.returnValue(Observable.of(false));
    const spyRest = spyOn(component.sgRulesComponent, 'resetFilters');
    component.sgRulesComponent.confirmChangeMode();
    expect(spyRest).not.toHaveBeenCalled();
  }));

  it('should change mode', async(async () => {
    const { fixture } = createTestComponent();
    await fixture.whenStable();
    fixture.detectChanges();

    component.sgRulesComponent.editMode = true;
    const spyDialog = spyOn(dialogService, 'confirm');
    const spyRest = spyOn(component.sgRulesComponent, 'resetFilters');
    component.sgRulesComponent.confirmChangeMode();
    expect(spyRest).toHaveBeenCalled();
    expect(spyDialog).not.toHaveBeenCalled();
  }));

  it('should update attributes', async(async () => {
    const { fixture } = createTestComponent();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.sgRulesComponent.securityGroup).toEqual(mockSecurityGroup);
    expect(component.sgRulesComponent.ingressRules).toEqual([]);
    expect(component.sgRulesComponent.egressRules).toEqual([]);
    component.securityGroup = Object.assign({}, mockSecurityGroup, {
      ingressrule: [mockNetworkRule]
    });
    fixture.detectChanges();
    expect(component.sgRulesComponent.ingressRules)
      .toEqual([Object.assign({}, mockNetworkRule, { type: NetworkRuleType.Ingress })]);
    component.securityGroup = Object.assign({}, mockSecurityGroup, {
      egressrule: [mockNetworkRule]
    });
    fixture.detectChanges();
    expect(component.sgRulesComponent.egressRules)
      .toEqual([Object.assign({}, mockNetworkRule, { type: NetworkRuleType.Egress })]);
  }));

  it('should filter rules by protocol', async(async () => {
    const { fixture } = createTestComponent();
    await fixture.whenStable();
    fixture.detectChanges();
    component.securityGroup = Object.assign({}, mockSecurityGroup, {
      ingressrule: [mockNetworkRule], egressrule: [mockNetworkRule]
    });
    component.sgRulesComponent.selectedProtocols = [NetworkProtocol.UDP];
    fixture.detectChanges();
    expect(component.sgRulesComponent.visibleRules)
      .toEqual([
        ...component.sgRulesComponent.ingressRules,
        ...component.sgRulesComponent.egressRules
      ]);
  }));

  it('should filter rules by type', async(async () => {
    const { fixture } = createTestComponent();
    await fixture.whenStable();
    fixture.detectChanges();
    component.securityGroup = Object.assign({}, mockSecurityGroup, {
      ingressrule: [mockNetworkRule], egressrule: [mockNetworkRule]
    });
    component.sgRulesComponent.selectedTypes = [NetworkRuleType.Egress];
    fixture.detectChanges();
    expect(component.sgRulesComponent.selectedTypes).toEqual([NetworkRuleType.Egress]);
    expect(component.sgRulesComponent.visibleRules)
      .toEqual([
        ...component.sgRulesComponent.egressRules
      ]);
  }));

});
