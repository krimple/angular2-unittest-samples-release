import { Angular2UnittestSamplesReleasePage } from './app.po';

describe('angular2-unittest-samples-release App', function() {
  let page: Angular2UnittestSamplesReleasePage;

  beforeEach(() => {
    page = new Angular2UnittestSamplesReleasePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
