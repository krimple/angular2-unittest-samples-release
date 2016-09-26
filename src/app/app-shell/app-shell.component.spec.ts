import {AppShellComponent} from './app-shell.component';
import {
  async,
  fakeAsync,
  tick,
  inject,
  TestBed,
  getTestBed,
  ComponentFixture
} from '@angular/core/testing';
import {BlogService} from '../services/blog.service';
import {MarkdownService} from '../services/markdown.service';
import {BlogRollComponent} from '../blog-roll/blog-roll.component';
import {FormsModule} from '@angular/forms';
import {HttpModule, BaseRequestOptions, Http, ConnectionBackend, Response, ResponseOptions} from '@angular/http';
import {BlogEntryFormComponent} from '../blog-entry-form/blog-entry-form.component';
import {MockBackend, MockConnection} from '@angular/http/testing';

describe('Application Shell', () => {
  let mockBackend: MockBackend;
  let testBed: TestBed;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppShellComponent,
        BlogRollComponent,
        BlogEntryFormComponent
      ],
      providers: [
        BlogService,
        MarkdownService,
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
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
    testBed = getTestBed();
    mockBackend = testBed.get(MockBackend);
  });

  it('Can be created', fakeAsync(() => {
    testBed.compileComponents().then(() => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
            console.log('we subscribed to a mock connection', connection);
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
              })));

        let fixture: ComponentFixture<AppShellComponent> = testBed.createComponent(AppShellComponent);
        tick();
        let blogRoll = fixture.nativeElement.getElementsByTagName('blog-roll');
        expect(blogRoll).toBeDefined();
      });
    });
  }));
});
