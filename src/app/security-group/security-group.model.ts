import { BaseModel } from '../shared/models/base.model';
import { FieldMapper } from '../shared/decorators/field-mapper.decorator';

@FieldMapper({
  ruleid: 'ruleId',
  cidr: 'CIDR',
  startport: 'startPort',
  endport: 'endPort',
  icmpcode: 'icmpCode',
  icmptype: 'icmpType',
})
export class NetworkRule extends BaseModel {
  public ruleId: string;
  public protocol: string;
  public CIDR: string;
  public startPort?: number;
  public endPort?: number;
  public icmpCode?: number;
  public icmpType?: number;
}

interface ITag {
  key: string;
  value: string;
}

@FieldMapper({
  ingressrule: 'ingressRules',
  egressrule: 'egressRules'
})
export class SecurityGroup extends BaseModel {
  public id: string;
  public name: string;
  public description: string;
  public account: string;
  public domain: string;
  public ingressRules: Array<NetworkRule>;
  public egressRules: Array<NetworkRule>;
  public tags: Array<ITag>;

  private _labels: string;

  constructor(params?: {}) {
    super(params);

    for (let i = 0; i < this.ingressRules.length; i++) {
      this.ingressRules[i] = new NetworkRule(this.ingressRules[i]);
    }

    for (let i = 0; i < this.egressRules.length; i++) {
      this.egressRules[i] = new NetworkRule(this.egressRules[i]);
    }

    if (!this.tags) {
      return;
    }

    for (let i = 0; i < this.tags.length; i++) {
      const key = this.tags[i].key;
      if (key !== 'labels') {
        continue;
      }

      this.labels = this.tags[i].value.replace(/,(\S)/gi, ', $1');
      this.tags.splice(i, 1);
      break;
    }
  }

  public get labels() {
    return this._labels;
  }

  public set labels(value) {
    this._labels = value;
  }

  public serialize() {
    const model: any = super.serialize();

    model.tags.push(this.labels);
    return model;
  }
}
