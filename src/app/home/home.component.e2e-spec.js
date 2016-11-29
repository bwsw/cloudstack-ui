describe('Home', function () {

  beforeEach(function () {
    browser.get('/');
  });

  it('should have <cs-home>', function () {
    var home = element(by.css('cs-app cs-home'));
    expect(home.isPresent()).toEqual(true);
    expect(home.getText()).toEqual("Home Works!");
  });

});
