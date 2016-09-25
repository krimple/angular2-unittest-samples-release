import {
  TestBed,
  ComponentFixture, getTestBed, fakeAsync, tick, inject
} from '@angular/core/testing';
import {BlogRollComponent} from './blog-roll.component';
import {BlogService} from '../services/blog.service';
import {MarkdownService} from '../services/markdown.service';
import {FormsModule} from "@angular/forms";
import {
  HttpModule, XHRBackend, ResponseOptions,
  Response, RequestMethod, Http,
  BaseRequestOptions, ResponseType
} from "@angular/http";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {BlogEntryFormComponent} from "../blog-entry-form/blog-entry-form.component";
import {Observable} from "rxjs";

describe('Blog Roll Component...', () => {
  let mockBackend: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        BlogRollComponent,
        BlogEntryFormComponent
      ],
      providers: [
        BlogService,
        MarkdownService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory:
            (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
               return new Http(backend, defaultOptions);
            },
            deps: [MockBackend, BaseRequestOptions]
        }
      ],
      imports: [
        FormsModule,
        HttpModule
      ]
    });

 });

  function setupComponent() {
    let blogRoll: ComponentFixture<BlogRollComponent> = getTestBed().createComponent(BlogRollComponent);
    let nativeElement = blogRoll.nativeElement;
    let blogRollComponent = blogRoll.componentInstance;
    mockBackend = getTestBed().get(MockBackend);
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

        console.log(`Connection returned, ${connection.request.url} isBlogListSearch? ${isBlogListSearch}, isBlogSingle? ${isBlogSingle}, isDeleteBlog? ${isDeleteBlog}`);
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

     return {blogRoll: blogRoll, nativeElement: nativeElement, component: blogRollComponent};

  }

  it('contains list of blog items by default', fakeAsync(inject([BlogService], (blogService) => {
    getTestBed().compileComponents().then(() => {
      /*spyOn(blogService, 'getBlogs').and.callFake(() => {
        return Observable.of([
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
                }
        ]);
      });
      */

      let {blogRoll, nativeElement, component} = setupComponent();
      component.ngOnInit();
      tick();
      // we start with the blog roll panel visible
      blogRoll.detectChanges();
      expect(component.editing).toBe(false);
      expect(nativeElement.querySelector('#blog-editor-panel') === null).toBe(true);
      expect(nativeElement.querySelector('#blog-roll-panel') === null).toBe(false);

      blogRoll.detectChanges();
      let trs = nativeElement.querySelectorAll('tr.rows');
      expect(trs.length).toBe(2);
      let tdTitleContent = trs[0].cells[1].textContent;
      let tdRenderedContent = trs[0].cells[2].textContent;
      expect(tdTitleContent).toContain('Article Title...');
      expect(tdRenderedContent).toContain('*Hi there*');
    });
  })));

  it('should show blog editor div when New is clicked...', fakeAsync(() => {
    getTestBed().compileComponents().then(() => {
      let {blogRoll, nativeElement, component} = setupComponent();
      component.ngOnInit();
      blogRoll.detectChanges();

      // trigger the 'new button' link and swap visible panels
      nativeElement.querySelector('a#new-blog-entry').click();

      // process the click event
      blogRoll.detectChanges();

      tick();

      expect(blogRoll.componentInstance.editing).toBe(true);
      expect(nativeElement.querySelector('blog-entry-form') === null).toBe(false);
      expect(nativeElement.querySelector('#blog-roll-panel') === null).toBe(true);
    });
  }));

  it('should open the editing pane if the edit button is clicked', () => {
    getTestBed().compileComponents().then(() => {
      var {blogRoll, nativeElement, component} = setupComponent();
      component.ngOnInit();
      tick();
      // we start with the blog roll panel visible
      blogRoll.detectChanges();

      // trigger the 'new' button and swap visible panels
      nativeElement.querySelector('a#new-blog-entry:first-of-type').click();

      // process the click event
      blogRoll.detectChanges();

      // make sure we have a 'blog' variable and that it is assigned
      // to the first blog element in the array since we clicked that one
      expect(component.editing).toBe(true);
      expect(component.blog).toBeDefined();
      // it's by referende, so toBe() is good.  If we wanted to do
      // a deep compare of fields we could use toEqual().
      expect(component.blog).toBe(component.blogs[0]);
      expect(blogRoll.componentInstance.editing).toBe(true);
      expect(nativeElement.querySelector('blog-entry-form') === null).toBe(false);
      expect(nativeElement.querySelector('#blog-roll-panel') === null).toBe(true);
    });
  });

  it('should remove an entity if a delete button is clicked',
    fakeAsync(inject([BlogService], (blogService) => {
    getTestBed().compileComponents().then(() => {
      // steal the confirm function...
      spyOn(blogService, 'deleteBlogEntry').and.callFake(() => {
        return Observable.of(
          new Response(new ResponseOptions({ body: "deleted", status: 201})));
      });
      let oldconfirm = window.confirm;
      window['confirm'] = () => { return true };

      var {blogRoll, nativeElement, component} = setupComponent();
      component.ngOnInit();
      tick();
      // we start with the blog roll panel visible
      blogRoll.detectChanges();

      tick();
      // trigger the 'delete' button and swap visible panels
      nativeElement.querySelectorAll('a.delete-blog-entry')[0].click();

      tick();
      // process the click event
      blogRoll.detectChanges();

      tick();
      // we have one less, so...
      expect(component.blogs.length).toBe(1);
      expect(blogRoll.componentInstance.editing).toBe(false);
      expect(nativeElement.querySelector('blog-entry-form')).toBe(null);
      expect(nativeElement.querySelector('#blog-roll-panel')).not.toBe(null);
      expect(nativeElement.querySelectorAll('tr#rows').length).toBe(1);
      window['confirm'] = oldconfirm;
    });
  })));
});
