import {
  TestBed,
  ComponentFixture, getTestBed, async
} from '@angular/core/testing';
import {
    HttpModule, ResponseOptions,
    Response, RequestMethod, Http,
    BaseRequestOptions, XHRBackend
} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {BlogRollComponent} from './blog-roll.component';
import {BlogService} from '../services/blog.service';
import {MarkdownService} from '../services/markdown.service';
import {FormsModule} from '@angular/forms';
import {BlogEntryFormComponent} from '../blog-entry-form/blog-entry-form.component';

describe('Blog Roll Component...', () => {
    let mockBackend: MockBackend;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BlogRollComponent,
                BlogEntryFormComponent
            ],
            providers: [
                MarkdownService,
                BlogService,
                MockBackend,
                BaseRequestOptions,
                {
                    provide: Http,
                    deps: [MockBackend, BaseRequestOptions],
                    useFactory:
                        (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                            return new Http(backend, defaultOptions);
                        }
                }
            ],
            imports: [
                FormsModule,
                HttpModule
            ]
        });

        TestBed.compileComponents();
    }));

  function mockBackendFunctions(testBed: TestBed) {
    mockBackend = testBed.get(MockBackend);
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        // TODO - simplify - when match fails it is null
        let isBlogListSearch = connection.request.url &&
                               connection.request.method === RequestMethod.Get &&
                               connection.request.url.match(/\/server\/api\/blogs/) &&
                               connection.request.url.match(/\/server\/api\/blogs/).length === 1 ? true: false;
        let isBlogSingle = connection.request.url &&
                               connection.request.method === RequestMethod.Get &&
                               connection.request.url.match(/\/server\/api\/blogs\/26/) &&
                               connection.request.url.match(/\/server\/api\/blogs\/26/).length === 1 ? true: false;
        let isDeleteBlog = connection.request.url &&
                               connection.request.method === RequestMethod.Delete &&
                               connection.request.url.match(/\/server\/api\/blogs\/26/) &&
                               connection.request.url.match(/\/server\/api\/blogs\/26/).length === 1 ? true: false;

        /*console.log(`Connection returned, ${connection.request.url}
                     isBlogListSearch? ${isBlogListSearch},
                     isBlogSingle? ${isBlogSingle}, isDeleteBlog? ${isDeleteBlog}`); */
        if(isBlogListSearch) {
          connection.mockRespond(new Response(
            new ResponseOptions({
              body: [
                {
                  id: 26,
                  title: 'Article Title...',
                  contentRendered: '<p><b>Hi there</b></p>',
                  contentMarkdown: '*Hi there*'
                },
                {
                  id: 97,
                  title: 'Article2 Title...',
                  contentRendered: '<p><b>Another blog entry</b></p>',
                  contentMarkdown: '*Another blog entry*'
                }]
            })
          ));
        }

        if (isBlogSingle) {
          connection.mockRespond(new Response(
            new ResponseOptions({
              body: {
                  id: 26,
                  title: 'Article Title...',
                  contentRendered: '<p><b>Hi there</b></p>',
                  contentMarkdown: '*Hi there*'
              }
            })
          ));
        }
        if (isDeleteBlog) {
          connection.mockRespond(new Response(
            new ResponseOptions({
              body: { },
              status: 201
            })
          ));
        }
       });
  }

  it('contains list of blog items by default', () => {
      let testBed = getTestBed();
      mockBackendFunctions(testBed);

      let fixture: ComponentFixture<BlogRollComponent> = getTestBed().createComponent(BlogRollComponent);
      fixture.componentInstance.ngOnInit();

      fixture.detectChanges();

      // blog roll should be visible, blog editor invisible
      expect(fixture.componentInstance.editing).toBe(false);
      expect(fixture.nativeElement.querySelector('#blog-editor-panel') === null).toBe(true);
      expect(fixture.nativeElement.querySelector('#blog-roll-panel') === null).toBe(false);

      // now let's see how many rows exist in our table (should be 2)
      // and check the content that comes from the Http mock
      let trs = fixture.nativeElement.querySelectorAll('tr.rows');
      expect(trs.length).toBe(2);
      let tdTitleContent = trs[0].cells[1].textContent;
      let tdRenderedContent = trs[0].cells[2].textContent;
      expect(tdTitleContent).toContain('Article Title...');
      expect(tdRenderedContent).toContain('*Hi there*');
  });

  it('should show blog editor div when New is clicked...', () => {
      let testBed = getTestBed();
      mockBackendFunctions(testBed);

      let fixture: ComponentFixture<BlogRollComponent> = getTestBed().createComponent(BlogRollComponent);
      fixture.componentInstance.ngOnInit();
      fixture.detectChanges();

      // trigger the 'new button' link and swap visible panels
      fixture.nativeElement.querySelector('a#new-blog-entry').click();

      // process the click event
      fixture.detectChanges();

      expect(fixture.componentInstance.editing).toBe(true);
      expect(fixture.nativeElement.querySelector('blog-entry-form') === null).toBe(false);
      expect(fixture.nativeElement.querySelector('#blog-roll-panel') === null).toBe(true);
  });

  it('should open the editing pane if the edit button is clicked', () => {
    getTestBed().compileComponents().then(() => {
      let testBed = getTestBed();
      mockBackendFunctions(testBed);

      let fixture: ComponentFixture<BlogRollComponent> = getTestBed().createComponent(BlogRollComponent);
      fixture.componentInstance.ngOnInit();
      // we start with the blog roll panel visible
      fixture.detectChanges();

      // trigger the 'new' button and swap visible panels
      fixture.nativeElement.querySelector('a.edit-blog-entry:first-of-type').click();

      // process the click event
      fixture.detectChanges();

      // make sure we have a 'blog' variable and that it is assigned
      // to the first blog element in the array since we clicked that one
      expect(fixture.componentInstance.editing).toBe(true);
      expect(fixture.componentInstance.blog).toBeDefined();
      // it's by reference, so toBe() is good.  If we wanted to do
      // a deep compare of fields we could use toEqual().
      expect(fixture.componentInstance.blog).toBe(fixture.componentInstance.blogs[0]);
      expect(fixture.componentInstance.editing).toBe(true);
      expect(fixture.nativeElement.querySelector('blog-entry-form') === null).toBe(false);
      expect(fixture.nativeElement.querySelector('#blog-roll-panel') === null).toBe(true);
    });
  });

});
