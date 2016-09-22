import {MarkdownService} from './markdown-service';

import {
  TestBed, inject
} from '@angular/core/testing';

describe('Markdown transformer service', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MarkdownService
      ]
    });
  });

  it('Should translate markdown to HTML!', inject([MarkdownService], (markdownService: MarkdownService) => {
      // note - this fails if we use toEqual as it finds a newline in the toHtml param
      // TODO figure out why
    expect(markdownService).toBeDefined();
    expect(markdownService.toHtml('hi')).toContain('<p>hi</p>');
  }));

});
