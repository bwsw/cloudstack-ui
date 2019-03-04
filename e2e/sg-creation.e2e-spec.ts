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
    browser.sleep(2000);
    sglist.clickFirewallMenu();
    browser.sleep(2000);
    sglist.clickCreateSG();
    // browser.sleep(2000);
    page.setSGDescription(page.description);
    browser.sleep(2000);
    page.clickADDbutton(); // click ADD
    expect(page.getSaveButton().isEnabled()).toBeFalsy('Button "Save" should be disabled');
    browser.sleep(2000);
    page.verifyBuildNewSGModal();
    browser.sleep(2000);
    const rules = page.takeRulesText().then();
    expect(page.getSaveButton().isEnabled()).toBeTruthy('Button "Save" should be enabled');
    page.getSaveButton().click();
    expect(page.buttonCreateIsEnabled()).toBeFalsy('Button "Create" should be disabled');
    browser.sleep(2000);
    page.setSGName(page.name);
    browser.sleep(2000);
    expect(page.buttonCreateIsEnabled()).toBeTruthy('Button "Create" should be enabled');
    page.clickCreateButton(); // click "Create button"

    // Verify custom SG card: name, description, rules
    expect(sglist.getSGNameCard()).toEqual(page.name);
    expect(sglist.getSGDescriptionCard()).toEqual(page.description);
    sglist.clickSGMenu();
    sglist.clickRulesbutton();

    // expect(sglist.verifyCardInfo(page.name, page.description, rules)).toBeTruthy('Card information not correct');
    // browser.sleep(2000);
    // expect(sgsidebar.verifySidebar(page.name, page.description)).toBeTruthy('Card information in Sidebar not correct');
  });
});
