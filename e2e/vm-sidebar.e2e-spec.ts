///<reference path="../node_modules/@types/jasmine/index.d.ts"/>
import { VMCreation } from './pages/vm-creation.po';
import { VMDeploy } from './pages/vm-deploy.po';
import { browser } from 'protractor';
import { VMList } from './pages/vm-list.po';
import { Login } from './pages/login.po';
import { VMSidebar } from './pages/vm-sidebar.po';

describe('e2e-test-vm-sidebar', () => {
  let page: VMCreation;
  let deploy: VMDeploy;
  let login: Login;
  let vmlist: VMList;
  let sidebar: VMSidebar;

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
    deploy = new VMDeploy();
    sidebar = new VMSidebar();
  });

  /* it('Verify VM color is changed', () => {
    vmlist.clickOpenSidebar(0);
    sidebar.clickColorChange().then((color) => {
      sidebar.clickClose();
      vmlist.getVMColor(0).then ( (vmcolor) => {
        expect(vmcolor).toContain(color);
      });
    });
  });

  it('Verify description is changed', () => {
    vmlist.clickOpenSidebar(0);
    sidebar.setDescription("desc");
    sidebar.clickClose();
    vmlist.clickBell();
    expect(vmlist.verifyBellMessage("Description changed")).toBeTruthy();
  });*/

  it('Verify group is changed', () => {
    vmlist.clickOpenSidebar(0);
    sidebar.setGroup('group');
    sidebar.clickClose();
    vmlist.clickBell();
    expect(vmlist.verifyBellMessage('Instance group changed')).toBeTruthy();
  });
});
