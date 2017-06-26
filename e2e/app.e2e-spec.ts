import { CloudstackUiPage } from './app.po';

describe('cloudstack-ui App', () => {
  let page: CloudstackUiPage;

  beforeEach(() => {
    page = new CloudstackUiPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
