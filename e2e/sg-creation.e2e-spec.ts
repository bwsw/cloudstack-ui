import { browser } from 'protractor';
import { Login } from './pages/login.po';
import { VMSidebar } from './pages/vm-sidebar.po';
import { SGList } from './pages/sg-list.po';
import { SGSidebar } from './pages/sg-sidebar.po';
import { SGCreation } from './pages/sg-creation.po';

describe('e2e-test-sg-creation', () => {
  let page: SGCreation;
  let login: Login;
  let sidebar: VMSidebar;
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
  });

  beforeEach(() => {
    sidebar = new VMSidebar();
    sglist = new SGList();
    sgsidebar = new SGSidebar();
  });

  it('Create custom firewall template, verify rules', () => {
    sglist.clickFirewallMenu();
    sglist.clickCreateSG();
    sglist.waitDialogModal();
    page = new SGCreation();
    page.setSGDescription(page.description);
    page.clickADDRules();
    page.verifyBuildNewSGModal();
    page.selectTemplate(0);
    page.getNetworkRules().then(expectedRules => {
      expect(page.getSaveRulesButton().isEnabled()).toBeTruthy('Button Save should be enabled');
      page.getSaveRulesButton().click();
      expect(page.buttonCreateSGEnabled()).toBeFalsy('Button Create should be disabled');
      page.setSGName(page.name);
      expect(page.buttonCreateSGEnabled()).toBeTruthy('Button Create should be enabled');
      page.clickCreateSGButton();
      page.waitCreatingTemplate(page.name);
      sglist.clickSGActionBox();
      sglist.clickSGRules();
      sglist.getElementFromRules().then(actualRules => {
        expect(actualRules).toEqual(expectedRules);
      });
      sglist.closeSGRules();
    });
  });

  it('Verify custom SG card: name, description', () => {
    expect(sglist.getSGNameCard(page.name)).toBeTruthy('No card with that name');
    expect(sglist.getSGDescriptionCard(page.name, page.description)).toBeTruthy(
      'No card with that description',
    );
  });

  it('Verify custom Sidebar: name, description , type', () => {
    sglist.clickOpenSidebar(page.name);
    expect(sgsidebar.getSGName()).toEqual(page.name);
    expect(sgsidebar.getSGDescription()).toEqual(page.description);
    expect(sgsidebar.getSGType()).toEqual('custom-template');
    sgsidebar.clickTagTab();
    sgsidebar.clickChekbox();
    expect(sgsidebar.getTagKey('csui.security-group.type').isPresent()).toBeTruthy(
      'csui.security-group.type',
    );
    expect(sgsidebar.getTagValue('custom-template').isPresent()).toBeTruthy('custom-template');
    sgsidebar.clickChekbox();
    sgsidebar.clickClose();
  });

  it('Create template in Shared Security Group, verify rules', () => {
    sglist.clickSharedTab();
    sglist.clickCreateSG();
    sglist.waitDialogModal();
    page = new SGCreation();
    page.setSGDescription(page.description);
    page.clickADDRules(); // click ADD
    page.selectTemplate(0);
    page.getNetworkRules().then(expectedRules => {
      expect(page.getSaveRulesButton().isEnabled()).toBeTruthy('Button Save should be enabled');
      page.getSaveRulesButton().click();
      expect(page.buttonCreateSGEnabled()).toBeFalsy('Button Create should be disabled');
      page.setSGName(page.name);
      expect(page.buttonCreateSGEnabled()).toBeTruthy('Button Create should be enabled');
      page.clickCreateSGButton();
      page.waitCreatingTemplate(page.name);
      sglist.clickSGActionBox();
      sglist.clickSGRules();
      sglist.getElementFromRules().then(actualRules => {
        expect(actualRules).toEqual(expectedRules);
      });
      sglist.closeSGRules();
    });
  });

  it('Verify shared SG card: name, description', () => {
    expect(sglist.getSGNameCard(page.name)).toBeTruthy('No card with that name');
    expect(sglist.getSGDescriptionCard(page.name, page.description)).toBeTruthy(
      'No card with that description',
    );
  });

  it('Verify shared Sidebar: name, description , type', () => {
    sglist.clickOpenSidebar(page.name);
    expect(sgsidebar.getSGName()).toEqual(page.name);
    expect(sgsidebar.getSGDescription()).toEqual(page.description);
    expect(sgsidebar.getSGType()).toEqual('shared');
    sgsidebar.clickClose();
  });
});
