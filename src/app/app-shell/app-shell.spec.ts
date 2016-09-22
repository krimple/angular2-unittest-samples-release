import {AppShellComponent} from './app-shell';
import {
    async,
    TestBed,
    getTestBed,
    ComponentFixture
} from '@angular/core/testing';
import {BlogService} from '../services/blog-service';
import {BlogRollComponent} from '../blog-roll/blog-roll';
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

describe('Application Shell', () => {
  beforeEach(() => {
     TestBed.configureTestingModule({
      declarations: [
        AppShellComponent,
        BlogRollComponent
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
