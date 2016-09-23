import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {AppShellComponent} from './app-shell/app-shell.component';
import {BlogRollComponent} from "./blog-roll/blog-roll.component";
import {BlogEntryFormComponent} from "./blog-entry-form/blog-entry-form.component";


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
