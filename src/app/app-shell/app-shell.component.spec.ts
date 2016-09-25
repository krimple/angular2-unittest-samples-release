import {AppShellComponent} from './app-shell.component';
import {
    async,
    inject,
    TestBed,
    getTestBed,
    ComponentFixture
} from '@angular/core/testing';
import {BlogEntry} from '../domain/blog-entry';
import {BlogService} from '../services/blog.service';
import {MarkdownService} from '../services/markdown.service';
import {BlogRollComponent} from '../blog-roll/blog-roll.component';
import {FormsModule} from "@angular/forms";
import {HttpModule, BaseRequestOptions, Http} from "@angular/http";
import {BlogEntryFormComponent} from "../blog-entry-form/blog-entry-form.component";
import {Observable} from "rxjs";
import {MockBackend} from "@angular/http/testing";

describe('Application Shell', () => {
  beforeEach(() => {
     TestBed.configureTestingModule({
      declarations: [
        AppShellComponent,
        BlogRollComponent,
        BlogEntryFormComponent
      ],
      providers: [
        BlogService,
        MockBackend,
        MarkdownService,
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

  it('Can be created', async(inject([BlogService], (blogService) => {


    getTestBed().compileComponents().then(() => {
      spyOn(blogService, 'getBlogs').and.callFake(() => {
      return Observable.of([
                 new BlogEntry('a', 'a', 'a', 1),
                 new BlogEntry('b', 'b', 'b', 2)
         ]);
      });
      let appShell: ComponentFixture<AppShellComponent> = getTestBed().createComponent(AppShellComponent);
      appShell.detectChanges();
      let blogRoll = appShell.nativeElement.getElementsByTagName('<blog-roll>');
      expect(blogRoll).toBeDefined();
    });
 })));
});
