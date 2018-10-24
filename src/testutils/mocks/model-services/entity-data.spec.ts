import { SecurityGroup } from '../../../app/security-group/sg.model';
import {
  AffinityGroup,
  DiskOffering,
  ServiceOffering,
  SSHKeyPair,
  Zone,
} from '../../../app/shared/models';
import { Iso, Template } from '../../../app/template/shared';

const affinityGroups: AffinityGroup[] = require('./fixtures/affinityGroups.json');
const diskOfferings: DiskOffering[] = require('./fixtures/diskOfferings.json');
const isos: Iso[] = require('./fixtures/isos.json');
const securityGroupTemplates: SecurityGroup[] = require('./fixtures/securityGroupTemplates.json');
const serviceOfferings: ServiceOffering[] = require('./fixtures/serviceOfferings.json');
const sshKeyPairs: SSHKeyPair[] = require('./fixtures/sshKeyPairs.json');
const templates: Template[] = require('./fixtures/templates.json');
const zones: Zone[] = require('./fixtures/zones.json');

export class MockEntityData {
  public affinityGroups: AffinityGroup[];
  public diskOfferings: DiskOffering[];
  public isos: Iso[];
  public securityGroupTemplates: SecurityGroup[];
  public serviceOfferings: ServiceOffering[];
  public sshKeyPairs: SSHKeyPair[];
  public templates: Template[];
  public zones: Zone[];

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
