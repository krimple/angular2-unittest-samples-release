import {Component, EventEmitter, OnInit} from '@angular/core';
import {BlogEntry} from "../domain/blog-entry";
import {Input, Output} from "@angular/core/src/metadata/directives";
import {BlogService} from "../services/blog-service";
import {MarkdownService} from "../services/markdown-service";

@Component({
  selector: 'blog-entry-form',
  template: `
<form #myForm="ngForm" novalidate>
  <div class="form-group row">
      <label for="blog-title" class="col-sm-2 form-control-label">Title</label>
      <div class="col-sm-10">
        <input required
             minlength="1"
             class="form-control"
             type="text" 
             name="title" 
             [(ngModel)]="editableBlogEntry.title">
      </div>
  </div>
  <div class="form-group row">
      <label for="blog-content" class="col-sm-2 form-control-label">Content</label>
     <div class="col-sm-10">
        <textarea id="blog-content"
            required
            minlength="1"
            class="form-control"
            name="contentMarkdown"
            (keyup)="render(editableBlogEntry)"
            [(ngModel)]="editableBlogEntry.contentMarkdown">
       </textarea>
    </div>
  </div>
  
  <button class="btn btn-primary" [ngClass]="myForm.valid ? '' : 'disabled'" (click)="emitBlogEntry()">Save</button>
  <h3>Content preview</h3>
  <div class="jumbotron">
     <div [innerHtml]="editableBlogEntry.contentRendered"></div>
  </div>
</form>`
})
export class BlogEntryFormComponent implements OnInit {
  @Input() blog: BlogEntry;
  @Output() submitted: EventEmitter<BlogEntry> = new EventEmitter();
  editableBlogEntry: BlogEntry;

  constructor(private markdownService: MarkdownService) {
    console.log('Starting BlogEntryFormComponent');
  }

  ngOnInit() {
    console.log('recieved blog entry', this.blog);
    console.dir(this.blog);
    console.log('cloning blog entry', this.blog);
    // set up state of editor
    this.editableBlogEntry = this.blog.clone();
  }

  emitBlogEntry() {
    console.log('anchors aweigh!');
    this.submitted.emit(this.editableBlogEntry);

  }

  render(blog: BlogEntry) {
    if (blog.contentMarkdown) {
      blog.contentRendered = this.markdownService.toHtml(blog.contentMarkdown);
    }
  }
}
