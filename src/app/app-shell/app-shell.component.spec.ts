import {AppShellComponent} from './app-shell.component';
import {
    async,
    TestBed,
    getTestBed,
    ComponentFixture
} from '@angular/core/testing';
import {BlogService} from '../services/blog.service';
import {BlogRollComponent} from '../blog-roll/blog-roll.component';
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {BlogEntryFormComponent} from "../blog-entry-form/blog-entry-form.component";

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
      ],
      imports: [
        FormsModule,
        HttpModule
      ]
    });
  });

  it('Can be created', async(() => {
    getTestBed().compileComponents().then(() => {
      let appShell: ComponentFixture<AppShellComponent> = getTestBed().createComponent(AppShellComponent);
      appShell.detectChanges();
      let blogRoll = appShell.nativeElement.getElementsByTagName('<blog-roll>');
      expect(blogRoll).toBeDefined();
    });
 }));
});
