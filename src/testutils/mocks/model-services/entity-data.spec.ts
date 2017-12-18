import { SecurityGroup } from '../../../app/security-group/sg.model';
import { AffinityGroup, DiskOffering, ServiceOffering, SSHKeyPair, Zone } from '../../../app/shared/models';
import { Iso, Template } from '../../../app/template/shared';


const affinityGroups: Array<Object> = require('./fixtures/affinityGroups.json');
const diskOfferings: Array<Object> = require('./fixtures/diskOfferings.json');
const isos: Array<Object> = require('./fixtures/isos.json');
const securityGroupTemplates: Array<Object> = require('./fixtures/securityGroupTemplates.json');
const serviceOfferings: Array<Object> = require('./fixtures/serviceOfferings.json');
const sshKeyPairs: Array<Object> = require('./fixtures/sshKeyPairs.json');
const templates: Array<Object> = require('./fixtures/templates.json');
const zones: Array<Object> = require('./fixtures/zones.json');

export class MockEntityData {
  public affinityGroups: Array<AffinityGroup>;
  public diskOfferings: Array<DiskOffering>;
  public isos: Array<Iso>;
  public securityGroupTemplates: Array<SecurityGroup>;
  public serviceOfferings: Array<ServiceOffering>;
  public sshKeyPairs: Array<SSHKeyPair>;
  public templates: Array<Template>;
  public zones: Array<Zone>;

  constructor() {
    this.affinityGroups = affinityGroups.map(json => new AffinityGroup(json));
    this.diskOfferings = diskOfferings.map(json => new DiskOffering(json));
    this.isos = isos.map(json => new Iso(json));
    this.securityGroupTemplates = securityGroupTemplates.map(json => new SecurityGroup(json));
    this.serviceOfferings = serviceOfferings.map(json => new ServiceOffering(json));
    this.sshKeyPairs = sshKeyPairs.map(json => json as SSHKeyPair);
    this.templates = templates.map(json => new Template(json));
    this.zones = zones.map(json => json as Zone);
  }
}
