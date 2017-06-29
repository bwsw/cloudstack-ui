interface FieldValidity {
  valid: boolean;
  message: string;
}

class VmCreationValidity {
  public name: FieldValidity = { valid: true, message: '' };
  public zone: FieldValidity = { valid: true, message: '' };
  public serviceOffering: FieldValidity = { valid: true, message: '' };
  public template: FieldValidity = { valid: true, message: '' };
  public diskOffering: FieldValidity = { valid: true, message: '' };
  public diskSize: FieldValidity = { valid: true, message: '' };
  public instanceGroup: FieldValidity = { valid: true, message: '' };
  public affinityGroup: FieldValidity = { valid: true, message: '' };
  public securityGroups: FieldValidity = { valid: true, message: '' };
  public keyboardLayout: FieldValidity = { valid: true, message: '' };
  public sshKey: FieldValidity = { valid: true, message: '' };
  public doStartVm: FieldValidity = { valid: true, message: '' };

  public isValid(): boolean {
    return this.name.valid && this.zone.valid && this.serviceOffering.valid &&
      this.template.valid && this.diskOffering.valid && this.diskSize.valid &&
      this.instanceGroup.valid && this.affinityGroup.valid && this.securityGroups.valid &&
      this.keyboardLayout.valid && this.sshKey.valid && this.doStartVm.valid;
  }
}
