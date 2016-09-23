import {
  TestBed,
  ComponentFixture, getTestBed, async
} from '@angular/core/testing';
import {BlogRollComponent} from './blog-roll.component';
import {BlogService} from '../services/blog.service';
import {MarkdownService} from '../services/markdown.service';
import {FormsModule} from "@angular/forms";
import {HttpModule, XHRBackend, ResponseOptions, Response} from "@angular/http";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {BlogEntryFormComponent} from "../blog-entry-form/blog-entry-form.component";

let mockResponse = {
        id: 26,
        title: 'The title',
        contentRendered: '<p><b>Hi there</b></p>',
        contentMarkdown: '*Hi there*'
};

describe('Blog Roll Component...', () => {
  let mockBackend: MockBackend;

  // do this 1x, not for each test method ???
  beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          BlogRollComponent,
          BlogEntryFormComponent
        ],
        providers: [
          BlogService,
          MarkdownService,
          { provide: XHRBackend, useClass: MockBackend }
        ],
        imports: [
          FormsModule,
          HttpModule
        ]
      });

    mockBackend = getTestBed().get(XHRBackend);
  });

  it('shows list of blog items by default', async(() => {
    getTestBed().compileComponents().then(() => {
      mockBackend.connections.subscribe(
        (connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
                body: [
                  {
                    id: 26,
                    title: 'Article Title...',
                    contentRendered: '<p><b>Hi there</b></p>',
                    contentMarkdown: '*Hi there*'
                  }]
              })));
        });

      let blogRoll: ComponentFixture<BlogRollComponent> = getTestBed().createComponent(BlogRollComponent);
      blogRoll.componentInstance.ngOnInit();
      blogRoll.autoDetectChanges(true);
      let nativeElement = blogRoll.nativeElement;
      blogRoll.detectChanges();
      // we start with the blog roll panel visible
      expect(blogRoll.componentInstance.editing).toBe(false);
      expect(nativeElement.querySelector('#blog-editor-panel') === null).toBe(true);
      expect(nativeElement.querySelector('#blog-roll-panel') === null).toBe(false);

      blogRoll.detectChanges();
      let trs = nativeElement.querySelectorAll('tr');
      expect(trs.length).toBe(2);

      console.log('row 0', trs[0].innerHTML);
      console.log('row 1', trs[1].innerHTML);
      let tdTitleContent = trs[1].cells[1].textContent;
      let tdRenderedContent = trs[1].cells[2].textContent;
      expect(tdTitleContent).toContain('Article Title...');
      expect(tdRenderedContent).toContain('*Hi there*');
    });
  }));
/*
  it('should show blog editor div when New is clicked...', () => {
    let blogRoll: ComponentFixture = getTestBed().get(BlogService);
    let nativeElement = blogRoll.nativeElement;
    blogRoll.detectChanges();

    // trigger the 'new' button and swap visible panels
    blogRoll.nativeElement.querySelector('i.glyphicon-plus-sign').click();

    // process the click event
    blogRoll.detectChanges();

    expect(blogRoll.componentInstance.editing).toBe(true);
    expect(nativeElement.querySelector('#blog-editor-panel') === null).toBe(false);
    expect(nativeElement.querySelector('#blog-roll-panel') === null).toBe(true);
  });

  it('should open the editing pane if the edit button is clicked', () => {
    let blogRoll: ComponentFixture = getTestBed().get(BlogService);
    let nativeElement = blogRoll.nativeElement;
    blogRoll.detectChanges();
    nativeElement.querySelector('i.glyphicon-edit').click();
    blogRoll.detectChanges();
    expect(blogRoll.componentInstance.editing).toBe(true);
    let blog = blogRoll.componentInstance.blog;
    expect(blog).toBeDefined();
    expect(blog.id).toBeDefined();
  });
  /*/
});

