import {
  Component,
  Inject,
  ViewChild,
  OnInit,
  ElementRef
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MdlDialogReference } from 'angular2-mdl';
import { TranslateService } from '@ngx-translate/core';

import { SecurityGroupService } from '../../shared/services';
import { SecurityGroup, NetworkRuleType, NetworkRuleTypes, NetworkProtocol, NetworkProtocols } from '../sg.model';
import { NotificationService } from '../../shared/services';


@Component({
  selector: 'cs-security-group-rules',
  templateUrl: 'sg-rules.component.html',
  styleUrls: ['sg-rules.component.scss']
})
export class SgRulesComponent implements OnInit {
  @ViewChild('rulesForm') public rulesForm: NgForm;

  public type: NetworkRuleType;
  public protocol: NetworkProtocol;
  public startPort: number;
  public icmpType: number;
  public icmpCode: number;
  public endPort: number;
  public cidr: string;

  public adding: boolean;

  public NetworkProtocols = NetworkProtocols;
  public NetworkRuleTypes = NetworkRuleTypes;

  constructor(
    public dialog: MdlDialogReference,
    private securityGroupService: SecurityGroupService,
    private notificationService: NotificationService,
    @Inject('securityGroup') public securityGroup: SecurityGroup,
    private translateService: TranslateService,
    private elementRef: ElementRef
  ) {
    this.cidr = '0.0.0.0/0';
    this.protocol = NetworkProtocols.TCP;
    this.type = NetworkRuleTypes.Ingress;
    this.icmpCode = -1;
    this.icmpType = -1;

    this.adding = false;
  }

  public ngOnInit(): void {
    this.setPadding();
  }

  public addRule(e: Event): void {
    e.stopPropagation();

    const type = this.type;
    const params: any = {
      securityGroupId: this.securityGroup.id,
      protocol: this.protocol.toLowerCase(),
      cidrList: this.cidr
    };

    if (this.protocol === NetworkProtocols.ICMP) {
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

  public onIcmpTypeClick(): void {
    if (!this.icmpType) {
      this.icmpType = -1;
    }
  }

  public onIcmpCodeClick(): void {
    if (!this.icmpCode) {
      this.icmpCode = -1;
    }
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
