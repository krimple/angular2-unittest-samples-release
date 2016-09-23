import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BlogEntry} from '../domain/blog-entry';
import {BlogService} from '../services/blog.service';
import {MarkdownService} from '../services/markdown.service';

@Component({
    selector: 'blog-roll',
    providers: [BlogService, MarkdownService],
    templateUrl: 'blog-roll.component.html',
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
        this.editing = false;
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
        this.blog = new BlogEntry('', '', '', undefined);
        this.editing = true;
    }

    editBlogEntry(blog: BlogEntry) {
        this.editing = true;
        this.blog = blog;
    }

    saveOrUpdate(blog: BlogEntry) {
      console.log('got blog entry', blog);
        return this.blogService.saveBlog(blog)
            .subscribe( () => {
              // save is complete, wait to close out (third callback)
            },
            (err) => {
                alert(`Blog save failed. ${err}`);
            },
            () => {
              this.blog = null;
              this.editing = false;
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


