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
import { ImageList } from './pages/template-list.po';
import { ImageSidebar } from './pages/template-sidebar.po';
import { Settings } from './pages/settings.po';

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
  let settings: Settings;
  let index = 0;

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
    imlist = new ImageList();
    imsidebar = new ImageSidebar();
    vmlist.clickImageMenu();
    imlist.clickOpenSidebar();
    imsidebar.clickTagTab();
    /* imsidebar.setTag('csui.template.agreement', 'agreements/template-uuid-agreement.md');
    imsidebar.setTag('csui.vm.auth-mode', 'SSH, HTTP');
    imsidebar.setTag('csui.vm.http.protocol', 'HTTP');
    imsidebar.setTag('csui.vm.http.login', 'login');
    imsidebar.setTag('csui.vm.http.password', 'password');*/
    imsidebar.clickClose();
    imlist.clickVMMenu();
  });

  beforeEach(() => {
    deploy = new VMDeploy();
    sidebar = new VMSidebar();
    accessVM = new AccessVM();
    sglist = new SGList();
    sgsidebar = new SGSidebar();
    settings = new Settings();
  });

  /*it('Verify dialog VM Propose appears, Create VM with Template(), group, aff-group, checked start VM, deploy: progress, vnc console', () => {
    vmlist.waitDialogModal();
    expect(vmlist.getDialog().isPresent()).toBeTruthy();
    vmlist.confirmDialog();
    page = new VMCreation();
    page.waitDialogModal();
    page.setDisplayName(index + page.name);
    expect(page.getZone()).toContain(page.zone);
    expect(page.getSO()).toContain(page.so);
    expect(page.getInstSourceText()).toContain(page.template);
    expect(page.getDiskSize()).toBeGreaterThanOrEqual(0);
    // Go to Advanced Tab
    page.clickAdvancedTab();
    page.setHostName(page.name);
    expect(page.getGroupName()).toEqual('');
    expect(page.getSSHkey()).toEqual(page.ssh);
    expect(page.getStartVM().isSelected).toBeTruthy();
    expect(page.getSelectedRules()).toEqual(page.rule);
    page.setAffGroupName(page.aff);
    // page.setDefaultSGRule();
    page.setGroupName(page.group);
    page.clickYesDialogButton();
    deploy.waitVMDeploy();
    expect(deploy.getConsoleButton().isPresent()).toBeTruthy();
    expect(deploy.getDeployText()).toEqual(deploy.deployText);
    expect(deploy.getProgressText()).toEqual(deploy.progressText);
    deploy.clickClose();
  });

  it('Verify card: name, ip, status, template', () => {
    expect(vmlist.getVMNameCard(index)).toEqual(index + page.name);
    expect(vmlist.getStateRunning().isPresent()).toBeTruthy();
    expect(vmlist.getVMOSCard(index)).toContain(page.template);
    expect(vmlist.getVMIPCard(index).isPresent()).toBeTruthy();
  });

  it('Verify access VM: title, console', () => {
    vmlist.clickOpenAccessVM(index);
    expect(accessVM.getTitle()).toEqual('Access VM');
    expect(accessVM.getConsoleButton().isPresent).toBeTruthy();
    accessVM.clickClose();
  });

  it('Verify sidebar: name, group, affinity group, template', () => {
    vmlist.clickOpenSidebar(index);
    expect(sidebar.getVMName()).toEqual(index + page.name);
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
    expect(sgsidebar.getVMbyName(index + page.name).isPresent()).toBeTruthy();
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
    expect(page.getYesDialogButton().isEnabled()).toBeFalsy();
    expect(page.getErrorHostName().isPresent()).toBeTruthy();
    page.clickNoDialogButton();
  });
*/
  it('Create VM with Template(Agreement+SSH),custom SO, group, aff-group, checked start VM', () => {
    vmlist.clickCreateVM();
    page = new VMCreation();
    index = 1;
    const nameVM = index + page.name;
    page.setDisplayName(nameVM);
    // Go to Advanced Tab
    page.clickAdvancedTab();
    expect(page.getStartVM().isSelected).toBeTruthy();
    page.setPrivateSG();
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

  it('Verify access VM: ssh', () => {
    // expect(vmlist.getStateStopped().isPresent()).toBeTruthy(); - can't get access for stopped VM
    vmlist.clickOpenAccessVM(index);
    expect(accessVM.getTitle()).toEqual('Access VM');
    expect(accessVM.getConsoleButton().isPresent).toBeTruthy();
    accessVM.clickSSHTab();
    expect(accessVM.getConnectionString().getText()).toContain('ssh -p 22 -u root'); // add check ip address
    expect(accessVM.getPort().getText()).toContain('22');
    expect(accessVM.getLogin().getText()).toContain('root');

    expect(accessVM.getWebshellButton().isPresent).toBeTruthy();
    accessVM.clickClose();
  });

  it('Verify sidebar VM: tags ssh', () => {
    vmlist.clickOpenSidebar(index);
    sidebar.clickTagTab();
    expect(sidebar.getTagKey('csui.template.agreement').isPresent()).toBeTruthy();
    expect(sidebar.getTagValue('agreements/template-uuid-agreement.md').isPresent()).toBeTruthy();
    expect(sidebar.getTagKey('csui.vm.auth-mode').isPresent()).toBeTruthy();
    expect(sidebar.getTagValue('SSH').isPresent()).toBeTruthy();
    expect(sidebar.getTagKey('csui.vm.group').isPresent()).toBeTruthy();
    expect(sidebar.getTagValue(page.group).isPresent()).toBeTruthy();
    sidebar.clickClose();
  });

  /*it('Create VM with Template(HTTP), save password, checked start VM', () => {
    page = new VMCreation();
    index = 2;
    vmlist.clickMainMenu();
    vmlist.clickMainAccounts();
    vmlist.clickSettings();
    settings.setSavePassword();
    settings.clickMainMenu();
    settings.clickMainVM();
    imlist.clickVMMenu();
    vmlist.clickCreateVM();
    page = new VMCreation();
    page.setDisplayName(index + page.name);
    // Go to Advanced Tab
    page.clickAdvancedTab();
    expect(page.getStartVM().isSelected).toBeTruthy();
    page.setPrivateSG();
    page.clickYesDialogButton();
    deploy.waitVMDeploy();
    expect(deploy.getConsoleButton().isPresent()).toBeTruthy();
    expect(deploy.getDeployText()).toEqual(deploy.deployText);
    expect(deploy.getProgressText()).toEqual(deploy.progressText);
    deploy.clickClose();
  });

  it('Verify access VM: http', () => {
    page = new VMCreation();
    vmlist.clickOpenAccessVM(index);
    expect(accessVM.getTitle()).toEqual('Access VM');
    expect(accessVM.getConsoleButton().isPresent).toBeTruthy();
    accessVM.clickHTTPTab();
    expect(accessVM.getHttpLogin().getText()).toContain('login');
    expect(accessVM.getHttpPassword().getText()).toContain('password');
    // add test for url with ip
    accessVM.clickClose();
  });

  it('Verify sidebar VM: tags http', () => {
    page = new VMCreation();
    vmlist.clickOpenSidebar(index);
    sidebar.clickTagTab();
    expect(sidebar.getTagKey('csui.vm.http.login').isPresent()).toBeTruthy();
    expect(sidebar.getTagValue('login').isPresent()).toBeTruthy();
    expect(sidebar.getTagKey('csui.vm.http.password').isPresent()).toBeTruthy();
    expect(sidebar.getTagValue('password').isPresent()).toBeTruthy();
    sidebar.clickClose();
  });*/
});
