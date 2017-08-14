import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MockTranslatePipe } from '../../../testutils/mocks/mock-translate.pipe.mock';
import { NetworkRule } from '../sg.model';
import { SgCreationRuleComponent } from './sg-creation-rule.component';
import { RuleListItem } from './sg-creation.component';


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
      declarations: [SgCreationRuleComponent, MockTranslatePipe],
      schemas: [NO_ERRORS_SCHEMA]
    });

    TestBed.compileComponents().then(() => {
      f = TestBed.createComponent(SgCreationRuleComponent);
      comp = f.componentInstance;
    });
  }));

  it('displays rule', () => {
    comp.type = 'ingress';
    comp.item = mockRuleItem;

    f.detectChanges();

    const listContent = f.debugElement.query(
      By.css('md-list-item h4')
    ).nativeElement.textContent;

    expect(listContent).toContain('INGRESS');
    expect(listContent).toContain(mockRuleItem.rule.CIDR);
    expect(listContent).toContain(mockRuleItem.rule.protocol.toUpperCase());
    expect(listContent).toContain(mockRuleItem.rule.startPort);
    expect(listContent).toContain(mockRuleItem.rule.endPort);
  });
});
