import {Component, EventEmitter, OnInit} from '@angular/core';
import {BlogEntry} from "../domain/blog-entry";
import {Input, Output} from "@angular/core/src/metadata/directives";
import {MarkdownService} from "../services/markdown.service";

@Component({
  selector: 'blog-entry-form',
  templateUrl: 'blog-entry-form.component.html'
})
export class BlogEntryFormComponent implements OnInit {
  @Input() blog: BlogEntry;
  @Output() submitted: EventEmitter<BlogEntry> = new EventEmitter();
  @Output() cancelled: EventEmitter<any> = new EventEmitter();
  editableBlogEntry: BlogEntry;

  constructor(private markdownService: MarkdownService) { }

  ngOnInit() {
    this.editableBlogEntry = this.blog.clone();
  }

  emitBlogEntry() {
    console.log('anchors aweigh!');
    this.submitted.emit(this.editableBlogEntry);
  }

  emitCancelEdit() {
    // TODO - figure out non-data emitter since we don't care about a value
    this.cancelled.emit(true);
  }

  render(blog: BlogEntry) {
    if (blog.contentMarkdown) {
      blog.contentRendered = this.markdownService.toHtml(blog.contentMarkdown);
    }
  }
}
