import {Observable} from 'rxjs/Rx';
import {BlogRollComponent} from './blog-roll';
import {BlogEntry} from '../domain/blog-entry';
import {BlogService} from '../services/blog-service';
import {MarkdownService} from '../services/markdown-service';

class MockMarkdownService extends MarkdownService {
  toHtml(text: string): string {
    return text;
  }
}

class MockBlogService extends BlogService {
  constructor() {
    super(null);
  }

  getBlogs() {
    console.log('sending fake answers!');
    return Observable.of([
      {
        id: 26,
        title: 'The title',
        contentRendered: '<p><b>Hi there</b></p>',
        contentMarkdown: '*Hi there*'
      }]);
  }
}

describe('Blog Roll unit test', () => {
  let blogRoll: BlogRollComponent,
      blogService: BlogService,
      markdownService: MarkdownService;

  beforeEach(() => {
    blogService = new MockBlogService();
    markdownService = new MockMarkdownService();
    blogRoll = new BlogRollComponent(blogService, markdownService);
  });

  it('shows list of blog items by default - unit', () => {
   blogRoll.ngOnInit();
   expect(blogRoll.blogs.length).toBe(1);
   expect(blogRoll.blog).toBeUndefined();
   expect(blogRoll.editing).toBe(false);
  });

  it('should show blog editor div when newBlogEntry is triggered...',  () => {
   blogRoll.ngOnInit();
   // we start with the blog roll panel visible
   expect(blogRoll.editing).toBe(false);

   // trigger the 'new' event
   blogRoll.newBlogEntry();
   expect(blogRoll.editing).toBe(true);
   expect(blogRoll.blog).toBeDefined();
  });

  it('should pass data to the blogService during save', () => {
    blogRoll.ngOnInit();
    // make this a synchronous instantaneous call
    // and since we only look for successful resolution it
    // doesn't matter what we stub back
    spyOn(blogService, 'saveBlog')
      .and.returnValue(Observable.of({ complete: true}));

    let entry = new BlogEntry('I am new', '<p>The content</p>', 'The content', undefined);
    blogRoll.saveBlogEntry(entry);
    expect(blogService.saveBlog).toHaveBeenCalledWith(entry);
  });

  it('should pass a blog item to remove to the blogService during delete', () => {
    blogRoll.ngOnInit();
    // alerts/confirm are an awful idea (short timeframe for this demo)
    // but we can deal with the confirm message box by mocking it away,
    // and returning true to continue processing - thanks Jasmine!
    spyOn(window, 'confirm')
       .and.callFake(() => { return true; });

    // now mock the actual call to
    spyOn(blogService, 'deleteBlogEntry')
       .and.returnValue(Observable.of({ complete: true}));
    let entry = new BlogEntry(null, null, null, 15);
    blogRoll.deleteBlogEntry(entry);

    // collaborator behavior check
    expect(window.confirm).toHaveBeenCalled();
    expect(blogService.deleteBlogEntry).toHaveBeenCalledWith(15);
  });
});


