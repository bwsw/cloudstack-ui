import { SecurityGroup } from '../../../app/security-group/sg.model';
import { AffinityGroup, DiskOffering, ServiceOffering, SSHKeyPair, Zone } from '../../../app/shared/models';
import { Iso, Template } from '../../../app/template/shared';


const affinityGroups: Array<AffinityGroup> = require('./fixtures/affinityGroups.json');
const diskOfferings: Array<DiskOffering> = require('./fixtures/diskOfferings.json');
const isos: Array<Iso> = require('./fixtures/isos.json');
const securityGroupTemplates: Array<SecurityGroup> = require(
  './fixtures/securityGroupTemplates.json');
const serviceOfferings: Array<ServiceOffering> = require(
  './fixtures/serviceOfferings.json');
const sshKeyPairs: Array<SSHKeyPair> = require('./fixtures/sshKeyPairs.json');
const templates: Array<Template> = require('./fixtures/templates.json');
const zones: Array<Zone> = require('./fixtures/zones.json');

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
    this.affinityGroups = affinityGroups;
    this.diskOfferings = diskOfferings;
    this.isos = isos;
    this.securityGroupTemplates = securityGroupTemplates;
    this.serviceOfferings = serviceOfferings;
    this.sshKeyPairs = sshKeyPairs;
    this.templates = templates;
    this.zones = zones;
  }
}
