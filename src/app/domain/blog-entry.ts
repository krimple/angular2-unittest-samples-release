export class BlogEntry {
  id: number;
  title: string;
  contentRendered: string;
  contentMarkdown: string;

  static asBlogEntries(jsonArray: Array<Object>) {
    return jsonArray.map((datum) => BlogEntry.asBlogEntry(datum));
  }

  static asBlogEntry(json: any) {
    let id: number = json['id'],
    title: string = json['title'],
    contentRendered: string = json['contentRendered'],
    contentMarkdown: string = json['contentMarkdown'];

    return new BlogEntry(title, contentRendered, contentMarkdown, id);
  }

  constructor(title: string, contentRendered: string, contentMarkdown: string, id: number) {
    this.title = title;
    this.contentRendered = contentRendered;
    this.contentMarkdown = contentMarkdown;
    if (id) {
      this.id = id;
    }
  }

  json() {
    return JSON.stringify(this);
  }


}
