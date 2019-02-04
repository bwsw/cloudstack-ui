import { SecurityGroup } from '../../app/security-group/sg.model';

export function getMockSecurityGroup(updates: Partial<SecurityGroup> = {}): SecurityGroup {
  return {
    id: null,
    account: null,
    description: null,
    domain: null,
    domainid: null,
    name: null,
    tags: [],
    virtualmachinecount: null,
    virtualmachineids: [],
    egressrule: [],
    ingressrule: [],
    ...updates,
  };
}
