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

describe('App: Angular2UnittestSamplesRelease', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        AppShellComponent,
        BlogRollComponent
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

  it(`should have as title 'app works!'`, async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app works!');
  }));

  it('should render title in a h1 tag', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('app works!');
  }));
});
