import {
  Component,
  Inject,
  ViewChild,
  OnInit,
  ElementRef
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MdlDialogReference } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';

import { SecurityGroupService } from '../../shared/services';
import { SecurityGroup, NetworkRuleType } from '../sg.model';
import { NotificationService } from '../../shared/services';

const icmpTypes = require('../icmp-codes.json');

interface IIcmpCode {
  code: number;
  name: string;
}

interface IIcmpType {
  type: number;
  name: string;
  codes: Array<IIcmpCode>;
}


@Component({
  selector: 'cs-security-group-rules',
  templateUrl: 'sg-rules.component.html',
  styleUrls: ['sg-rules.component.scss']
})
export class SgRulesComponent implements OnInit {
  @ViewChild('rulesForm') public rulesForm: NgForm;

  public type: NetworkRuleType;
  public protocol: 'TCP'|'UDP'|'ICMP';
  public startPort: number;
  public icmpType: number;
  public icmpCode: number;
  public endPort: number;
  public cidr: string;

  public adding: boolean;

  public icmpTypes: Array<IIcmpType>;
  public selectedIcmpTypeCodes: Array<IIcmpCode>;

  constructor(
    public dialog: MdlDialogReference,
    private securityGroupService: SecurityGroupService,
    private notificationService: NotificationService,
    @Inject('securityGroup') public securityGroup: SecurityGroup,
    private translateService: TranslateService,
    private elementRef: ElementRef
  ) {
    this.cidr = '0.0.0.0/0';
    this.protocol = 'TCP';
    this.type = 'Ingress';

    this.adding = false;

    this.icmpTypes = icmpTypes;
  }

  public ngOnInit(): void {
    this.setPadding();
  }

  public addRule(e: Event): void {
    e.stopPropagation();

    const type = this.type;
    const params: any = {
      securitygroupid: this.securityGroup.id,
      protocol: this.protocol.toLowerCase(),
      cidrlist: this.cidr
    };

    if (this.protocol === 'ICMP') {
      params.icmptype = this.icmpType;
      params.icmpcode = this.icmpCode;
    } else {
      params.startport = this.startPort;
      params.endport = this.endPort;
    }

    this.adding = true;

    this.securityGroupService.addRule(type, params)
      .subscribe(rule => {
        this.securityGroup[`${type.toLowerCase()}Rules`].push(rule);
        this.resetForm();
        this.adding = false;
        this.setPadding();
      }, () => {
        this.translateService.get(['FAILED_TO_ADD_RULE']).subscribe((translations) => {
          this.notificationService.message(translations['FAILED_TO_ADD_RULE']);
          this.adding = false;

        });
      });
  }

  public onCidrClick(): void {
    if (!this.cidr) {
      this.cidr = '0.0.0.0/0';
    }
  }

  public removeRule({ type, id }): void {
    this.securityGroupService.removeRule(type, { id })
      .subscribe(() => {
        const rules = this.securityGroup[`${type.toLowerCase()}Rules`];
        const ind = rules.findIndex(rule => rule.ruleId === id);
        if (ind === -1) {
          return;
        }
        rules.splice(ind, 1);
        this.setPadding();
      }, () => {
        this.translateService.get(['FAILED_TO_REMOVE_RULE']).subscribe((translations) => {
          this.notificationService.message(translations['FAILED_TO_REMOVE_RULE']);
        });
      });
  }

  /*
  *   This code is fixed blur dialog window caused
  *   https://bugs.chromium.org/p/chromium/issues/detail?id=521364
  */
  public setPadding(): void {
    let rulesCount = this.securityGroup.ingressRules.length + this.securityGroup.egressRules.length;
    let dialogElement = this.getDialogElement();
    if (rulesCount % 2) {
      dialogElement.classList.add('blur-fix-odd');
      dialogElement.classList.remove('blur-fix-even');
    } else {
      dialogElement.classList.add('blur-fix-even');
      dialogElement.classList.remove('blur-fix-odd');
    }
  }

  public changeSize(): void {
    let dialogElement = this.getDialogElement();
    if (this.protocol === 'ICMP') {
      dialogElement.classList.add('wide');
    } else {
      dialogElement.classList.remove('wide');
    }
  }

  public changeSelectedIcmp(): void {
    this.selectedIcmpTypeCodes = this.icmpTypes.find(type => type.type === this.icmpType).codes;
    this.icmpCode = null;
    // setTimeout force updates the icmp code selection component
    setTimeout(() => {
      this.icmpCode = 0;
    }, 0);
  }

  private getDialogElement(): HTMLElement {
    return this.elementRef.nativeElement.parentNode as HTMLElement;
  }

  private resetForm(): void {
    // reset controls' state. instead of just setting ngModel bound variables to empty string
    // we reset controls to reset the validity state of inputs
    let controlNames = ['icmpTypeSelect', 'icmpCodeSelect', 'startPort', 'endPort'];
    controlNames.forEach((key) => {
      let control = this.rulesForm.controls[key];
      if (control) {
        control.reset();
      }
    });
  }
}
