import {
  Component,
  Inject,
  ViewChild,
  HostListener,
  ViewChildren,
  QueryList,
  OnInit,
  ElementRef
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MdlSelectComponent } from '@angular2-mdl-ext/select';
import { MdlDialogReference } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';

import { SecurityGroupService } from '../../shared/services';
import { SecurityGroup, NetworkRuleType } from '../sg.model';
import { NotificationService } from '../../shared/services';

@Component({
  selector: 'cs-security-group-rules',
  templateUrl: 'sg-rules.component.html',
  styleUrls: ['sg-rules.component.scss']
})
export class SgRulesComponent implements OnInit {
  @ViewChild('rulesForm') public rulesForm: NgForm;
  @ViewChildren(MdlSelectComponent) public selectComponentList: QueryList<MdlSelectComponent>;

  public type: NetworkRuleType;
  public protocol: 'TCP'|'UDP'|'ICMP';
  public startPort: number;
  public icmpType: number;
  public icmpCode: number;
  public endPort: number;
  public cidr: string;

  public adding: boolean;

  constructor(
    public dialog: MdlDialogReference,
    private securityGroupService: SecurityGroupService,
    private notificationService: NotificationService,
    @Inject('securityGroup') public securityGroup: SecurityGroup,
    private translateService: TranslateService,
    private elementRef: ElementRef
  ) {
    this.protocol = 'TCP';
    this.type = 'Ingress';
    this.adding = false;
  }

  public ngOnInit() {
    this.setPadding();
  }

  public addRule() {
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
        this.cidr = '';
        this.startPort = this.endPort = this.icmpCode = this.icmpType = null;
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

  public removeRule({ type, id }) {
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

  @HostListener('click', ['$event'])
  public onClick(e) {
    e.stopPropagation();
    // we need to stop propagation to prevent vmDetail from closing,
    // but mdl-popover in mdl-select is listening to document click to decide
    // when it should close (https://git.io/vM7FJ)
    // stopPropagation prevents it, so here we close it
    this.selectComponentList.forEach(mdlSelect => mdlSelect.close(e));
  }

  /*
  *   This code is fixed blur dialog window caused
  *   https://bugs.chromium.org/p/chromium/issues/detail?id=521364
  */
  public setPadding() {
    let rulesCount = this.securityGroup.ingressRules.length + this.securityGroup.egressRules.length;
    let parentNode = this.elementRef.nativeElement.parentNode as HTMLElement;
    if (rulesCount % 2) {
      parentNode.style.padding = '11.8px';
    } else {
      parentNode.style.padding = '11.7px';
    }
  }

  private resetForm() {
    let controlNames = ['icmpType', 'startPort', 'icmpCode', 'endPort', 'cidr'];
    controlNames.forEach((key) => {
      let control = this.rulesForm.controls[key];
      if (control) {
        control.reset();
      }
    });
  }
}
