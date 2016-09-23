// added to types with typed
import * as marked from 'marked';

import {Injectable} from '@angular/core';

// todo - use module form of Markdown Converter library

@Injectable()
export class MarkdownService {
    // markdown object is not typescript

    toHtml(text: string) {
        return marked.parse(text);
    }
}
