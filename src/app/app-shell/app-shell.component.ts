import {Component} from '@angular/core';

@Component({
  selector: 'app-shell',
  template: `
      <div class="container">
        <blog-roll (edit)="setBlog(blog)"></blog-roll>
      </div>
    `,
})
export class AppShellComponent {
}
