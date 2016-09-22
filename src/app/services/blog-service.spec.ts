import {
  TestBed,
  getTestBed, async, inject
} from '@angular/core/testing';
import {Injector} from '@angular/core';
import {
  Headers, BaseRequestOptions,
  Response, HttpModule, Http, XHRBackend
} from '@angular/http';
import {ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {BlogEntry} from '../domain/blog-entry';
import {BlogService} from './blog-service';

describe('Blog Service', () => {
  let testBed: TestBed;

  // All heed this block - it is required so that the test injector
  // is properly set up. Without doing this, you won't get the
  // fake backend injected into Http.

  // Also, you need to inject MockBackend as a provider before you wire
  // it to replace XHRBackend with the provide function!  So this is all
  // extremely important to set up right.
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BlogService,
        {provide: XHRBackend, useClass: MockBackend}
      ],
      imports: [
        HttpModule
      ]
    });
    testBed = getTestBed();
  });

  it('should get blogs', done => {
    let mockBackend: MockBackend;
    let blogService: BlogService;

    testBed.compileComponents().then(() => {
      blogService = testBed.get(BlogService);
      expect(blogService).toBeDefined();
      mockBackend = testBed.get(XHRBackend);
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
      blogService.getBlogs().subscribe((blogs: BlogEntry[]) => {
        expect(blogs.length).toBeDefined();
        expect(blogs.length).toEqual(1);
        expect(blogs[0].id).toEqual(26);
        done();
      });
    });
  });

  it('should get blogs async',
    async(inject([XHRBackend, BlogService], (mockBackend, blogService) => {
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

      try {
        blogService.getBlogs().subscribe(
          (data) => {
            expect(data.length).toBe(1);
            expect(data[0].id).toBe(26);
            expect(data[0].contentMarkdown).toBe('*Hi there*');
          });
      } catch (error) {
        fail(error);
      }
    })));

  it('should save updates to an existing blog entry',
    async(inject([XHRBackend, BlogService], (mockBackend, blogService) => {
      mockBackend.connections.subscribe(connection => {
        connection.mockRespond(new ResponseOptions({status: 200}));
      });

      let data: BlogEntry = new BlogEntry('Blog Entry', '<p><b>Hi</b></p>', '*Hi*', 10);
      blogService.saveBlog(data).subscribe(
        (successResult) => {
          expect(successResult).toBeDefined();
          expect(successResult.status).toBe(200);
        });
    })));

  it('should delete an existing blog entry',
    async(inject([XHRBackend, BlogService], (mockBackend, blogService) => {
      mockBackend.connections.subscribe(connection => {
        connection.mockRespond(new ResponseOptions({status: 201}));
      });

      blogService.deleteBlogEntry(23).subscribe(
        (successResult) => {
        },
        (errorResult) => {
          throw (errorResult);
        });
    })));
});
