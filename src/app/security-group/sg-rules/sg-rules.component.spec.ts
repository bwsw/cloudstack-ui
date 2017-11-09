import { Injectable, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA, MatAutocompleteModule, MatDialogRef,
  MATERIAL_COMPATIBILITY_MODE
} from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { MockNotificationService } from '../../../testutils/mocks/mock-notification.service';
import { MockTranslatePipe } from '../../../testutils/mocks/mock-translate.pipe.spec';
import { MockTranslateService } from '../../../testutils/mocks/mock-translate.service.spec';
import { NotificationService } from '../../shared/services/notification.service';
import { SecurityGroupService } from '../services/security-group.service';
import { NetworkRuleType, SecurityGroup } from '../sg.model';
import { SgRulesComponent } from './sg-rules.component';
import { NetworkRule } from '../network-rule.model';
import { NetworkRuleService } from '../services/network-rule.service';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { Router } from '@angular/router';
import { LoadingDirective } from '../../shared/directives/loading.directive';

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
        { provide: MATERIAL_COMPATIBILITY_MODE, useValue: true },
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

  it('filter lists of ICMP types and codes', () => {
    const filteredTypes = comp.filterTypes('-1');
    expect(filteredTypes.length).toEqual(1);

    comp.selectedType = filteredTypes[0].type.toString();
    comp.setIcmpTypes(filteredTypes);
    const filteredCodes = comp.filterCodes('-1');
    expect(filteredCodes.length).toEqual(1);

    comp.selectedCode = filteredCodes[0].toString();
    comp.setIcmpCodes(comp.selectedCode);
    expect(comp.icmpType).toEqual(-1);
    expect(comp.icmpCode).toEqual(-1);
  });
});
