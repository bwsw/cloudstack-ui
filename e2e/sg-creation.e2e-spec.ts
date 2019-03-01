///<reference path="../node_modules/@types/jasmine/index.d.ts"/>
import { VMCreation } from './pages/vm-creation.po';
import { VMDeploy } from './pages/vm-deploy.po';
import { browser, by, element } from 'protractor';
import { VMList } from './pages/vm-list.po';
import { Login } from './pages/login.po';
import { VMSidebar } from './pages/vm-sidebar.po';
import { AccessVM } from './pages/vm-access.po';
import { SGList } from './pages/sg-list.po';
import { SGSidebar } from './pages/sg-sidebar.po';
import { SGCreation } from './pages/sg-creation.po';
import { ImageList } from './pages/template-list.po';
import { ImageSidebar } from './pages/template-sidebar.po';
import { variable } from '@angular/compiler/src/output/output_ast';

describe('e2e-test-sg-creation', () => {
  let page: SGCreation;
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
    browser.waitForAngularEnabled(false);
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
    page = new SGCreation();
  });

  it('Create custom firewall template', () => {
    // sglist.answerForVMcreation(2);
    // browser.sleep(2000);
    sglist.clickFirewallMenu();
    sglist.clickCreateSG();
    browser.sleep(1000);
    const description = page.description;
    page.setSGDescription(description);
    browser.sleep(1000);
    page.clickADDbutton(); // click ADD
    browser.sleep(1000);
    page.verifyBuildNewSGModal();
    browser.sleep(1000);
    expect(page.buttonCreateIsEnabled()).toBeFalsy('Button "Create" should be disabled');
    browser.sleep(1000);
    const name = page.name;
    page.setSGName(name);
    browser.sleep(2000);
    expect(page.buttonCreateIsEnabled()).toBeTruthy('Button "Create" should be enabled');
    browser.sleep(1000);
    page.clickCreateButton(); // click "Create button"
    browser.sleep(10000);
  });
});
