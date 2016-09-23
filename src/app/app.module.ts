import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {AppShellComponent} from './app-shell/app-shell';
import {BlogRollComponent} from "./blog-roll/blog-roll";
import {BlogEntryFormComponent} from "./blog-entry-form/blog-entry-form";


@NgModule({
  declarations: [
    AppComponent,
    AppShellComponent,
    BlogRollComponent,
    BlogEntryFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
