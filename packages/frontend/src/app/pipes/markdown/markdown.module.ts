import {NgModule} from '@angular/core';
import {MarkdownPipe} from './markdown.pipe';
import {marked} from 'marked';
import Token = marked.Token;

@NgModule({
  declarations: [MarkdownPipe],
  exports: [MarkdownPipe],
})
export class MarkdownModule {
  constructor() {
    const walkTokens = (token: Token) => {
      if (token.type === 'image') {
        token.href = 'http://localhost:1337' + token.href;
      }
    };

    marked.use({walkTokens});
    marked.options({mangle: false, headerIds: false});
  }
}
