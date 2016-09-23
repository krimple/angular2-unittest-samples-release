/* tslint:disable:no-unused-variable */

import {TestBed, async, getTestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {BlogRollComponent} from "./blog-roll/blog-roll";
import {AppShellComponent} from "./app-shell/app-shell";
import {BlogService} from "./services/blog-service";
import {MarkdownService} from "./services/markdown-service";
import {HttpModule, XHRBackend} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {MockBackend} from "@angular/http/testing";
import {BlogEntryFormComponent} from "./blog-entry-form/blog-entry-form";

describe('App: Angular2UnittestSamplesRelease', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        AppShellComponent,
        BlogRollComponent,
        BlogEntryFormComponent,
      ],
      providers: [
        BlogService,
        MarkdownService,
        {provide: XHRBackend, useClass: MockBackend}
      ],
      imports: [
        FormsModule,
        HttpModule
      ]
    });
  });

  it('should create the app', async(() => {
    getTestBed().compileComponents().then(() => {
      let fixture = TestBed.createComponent(AppComponent);
      let app = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
    });
  }));
});
