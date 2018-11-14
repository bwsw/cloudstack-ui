import { VMCreation } from './pages/vm-creation.po';

describe('e2e-test-vm-creation', () => {
  let page: VMCreation;

  beforeEach(() => {
    page = new VMCreation();
    page.navigateTo();
  });

  it('Create VM with ISO, group, aff-group', () => {
    page.login();
  });
});
