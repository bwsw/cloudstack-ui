import { VirtualMachine, VmState } from '../../app/vm';

export const vm: VirtualMachine = <VirtualMachine>{
  id: 'e3a74eef-46bf-4d77-90e2-fef2c5470ced',
  name: 'vm-admin-12',
  displayname: 'vm-admin-12',
  account: 'admin',
  domainid: '931b7464-63aa-11e8-946f-0242ac110002',
  domain: 'ROOT',
  created: '2018-08-08T04:57:08+0000',
  state: VmState.Running,
  zoneid: 'd40f917e-b553-4daa-bc4a-77393a27076e',
  zonename: 'Sandbox-simulator',
  template: undefined,
  templateid: 'af729204-63aa-11e8-946f-0242ac110002',
  templatename: 'CentOS 5.6 (64-bit) no GUI (Simulator)',
  passwordenabled: false,
  serviceofferingid: '5549f95c-1f14-4690-9f79-00e439fa3ac8',
  serviceofferingname: 'Small Offering',
  cpunumber: 1,
  cpuspeed: 2000,
  memory: 512,
  cpuused: '10%',
  networkkbsread: 3997696,
  networkkbswrite: 1998848,
  diskkbsread: 0,
  diskkbswrite: 0,
  diskioread: 0,
  diskiowrite: 0,
  guestosid: '930438a9-63aa-11e8-946f-0242ac110002',
  securitygroup: [
    {
      id: '67dd0d1b-7b55-11e8-967a-0242ac110002',
      name: 'default',
      description: 'Default Security Group',
      account: 'admin',
      domain: undefined,
      domainid: undefined,
      ingressrule: [],
      egressrule: [],
      tags: [],
      virtualmachineids: [],
      virtualmachinecount: undefined
    }
  ],
  nic: [
    {
      id: '29605989-f75c-4792-b53d-51d2c2380c70',
      networkid: '8a7aa3f0-a86f-44e9-9d5b-46d68590839a',
      networkname: 'guestNetworkForBasicZone',
      netmask: '255.255.255.0',
      gateway: '60.147.41.1',
      ipaddress: '60.147.41.252',
      broadcasturi: 'vlan://untagged',
      traffictype: 'Guest',
      type: 'Shared',
      isdefault: true,
      macaddress: '1e:00:69:00:01:f8',
      secondaryip: [],
      deviceid: undefined,
      ip6address: undefined,
      ip6cidr: undefined,
      ip6gateway: undefined,
      isolationuri: undefined,
      nsxlogicalswitch: undefined,
      nsxlogicalswitchport: undefined,
      virtualmachineid: undefined
    }
  ],
  affinitygroup: [],
  tags: [
    {
      key: 'any',
      value: '123',
      resourcetype: 'UserVm',
      resourceid: 'e3a74eef-46bf-4d77-90e2-fef2c5470ced',
      account: 'admin',
      domainid: '931b7464-63aa-11e8-946f-0242ac110002',
      domain: 'ROOT'
    },
    {
      key: 'csui.smth',
      value: 'one',
      resourcetype: 'UserVm',
      resourceid: 'e3a74eef-46bf-4d77-90e2-fef2c5470ced',
      account: 'admin',
      domainid: '931b7464-63aa-11e8-946f-0242ac110002',
      domain: 'ROOT'
    },
    {
      key: 'sdf',
      value: 'sdf',
      resourcetype: 'UserVm',
      resourceid: 'e3a74eef-46bf-4d77-90e2-fef2c5470ced',
      account: 'admin',
      domainid: '931b7464-63aa-11e8-946f-0242ac110002',
      domain: 'ROOT'
    }
  ]
};