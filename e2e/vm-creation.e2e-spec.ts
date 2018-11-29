///<reference path="../node_modules/@types/jasmine/index.d.ts"/>
import { VMCreation } from './pages/vm-creation.po';
import { VMDeploy } from './pages/vm-deploy.po';
import { browser, by, element } from 'protractor';
import { VMList } from './pages/vm-list.po';
import { Login } from './pages/login.po';
import { VMSidebar } from './pages/vm-sidebar.po';
import { AccessVM } from './pages/accessVM.po';
import { SGList } from './pages/sg-list.po';
import { SGSidebar } from './pages/sg-sidebar.po';

describe('e2e-test-vm-creation', () => {
  let page: VMCreation;
  let deploy: VMDeploy;
  let login: Login;
  let vmlist: VMList;
  let sidebar: VMSidebar;
  let accessVM: AccessVM;
  let sglist: SGList;
  let sgsidebar: SGSidebar;

  beforeAll(() => {
    browser.driver
      .manage()
      .window()
      .maximize();
    login = new Login();
    login.navigateTo('/');
    login.login();
    login.waitRedirect('instances');
    browser.waitForAngularEnabled(false);
    page = new VMCreation();
    vmlist = new VMList();
  });

  beforeEach(() => {
    deploy = new VMDeploy();
    sidebar = new VMSidebar();
    accessVM = new AccessVM();
    sglist = new SGList();
    sgsidebar = new SGSidebar();
  });

  it('Verify dialog VM Propose appears', () => {
    vmlist.waitVMPropose();
    expect(vmlist.getVMPropose().isPresent()).toBeTruthy();
    vmlist.confirmVMPropose();
    page.waitDialogModal();
  });

  it('Create VM with Template, group, aff-group, checked start VM', () => {
    // vmlist.clickCreateVM();
    page.setDisplayName(page.name);
    expect(page.getZone()).toEqual(page.zone);
    expect(page.getSO()).toContain(page.so);
    expect(page.getInstSourceText()).toContain(page.template);
    // Add wait creation windows
    // page.clickSelectInstSource();
    // page.waitDialogModal();
    // Verify template tab selected and template is selected
    // expect(page.getSelectedTemplate().isPresent()).toBeTruthy();
    // expect(page.getSelectedTabText()).toEqual(template);
    // page.clickYesDialogButton();
    expect(page.getDiskSize()).toBeGreaterThanOrEqual(0);
    // Go to Advanced Tab
    page.clickAdvancedTab();
    page.setHostName(page.name);
    expect(page.getGroupName()).toEqual('');
    expect(page.getSSHkey()).toEqual(page.ssh);
    expect(page.getStartVM().isSelected).toBeTruthy();
    expect(page.getSelectedRules()).toEqual(page.rule);
    page.setAffGroupName(page.aff);
    page.setDefaultSGRule();
    page.setGroupName(page.group);
    page.clickYesDialogButton();
  });

  it('Verify deploy: progress, vnc console', () => {
    deploy.waitVMDeploy();
    expect(deploy.getConsoleButton().isPresent()).toBeTruthy();
    expect(deploy.getDeployText()).toEqual(deploy.deployText);
    expect(deploy.getProgressText()).toEqual(deploy.progressText);
    deploy.clickClose();
  });

  it('Verify card: name, ip, status, template', () => {
    expect(vmlist.getVMNameCard()).toEqual(page.name);
    expect(vmlist.getStateRunning().isPresent()).toBeTruthy();
    expect(vmlist.getVMOSCard()).toContain(page.template);
    expect(vmlist.getVMIPCard().isPresent()).toBeTruthy();
  });

  it('Verify access VM: title, console', () => {
    vmlist.clickOpenAccessVM();
    expect(accessVM.getTitle()).toEqual('Access VM');
    expect(accessVM.getConsoleButton().isPresent).toBeTruthy();
    accessVM.clickClose();
  });

  it('Verify sidebar: name, group, affinity group, template', () => {
    vmlist.clickOpenSidebar();
    expect(sidebar.getVMName()).toEqual(page.name);
    expect(sidebar.getGroup()).toEqual(page.group);
    expect(sidebar.getSOName()).toEqual(page.so);
    expect(sidebar.getTemplate()).toContain(page.template);
    expect(sidebar.getAffGroup()).toEqual(page.aff);
    sidebar.clickClose();
  });

  it('Verify VM in default security group', () => {
    vmlist.clickFirewallMenu();
    sglist.clickSharedTab();
    sglist.clickOpenSidebar();
    expect(sgsidebar.getVMbyName(page.name).isPresent()).toBeTruthy();
    sgsidebar.clickClose();
    sglist.clickVMMenu();
    sglist.waitRedirect('instances');
  });

  it('Verify VM with duplicate name can not be created', () => {
    vmlist.clickCreateVM();
    page.setDisplayName(page.name);
    // Go to Advanced Tab
    page.clickAdvancedTab();
    page.setHostName(page.name);
    page.setDefaultSGRule();
    expect(page.getYesDialogButton().isEnabled()).toBeFalsy();
    expect(page.getErrorHostName().isPresent()).toBeTruthy();
  });
});
