import {
  TestBed,
  ComponentFixture, getTestBed, fakeAsync, tick, inject, async
} from '@angular/core/testing';
import {
    HttpModule, ResponseOptions,
    Response, RequestMethod, Http,
    BaseRequestOptions, XHRBackend
} from "@angular/http";
import {MockBackend, MockConnection} from '@angular/http/testing';
import {Observable} from 'rxjs';

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
                        },
                    deps: [MockBackend, BaseRequestOptions],
                }
            ],
            imports: [
                FormsModule,
                HttpModule
            ]
        });

        TestBed.compileComponents();
    }));

  function mockBackendFunctions() {
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

  it('contains list of blog items by default', fakeAsync(() => {
    getTestBed().compileComponents().then(() => {
      mockBackendFunctions();

      let fixture: ComponentFixture<BlogRollComponent> = getTestBed().createComponent(BlogRollComponent);
      fixture.componentInstance.ngOnInit();
      tick();
      let blogRoll = fixture.componentRef;
      // we start with the blog roll panel visible
      fixture.detectChanges();

      expect(fixture.componentInstance.editing).toBe(false);
      expect(fixture.nativeElement.querySelector('#blog-editor-panel') === null).toBe(true);
      expect(fixture.nativeElement.querySelector('#blog-roll-panel') === null).toBe(false);

      fixture.detectChanges();
      let trs = fixture.nativeElement.querySelectorAll('tr.rows');
      expect(trs.length).toBe(2);
      let tdTitleContent = trs[0].cells[1].textContent;
      let tdRenderedContent = trs[0].cells[2].textContent;
      expect(tdTitleContent).toContain('Article Title...');
      expect(tdRenderedContent).toContain('*Hi there*');
    });
  }));

  it('should show blog editor div when New is clicked...', fakeAsync(() => {
      mockBackendFunctions();

      let fixture: ComponentFixture<BlogRollComponent> = getTestBed().createComponent(BlogRollComponent);
      fixture.componentInstance.ngOnInit();
      fixture.detectChanges();

      tick();

      // trigger the 'new button' link and swap visible panels
      fixture.nativeElement.querySelector('a#new-blog-entry').click();

      // process the click event
      fixture.detectChanges();

      tick();

      expect(fixture.componentInstance.editing).toBe(true);
      expect(fixture.nativeElement.querySelector('blog-entry-form') === null).toBe(false);
      expect(fixture.nativeElement.querySelector('#blog-roll-panel') === null).toBe(true);
  }));

  it('should open the editing pane if the edit button is clicked', fakeAsync(() => {
    getTestBed().compileComponents().then(() => {
      mockBackendFunctions();

      let fixture: ComponentFixture<BlogRollComponent> = getTestBed().createComponent(BlogRollComponent);
      fixture.componentInstance.ngOnInit();
      // we start with the blog roll panel visible
      fixture.detectChanges();

      tick();

      // trigger the 'new' button and swap visible panels
      fixture.nativeElement.querySelector('a.edit-blog-entry:first-of-type').click();

      tick();

      // process the click event
      fixture.detectChanges();

      tick();

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
  }));

  // TODO - this is a two-step test, and so the normal set of mock setups won't work
  // since the first request will be a DELETE of /blogs/id and the second will be a
  // GET of /blogs to refresh the list.  Disabling for now until after the conference
  xit('should remove an entity if a delete button is clicked',
    fakeAsync(inject([BlogService], (blogService) => {
    getTestBed().compileComponents().then(() => {
      mockBackendFunctions();

      let fixture: ComponentFixture<BlogRollComponent> = getTestBed().createComponent(BlogRollComponent);

       // steal the confirm function...
      spyOn(blogService, 'deleteBlogEntry').and.callFake(() => {
        return Observable.of(
          new Response(new ResponseOptions({ body: "deleted", status: 201})));
      });
      let oldconfirm = window.confirm;
      window['confirm'] = () => { return true };

      fixture.componentInstance.ngOnInit();
      tick();
      // we start with the blog roll panel visible
      fixture.detectChanges();

      tick();
      // trigger the 'delete' button and swap visible panels
      fixture.nativeElement.querySelectorAll('a.delete-blog-entry')[0].click();

      tick();
      // process the click event
      fixture.detectChanges();

      tick();
      // we have one less, so...
      expect(fixture.componentInstance.blogs.length).toBe(1);
      expect(fixture.componentInstance.editing).toBe(false);
      expect(fixture.nativeElement.querySelector('blog-entry-form')).toBe(null);
      expect(fixture.nativeElement.querySelector('#blog-roll-panel')).not.toBe(null);
      expect(fixture.nativeElement.querySelectorAll('tr#rows').length).toBe(1);
      window['confirm'] = oldconfirm;
    });
  })));
});


// alternative approaches

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

