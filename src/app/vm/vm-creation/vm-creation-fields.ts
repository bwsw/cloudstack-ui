export type VmCreationField =
  'displayName' |
  'zone' |
  'serviceOffering' |
  'template' |
  'diskOffering' |
  'rootDiskSize' |
  'instanceGroup' |
  'affinityGroup' |
  'securityRules' |
  'keyboard' |
  'sshKeyPair' |
  'doStartVm';

export const VmCreationFields = {
  displayName: 'displayName' as VmCreationField,
  zone: 'zone' as VmCreationField,
  serviceOffering: 'serviceOffering' as VmCreationField,
  template: 'template' as VmCreationField,
  diskOffering: 'diskOffering' as VmCreationField,
  rootDiskSize: 'rootDiskSize' as VmCreationField,
  instanceGroup: 'instanceGroup' as VmCreationField,
  affinityGroup: 'affinityGroup' as VmCreationField,
  securityGroup: 'securityRules' as VmCreationField,
  keyboard: 'keyboard' as VmCreationField,
  sshKeyPair: 'sshKeyPair' as VmCreationField,
  doStartVm: 'doStartVm' as VmCreationField
};
