import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { MockTranslatePipe } from '../../../../../testutils/mocks/mock-translate.pipe.spec';
import { MockTranslateService } from '../../../../../testutils/mocks/mock-translate.service.spec';
import { NetworkRule } from '../../../../security-group/network-rule.model';
import { RuleListItem } from '../security-group-builder.component';
import { SecurityGroupBuilderRuleComponent } from './security-group-builder-rule.component';


describe('Sg creation rule component', () => {
  let f;
  let comp;

  const mockRuleItem: RuleListItem = {
    checked: false,
    rule: new NetworkRule({
      'ruleid': 'f7c27f7b-2f3b-4665-8333-89b5aae926e6',
      'protocol': 'udp',
      'startport': 1,
      'endport': 65535,
      'cidr': '0.0.0.0/0',
    })
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SecurityGroupBuilderRuleComponent, MockTranslatePipe],
      providers: [
        { provide: TranslateService, useClass: MockTranslateService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    TestBed.compileComponents().then(() => {
      f = TestBed.createComponent(SecurityGroupBuilderRuleComponent);
      comp = f.componentInstance;
    });
  }));

  it('displays rule', () => {
    comp.type = 'ingress';
    comp.item = mockRuleItem;

    f.detectChanges();

    const listContent = f.debugElement.query(
      By.css('mat-list-item h4')
    ).nativeElement.textContent;

    expect(listContent).toContain('SECURITY_GROUP_PAGE.RULES.DEFAULT_RULE_PORT_RANGE');

    comp.item.endport = 1;
    f.detectChanges();
    expect(listContent).toContain('SECURITY_GROUP_PAGE.RULES.DEFAULT_RULE');
  });
});
