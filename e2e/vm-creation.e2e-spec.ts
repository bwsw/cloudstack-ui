///<reference path="../node_modules/@types/jasmine/index.d.ts"/>
import { VMCreation } from './pages/vm-creation.po';
import { VMDeploy } from './pages/vm-deploy.po';
import { browser } from 'protractor';
import { VMList } from './pages/vm-list.po';
import { Login } from './pages/login.po';
import { VMSidebar } from './pages/vm-sidebar.po';
import { AccessVM } from './pages/vm-access.po';
import { SGList } from './pages/sg-list.po';
import { SGSidebar } from './pages/sg-sidebar.po';
import { ImageList } from './pages/template-list.po';
import { ImageSidebar } from './pages/template-sidebar.po';

describe('e2e-test-vm-creation', () => {
  let page: VMCreation;
  let deploy: VMDeploy;
  let login: Login;
  let vmlist: VMList;
  let sidebar: VMSidebar;
  let accessVM: AccessVM;
  let sglist: SGList;
  let sgsidebar: SGSidebar;
  let imlist: ImageList;
  let imsidebar: ImageSidebar;

  beforeAll(() => {
    browser.driver
      .manage()
      .window()
      .maximize();
    login = new Login();
    login.navigateTo('/');
    login.login();
    login.waitRedirect('instances');
  });

  beforeEach(() => {
    vmlist = new VMList();
    imlist = new ImageList();
    imsidebar = new ImageSidebar();
    deploy = new VMDeploy();
    sidebar = new VMSidebar();
    accessVM = new AccessVM();
    sglist = new SGList();
    sgsidebar = new SGSidebar();
  });

  it('Create VM propose, VM with fixed SO, group, aff-group, unchecked start VM', () => {
    vmlist.waitDialogModal();
    expect(vmlist.getDialog().isPresent()).toBeTruthy();
    vmlist.confirmDialog();
    vmlist.waitDialogModal();
    page = new VMCreation();
    page.setDisplayName(page.name);
    // Go to Advanced Tab
    page.clickAdvancedTab();
    expect(page.getStartVM().isSelected).toBeTruthy();
    page.setStartVM();
    page.setPrivateSG();
    page.setGroupName(page.group);
    page.clickYesDialogButton();
    deploy.waitVMDeploy();
    expect(deploy.getConsoleButton().isPresent()).toBeFalsy();
    expect(deploy.getDeployText()).toEqual(deploy.deployText);
    expect(deploy.getProgressText()).toEqual(deploy.progressText);
    deploy.clickClose();
  });

  it('Verify card: stopped status', () => {
    expect(vmlist.getStateStopped().isPresent()).toBeTruthy();
  });

  it('Verify VM in private security group', () => {
    vmlist.clickFirewallMenu();
    sglist.clickPrivateTab();
    sglist.clickOpenSidebar();
    expect(sgsidebar.getVMbyName(page.name).isPresent()).toBeTruthy();
    sgsidebar.clickClose();
    sglist.clickVMMenu();
    sglist.waitRedirect('instances');
  });

  it('Verify create VM with Template(), group, aff-group, checked start VM, deploy: progress, vnc console', () => {
    vmlist.clickImageMenu();
    imlist.clickOpenSidebar();
    imsidebar.clickTagTab();
    imsidebar.clickShowSystemTab();
    imsidebar.setTag('csui.vm.auth-mode', 'SSH, HTTP');
    imsidebar.setTag('csui.vm.http.protocol', 'HTTP');
    imsidebar.setTag('csui.vm.http.login', 'login');
    imsidebar.setTag('csui.vm.http.password', 'password');
    imsidebar.setTag('csui.template.agreement', 'agreements/template-uuid-agreement.md');
    imsidebar.clickClose();
    imlist.clickVMMenu();
    page = new VMCreation();
    vmlist.clickCreateVM();
    page.waitDialogModal();
    page.setDisplayName(page.name);
    expect(page.getZone()).toContain(browser.params.zone);
    expect(page.getSO()).toContain(browser.params.so);
    expect(page.getInstSourceText()).toContain(browser.params.template);
    expect(page.getDiskSize()).toBeGreaterThanOrEqual(0);
    // Go to Advanced Tab
    page.clickAdvancedTab();
    page.setHostName(page.name);
    expect(page.getGroupName()).toEqual('');
    expect(page.getSSHkey()).toEqual(page.ssh);
    expect(page.getStartVM().isSelected).toBeTruthy();
    expect(page.getSelectedRules()).toEqual(browser.params.rule);
    page.setAffGroupName(page.aff);
    // page.setDefaultSGRule();
    page.setGroupName(page.group);
    page.clickYesDialogButton();
    page.waitDialogModal();
    expect(page.getDialog().isPresent()).toBeTruthy();
    expect(page.getYesDialogButton().getText()).toEqual('I AGREE');
    page.clickYesDialogButton();
    deploy.waitVMDeploy();
    expect(deploy.getConsoleButton().isPresent()).toBeTruthy();
    expect(deploy.getDeployText()).toEqual(deploy.deployText);
    expect(deploy.getProgressText()).toEqual(deploy.progressText);
    deploy.clickClose();
  });

  it('Verify card: name, ip, status, template', () => {
    expect(vmlist.getVMNameCard()).toEqual(page.name);
    expect(vmlist.getStateRunning().isPresent()).toBeTruthy();
    expect(vmlist.getVMOSCard(0)).toContain(browser.params.template);
    expect(vmlist.getVMIPCard(0).isPresent()).toBeTruthy();
  });

  it('Verify sidebar: name, group, affinity group, template, tags', () => {
    vmlist.clickOpenSidebar(0);
    expect(sidebar.getVMName()).toEqual(page.name);
    expect(sidebar.getGroup()).toEqual(page.group);
    expect(sidebar.getSOName()).toEqual(browser.params.so);
    expect(sidebar.getTemplate()).toContain(browser.params.template);
    expect(sidebar.getAffGroup()).toEqual(page.aff);
    sidebar.clickTagTab();
    expect(sidebar.getTagKey('csui.template.agreement').isPresent()).toBeTruthy(
      'csui.template.agreement',
    );
    expect(sidebar.getTagValue('agreements/template-uuid-agreement.md').isPresent()).toBeTruthy(
      'agreements/template-uuid-agreement.md',
    );
    expect(sidebar.getTagKey('csui.vm.auth-mode').isPresent()).toBeTruthy('csui.vm.auth-mode');
    expect(sidebar.getTagValue('SSH').isPresent()).toBeTruthy('SSH');
    expect(sidebar.getTagKey('csui.vm.http.login').isPresent()).toBeTruthy('csui.vm.http.login');
    expect(sidebar.getTagValue('login').isPresent()).toBeTruthy('login');
    expect(sidebar.getTagKey('csui.vm.http.password').isPresent()).toBeTruthy(
      'csui.vm.http.password',
    );
    expect(sidebar.getTagValue('password').isPresent()).toBeTruthy('password');
    sidebar.clickClose();
  });

  it('Verify access VM: ssh, http', () => {
    vmlist.clickOpenAccessVM();
    expect(accessVM.getTitle()).toEqual('Access VM');
    expect(accessVM.getConsoleButton().isPresent).toBeTruthy();
    /*accessVM.clickSSHTab();
    expect(accessVM.getConnectionString().getText()).toContain('ssh -p 22 -u root'); // add check ip address
    expect(accessVM.getPort().getText()).toContain('22');
    expect(accessVM.getLogin().getText()).toContain('root');
    expect(accessVM.getWebshellButton().isPresent).toBeTruthy();
    accessVM.clickHTTPTab();
    expect(accessVM.getHttpLogin().getText()).toContain('login');
    expect(accessVM.getHttpPassword().getText()).toContain('password');*/
    accessVM.clickClose();
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
    page.waitDialogModal();
    page.setDisplayName(page.name);
    // Go to Advanced Tab
    page.clickAdvancedTab();
    page.setHostName(page.name);
    expect(page.getYesDialogButton().isEnabled()).toBeFalsy();
    expect(page.getErrorHostName().isPresent()).toBeTruthy();
    page.clickNoDialogButton();
  });
});
