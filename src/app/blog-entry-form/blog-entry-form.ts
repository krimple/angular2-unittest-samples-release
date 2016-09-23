import {Component, EventEmitter, OnInit} from '@angular/core';
import {BlogEntry} from "../domain/blog-entry";
import {Input, Output} from "@angular/core/src/metadata/directives";
import {BlogService} from "../services/blog-service";

@Component({
  selector: 'blog-entry-form',
  template: `
<form #myForm="ngForm">
  <div class="form-group row">
      <label for="blog-title" class="col-sm-2 form-control-label">Title</label>
      <div class="col-sm-10">
        <input id="blog-title" class="form-control"
             type="text" name="title" [(ngModel)]="blog.title">
      </div>
  </div>
  <div class="form-group row">
      <label for="blog-content" class="col-sm-2 form-control-label">Content</label>
     <div class="col-sm-10">
        <textarea id="blog-content"
            class="form-control"
            name="contentMarkdown"
            (keyup)="render(blog)"
            [(ngModel)]="blog.contentMarkdown">
       </textarea>
    </div>
  </div>
  <button class="btn btn-primary" (click)="saveBlogEntry(blog)">Save</button>
  <h3>Content preview</h3>
  <div class="jumbotron">
     <div [innerHtml]="blog.contentRendered"></div>
  </div>
</form>`
})
export class BlogEntryFormComponent implements OnInit {
  @Input() blog: BlogEntry;
  @Output() onsubmitted: EventEmitter<boolean>;

  constructor(private blogService: BlogService) {
  }

  ngOnInit() {
    console.dir(this.blog);
  }

  onSave() {
   this.blogService.saveBlog(this.blog).subscribe(
     () => {
       this.onsubmitted.emit(true);
     });
  }
}
