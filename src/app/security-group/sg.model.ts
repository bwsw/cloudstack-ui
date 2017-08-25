import { BaseModel } from '../shared/models/base.model';
import { FieldMapper } from '../shared/decorators/field-mapper.decorator';
import { Taggable } from '../shared/interfaces/taggable.interface';
import { Tag } from '../shared/models/tag.model';


export enum NetworkRuleType {
  Ingress = 'Ingress',
  Egress = 'Egress'
}

export enum NetworkProtocol {
  TCP = 'tcp',
  UDP = 'udp',
  ICMP = 'icmp'
}

@FieldMapper({
  ruleid: 'ruleId',
  cidr: 'CIDR',
  startport: 'startPort',
  endport: 'endPort',
  icmpcode: 'icmpCode',
  icmptype: 'icmpType',
})
export class NetworkRule extends BaseModel  {
  public ruleId: string;
  public protocol: NetworkProtocol;
  public CIDR: string;
  public startPort?: number;
  public endPort?: number;
  public icmpCode?: number;
  public icmpType?: number;

  public isEqual(networkRule: NetworkRule): boolean {
    if (this.CIDR !== networkRule.CIDR || this.protocol !== networkRule.protocol) {
      return false;
    }

    if (this.protocol === NetworkProtocol.TCP || this.protocol === NetworkProtocol.UDP) {
      return this.startPort === networkRule.startPort && this.endPort === networkRule.endPort;
    }

    if (this.protocol === NetworkProtocol.ICMP) {
      return this.icmpCode === networkRule.icmpCode && this.icmpType === networkRule.icmpType;
    }
  }
}

@FieldMapper({
  ingressrule: 'ingressRules',
  egressrule: 'egressRules',
  virtualmachineids: 'virtualMachineIds'
})
export class SecurityGroup extends BaseModel implements Taggable {
  public resourceType = 'SecurityGroup';

  public id: string;
  public name: string;
  public description: string;
  public account: string;
  public domain: string;
  public ingressRules: Array<NetworkRule>;
  public egressRules: Array<NetworkRule>;
  public virtualMachineIds: Array<string>;
  public tags: Array<Tag>;
  public preselected: boolean;

  constructor(params?: {}) {
    super(params);

    this.initializeIngressRules();
    this.initializeEgressRules();
    this.initializeTags();
  }

  public get isPredefinedTemplate(): boolean {
    return this.id.startsWith('template');
  }

  private initializeIngressRules(): void {
    if (!this.ingressRules) {
      this.ingressRules = [];
    }

    this.ingressRules = this.ingressRules.map(rule => {
      return new NetworkRule(rule);
    });
  }

  private initializeEgressRules(): void {
    if (!this.egressRules) {
      this.egressRules = [];
    }

    this.egressRules = this.egressRules.map(rule => {
      return new NetworkRule(rule);
    });
  }

  private initializeTags(): void {
    if (!this.tags) {
      this.tags = [];
    }

    this.tags = this.tags.map(tag => new Tag(tag));
  }
}

export interface ICMPType {
  type: number,
  codes: number[],
  text?: string
}

export const ICMPtypes = [
  {
    type: -1,
    codes: [-1]
  },
  {
    type: 0,
    codes: [0]
  },
  {
    type: 3,
    codes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  },
  {
    type: 4,
    codes: [0]
  },
  {
    type: 5,
    codes: [0, 1, 2, 3]
  },
  {
    type: 8,
    codes: [0]
  },
  {
    type: 9,
    codes: [0]
  },
  {
    type: 10,
    codes: [0]
  },
  {
    type: 11,
    codes: [0, 1]
  },
  {
    type: 12,
    codes: [0, 1, 2]
  },
  {
    type: 13,
    codes: [0]
  },
  {
    type: 14,
    codes: [0]
  },
  {
    type: 15,
    codes: [0]
  },
  {
    type: 16,
    codes: [0]
  },
  {
    type: 17,
    codes: [0]
  },
  {
    type: 18,
    codes: [0]
  },
  {
    type: 30,
    codes: [0]
  },
];

export const GetICMPTypeTranslationToken = (type) => {
  const icmpTypeTranslations = {
    '-1': 'SECURITY_GROUP_PAGE.ICMP_TYPES.-1.description',
    '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.0.description',
    '3': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.description',
    '4': 'SECURITY_GROUP_PAGE.ICMP_TYPES.4.description',
    '5': 'SECURITY_GROUP_PAGE.ICMP_TYPES.5.description',
    '6': 'SECURITY_GROUP_PAGE.ICMP_TYPES.6.description',
    '8': 'SECURITY_GROUP_PAGE.ICMP_TYPES.8.description',
    '9': 'SECURITY_GROUP_PAGE.ICMP_TYPES.9.description',
    '10': 'SECURITY_GROUP_PAGE.ICMP_TYPES.10.description',
    '11': 'SECURITY_GROUP_PAGE.ICMP_TYPES.11.description',
    '12': 'SECURITY_GROUP_PAGE.ICMP_TYPES.12.description',
    '13': 'SECURITY_GROUP_PAGE.ICMP_TYPES.13.description',
    '14': 'SECURITY_GROUP_PAGE.ICMP_TYPES.14.description',
    '15': 'SECURITY_GROUP_PAGE.ICMP_TYPES.15.description',
    '16': 'SECURITY_GROUP_PAGE.ICMP_TYPES.16.description',
    '17': 'SECURITY_GROUP_PAGE.ICMP_TYPES.17.description',
    '18': 'SECURITY_GROUP_PAGE.ICMP_TYPES.18.description',
    '30': 'SECURITY_GROUP_PAGE.ICMP_TYPES.30.description',
  };

  return icmpTypeTranslations[type];
};

export const GetICMPCodeTranslationToken = (type, code) => {
  const icmpCodeTranslations = {
    '-1': { '-1': 'SECURITY_GROUP_PAGE.ICMP_TYPES.-1.codes.-1' },
    '0': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.0.codes.0' },
    '3': {
      '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.0',
      '1': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.1',
      '2': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.2',
      '3': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.3',
      '4': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.4',
      '5': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.5',
      '6': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.6',
      '7': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.7',
      '8': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.8',
      '9': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.9',
      '10': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.10',
      '11': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.11',
      '12': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.12',
      '13': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.13',
      '14': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.14',
      '15': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.15',
    },
    '4': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.4.codes.0' },
    '5': {
      '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.5.codes.0',
      '1': 'SECURITY_GROUP_PAGE.ICMP_TYPES.5.codes.1',
      '2': 'SECURITY_GROUP_PAGE.ICMP_TYPES.5.codes.2',
      '3': 'SECURITY_GROUP_PAGE.ICMP_TYPES.5.codes.3',
    },
    '8': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.8.codes.0' },
    '9': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.9.codes.0' },
    '10': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.10.codes.0' },
    '11': {
      '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.11.codes.0',
      '1': 'SECURITY_GROUP_PAGE.ICMP_TYPES.11.codes.1'
    },
    '12': {
      '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.12.codes.0',
      '1': 'SECURITY_GROUP_PAGE.ICMP_TYPES.12.codes.1',
      '2': 'SECURITY_GROUP_PAGE.ICMP_TYPES.12.codes.2'
    },
    '13': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.13.codes.0' },
    '14': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.14.codes.0' },
    '15': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.15.codes.0' },
    '16': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.16.codes.0' },
    '17': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.17.codes.0' },
    '18': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.18.codes.0' },
    '30': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.30.codes.0' },
  };

  return icmpCodeTranslations[type][code];
};
