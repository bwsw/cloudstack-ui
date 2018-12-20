export interface Capabilities {
  allowusercreateprojects: boolean;
  allowuserexpungerecovervm: boolean;
  allowuserviewdestroyedvm: boolean;
  apilimitinterval: number;
  apilimitmax: number;
  cloudstackversion: string;
  customdiskofferingmaxsize: number;
  customdiskofferingminsize: number;
  dynamicrolesenabled: boolean;
  kvmsnapshotenabled: boolean;
  projectinviterequired: boolean;
  regionsecondaryenabled: boolean;
  securitygroupsenabled: boolean;
  supportELB: string; // boolean string
  userpublictemplateenabled: boolean;
}
