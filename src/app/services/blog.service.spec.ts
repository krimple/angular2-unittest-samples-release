import {
  TestBed,
  getTestBed,
  async,
  inject
} from '@angular/core/testing';
import {
  Headers, BaseRequestOptions,
  Response, HttpModule, Http, XHRBackend, RequestMethod
} from '@angular/http';

import {ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {BlogEntry} from '../domain/blog-entry';
import {BlogService} from './blog.service';

describe('Blog Service', () => {
  let mockBackend: MockBackend;

  // All heed this block - it is required so that the test injector
  // is properly set up. Without doing this, you won't get the
  // fake backend injected into Http.

  // Also, you need to inject MockBackend as a provider before you wire
  // it to replace XHRBackend with the provide function!  So this is all
  // extremely important to set up right.
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
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
        HttpModule
      ]
    });
    mockBackend = getTestBed().get(MockBackend);
  }));

  it('should get blogs', done => {
    let blogService: BlogService;

    getTestBed().compileComponents().then(() => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
                body: [
                  {
                    id: 26,
                    contentRendered: '<p><b>Hi there</b></p>',
                    contentMarkdown: '*Hi there*'
                  }]
              }
            )));
        });

        blogService = getTestBed().get(BlogService);
        expect(blogService).toBeDefined();

        blogService.getBlogs().subscribe((blogs: BlogEntry[]) => {
            expect(blogs.length).toBeDefined();
            expect(blogs.length).toEqual(1);
            expect(blogs[0].id).toEqual(26);
            done();
        });
    });
  });

  it('should get blogs async',
    async(inject([BlogService], (blogService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
                body: [
                  {
                    id: 26,
                    contentRendered: '<p><b>Hi there</b></p>',
                    contentMarkdown: '*Hi there*'
                  }]
              }
            )));
        });

      blogService.getBlogs().subscribe(
        (data) => {
          expect(data.length).toBe(1);
          expect(data[0].id).toBe(26);
          expect(data[0].contentMarkdown).toBe('*Hi there*');
      });
    })));

  it('should fetch a single blog entry by a key',
    async(inject([BlogService], (blogService) => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {

          // make sure the URL is correct
          expect(connection.request.url).toMatch(/\/server\/api\/blogs\/3/);
          connection.mockRespond(
            new Response(
              new ResponseOptions({
                body: {
                  id: 3,
                  contentRendered: '<p><b>Demo</b></p>',
                  contentMarkdown: '*Demo*'
                }
              }))
          );
        }
      );

      blogService.getBlog(3).subscribe(
        (blogEntry) => {
          expect(blogEntry.id).toBe(3);
          expect(blogEntry.contentMarkdown).toBe('*Demo*');
          expect(blogEntry.contentRendered).toBe('<p><b>Demo</b></p>')
        }
      );
  })));

  it('should insert new blog entries',
    async(inject([BlogService], (blogService) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        // is it the correct REST type for an insert? (POST)
        expect(connection.request.method).toBe(RequestMethod.Post);
        // okey dokey,
        connection.mockRespond(new Response(new ResponseOptions({status: 201})));
      });

      let data: BlogEntry = new BlogEntry('Blog Entry', '<p><b>Hi</b></p>', '*Hi*', null);
      blogService.saveBlog(data).subscribe(
        (successResult) => {
          expect(successResult).toBeDefined();
          expect(successResult.status).toBe(201);
        });
    })));

  it('should save updates to an existing blog entry',
    async(inject([BlogService], (blogService) => {
      mockBackend.connections.subscribe(connection => {
        // is it the correct REST type for an update? (PUT)
        expect(connection.request.method).toBe(RequestMethod.Put);
        connection.mockRespond(new Response(new ResponseOptions({status: 204})));
      });

      let data: BlogEntry = new BlogEntry('Blog Entry', '<p><b>Hi</b></p>', '*Hi*', 10);
      blogService.saveBlog(data).subscribe(
        (successResult) => {
          expect(successResult).toBeDefined();
          expect(successResult.status).toBe(204);
        });
    })));

  it('should delete an existing blog entry',
    async(inject([BlogService], (blogService) => {
      mockBackend.connections.subscribe(connection => {
        expect(connection.request.method).toBe(RequestMethod.Delete);
        connection.mockRespond(new ResponseOptions({status: 204}));
      });

      blogService.deleteBlogEntry(23).subscribe(
        (successResult) => {
          expect(successResult).toBeDefined();
          expect(successResult.status).toBe(204);
        },
        (errorResult) => {
          throw (errorResult);
        });
    })));
});
