import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BlogEntry} from '../domain/blog-entry';
import {BlogService} from '../services/blog-service';
import {MarkdownService} from '../services/markdown-service';

@Component({
    providers: [BlogService, MarkdownService],
    template: `
   <div class="row">
     <div id="blog-editor-panel" class="col-sm-12" *ngIf="editing">
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
                    [(ngModel)]="blog.contentMarkdown"></textarea>
              </div>
          </div>
          <button class="btn btn-primary" (click)="saveBlogEntry(blog)">Save</button>
          <h3>Content preview</h3>
          <div class="jumbotron">
            <div [innerHtml]="blog.contentRendered"></div>
          </div>
       </form>
     </div>

      <div id="blog-roll-panel" class="col-sm-12" *ngIf="!editing">
      <p>
        <a (click)="newBlogEntry()">
           <i class="glyphicon glyphicon-plus-sign">
             Add...
           </i>
         </a>
      </p>
      <table class="table table-bordered table-condensed">
        <tr>
          <th>Actions</th>
          <th>Title</th>
          <th>Content</th>
        </tr>
        <tr class="rows" *ngFor="let blog of blogs">
         <td>
            <a href="#" (click)="editBlogEntry(blog)">
              <i class="glyphicon glyphicon-edit"></i>
            </a>
          &nbsp;
            <a href="#" (click)="deleteBlogEntry(blog)">
              <i class="glyphicon glyphicon-remove"></i>
            </a>
         </td>
         <td class="table-cell">
            <span class="title">{{ blog.title }}</span>
         </td>
         <td>
           <div [innerHtml]="blog.contentMarkdown"></div>
         </td>
        </tr>
      </table>
      </div>
  </div>
    `,
    selector: 'blog-roll'
})
export class BlogRollComponent implements OnInit {
    blogs: Array<BlogEntry>;
    blog: BlogEntry;

    editing: boolean = false;

    message: string;

    constructor(private blogService: BlogService,
                private markdownService: MarkdownService) {
    }

    ngOnInit() {
        this.loadBlogEntries();
    }

    refresh() {
        this.blog = undefined;
        this.loadBlogEntries();
    }

    loadBlogEntries() {
        this.blogService.getBlogs().subscribe(
            (data: Array<BlogEntry>) => {
                console.log('blog data arrived', data);
                this.blogs = data;
            },
            (error: Object) => {
                console.log('error!', error);
            }
        );
    }

    render(blog: BlogEntry) {
        if (blog.contentMarkdown) {
            blog.contentRendered = this.markdownService.toHtml(blog.contentMarkdown);
        }
    }

    newBlogEntry() {
        this.editing = true;
        this.blog = new BlogEntry('', '', '', undefined);
    }

    editBlogEntry(blog: BlogEntry) {
        this.editing = true;
        this.blog = blog;
    }

    saveBlogEntry(blog: BlogEntry) {
        return this.blogService.saveBlog(blog)
            .subscribe( () => {
              this.editing = false;
              this.blog = null;
            },
            (err) => {
                alert(`Blog save failed. ${err}`);
            },
            () => {
                this.refresh();
            });
    }

    deleteBlogEntry(blog: BlogEntry) {
        if (confirm(`Are you sure you want to delete this blog entry (${blog.title})?`)) {
            this.blogService.deleteBlogEntry(blog.id)
                .subscribe(
                    () => {
                        this.loadBlogEntries();
                        this.blog = undefined;
                    },
                    (err) => {
                        alert(`Delete failed. Reason: ${err}`);
                    });
        }
    }

    clearMessage() {
        this.message = undefined;
    }
}


