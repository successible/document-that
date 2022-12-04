/* eslint-disable no-useless-escape */
/* eslint-disable sort/object-properties */

// Source: https://microsoft.github.io/monaco-editor/monarch.html

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

export const getWikiMarkdownLanguage = () => {
  return {
    defaultToken: '',
    tokenPostfix: '.md',

    // Escape codes
    control: /[\\`*_\[\]{}()#+\-\.!]/,
    noncontrol: /[^\\`*_\[\]{}()#+\-\.!]/,
    escapes: /\\(?:@control)/,

    // Escape codes for javascript/CSS strings
    jsescapes: /\\(?:[btnfr\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,

    // Non-matched elements
    empty: [
      'area',
      'base',
      'basefont',
      'br',
      'col',
      'frame',
      'hr',
      'img',
      'input',
      'isindex',
      'link',
      'meta',
      'param',
    ],

    tokenizer: {
      root: [
        // Headers (with #). We do support any other way of setting a header
        [
          /^(\s{0,3})(#+)((?:[^\\#]|@escapes)+)((?:#+)?)/,
          ['white', 'keyword', 'keyword', 'keyword'],
        ],

        // Custom: Quote with header, like > Note:
        // Capturing groups must be arrayed sequentially and on the top level
        [
          /(^>+ )(\w+: )/,
          [{ token: 'keyword' }, { token: 'keyword', next: '@quote' }],
        ],

        // Custom: Frontmatter start
        [
          /(^---)/,
          [
            {
              token: 'meta.separator',
              next: '@frontmatter',
              nextEmbedded: 'yaml',
            },
          ],
        ],

        // Quote without header
        [/^\s*>+/, { token: 'quote', next: '@quote' }],

        // List (starting with * or number)
        [/^\s*([\*\-+:]|\d+\.)\s/, 'keyword'],

        // Code block (4 spaces indent)
        [/^(\t|[ ]{4})[^ ].*$/, 'string'],

        // Code block (3 tilde)
        [
          /^\s*~~~\s*((?:\w|[\/\-#])+)?\s*$/,
          { token: 'string', next: '@codeblock' },
        ],

        // Github style code blocks (with backticks and language)
        [
          /^\s*```\s*((?:\w|[\/\-#])+)\s*$/,
          { token: 'string', next: '@codeblockgh', nextEmbedded: '$1' },
        ],

        // Github style code blocks (with backticks but no language)
        [/^\s*```\s*$/, { token: 'string', next: '@codeblock' }],

        // Markup within a quote or block of text
        { include: '@linecontent' },
      ],

      codeblock: [
        [/^\s*~~~\s*$/, { token: 'string', next: '@pop' }],
        [/^\s*```\s*$/, { token: 'string', next: '@pop' }],
        [/.*$/, 'variable.source'],
      ],

      quote: [
        // It is important for the @pop to be on the top.
        [/$/, { token: 'keyword', next: '@pop' }],
        // Includes all the styling for all the inline markdown stuff, like [], or **
        { include: '@linecontent' },
        // If the text is NOT wrapped in a [], ``, **, or _, make it the quote token
        // If you do have this, the text will be white instead of yellow
        // Inspired by: https://stackoverflow.com/questions/11324749/a-regex-to-detect-string-not-enclosed-in-double-quotes
        [/(?<![\S`*_\]\[])([^\s`*_\]\[]+)(?![\S`*_\]\[])/, 'quote'],
      ],

      // Custom: Block for frontmatter at the top of the markdown document, styled as yaml
      frontmatter: [
        [
          /^---/,
          { token: 'meta.separator', next: '@pop', nextEmbedded: '@pop' },
        ],
        [/.+/, 'variable.source'],
      ],

      // Block: Github style code blocks
      codeblockgh: [
        [
          /```\s*$/,
          { token: 'variable.source', next: '@pop', nextEmbedded: '@pop' },
        ],
        [/[^`]+/, 'variable.source'],
      ],

      // Source of the @linecontent variable
      linecontent: [
        // Escapes
        [/&\w+;/, 'string.escape'],
        [/@escapes/, 'escape'],

        // Various markup, like bold or underline
        [/\b__([^\\_]|@escapes|_(?!_))+__\b/, 'strong'],
        [/\*\*([^\\*]|@escapes|\*(?!\*))+\*\*/, 'strong'],
        [/\b_[^_]+_\b/, 'emphasis'],
        [/\*([^\\*]|@escapes)+\*/, 'emphasis'],
        [/`([^\\`]|@escapes)+`/, 'variable'],

        // Custom: Wiki-links, like [[foo]]
        [/(\[\[(?:[_A-Za-z\s\d-]*)\]\])/, 'wiki-link'],

        // Custom: Classic link, like [foo](bar)
        [/(\[\w.+?\])(\(.+?\))/, ['string.link', 'url']],

        // Custom: Footnote link, like [^1]: https://foo.com
        [/(\[\^\w+\]: )(.*)/, ['string.link', 'url']],

        // links
        [/\{+[^}]+\}+/, 'string.target'],
        [
          /(!?\[)((?:[^\]\\]|@escapes)*)(\]\([^\)]+\))/,
          ['string.link', '', 'string.link'],
        ],
        [/(!?\[)((?:[^\]\\]|@escapes)*)(\])/, 'string.link'],

        { include: 'html' },
      ],

      // Everything below this point is untouched and copied verbatim from the Monarch language for Markdown

      // Note: it is tempting to rather switch to the real HTML mode instead of building our own here
      // but currently there is a limitation in Monarch that prevents us from doing it: The opening
      // '<' would start the HTML mode, however there is no way to jump 1 character back to let the
      // HTML mode also tokenize the opening angle bracket. Thus, even though we could jump to HTML,
      // we cannot correctly tokenize it in that mode yet.
      html: [
        // html tags
        [/<(\w+)\/>/, 'tag'],
        [
          /<(\w+)/,
          {
            cases: {
              '@empty': { token: 'tag', next: '@tag.$1' },
              '@default': { token: 'tag', next: '@tag.$1' },
            },
          },
        ],
        [/<\/(\w+)\s*>/, { token: 'tag' }],

        [/<!--/, 'comment', '@comment'],
      ],

      comment: [
        [/[^<\-]+/, 'comment.content'],
        [/-->/, 'comment', '@pop'],
        [/<!--/, 'comment.content.invalid'],
        [/[<\-]/, 'comment.content'],
      ],

      // Almost full HTML tag matching, complete with embedded scripts & styles
      tag: [
        [/[ \t\r\n]+/, 'white'],
        [
          /(type)(\s*=\s*)(")([^"]+)(")/,
          [
            'attribute.name.html',
            'delimiter.html',
            'string.html',
            { token: 'string.html', switchTo: '@tag.$S2.$4' },
            'string.html',
          ],
        ],
        [
          /(type)(\s*=\s*)(')([^']+)(')/,
          [
            'attribute.name.html',
            'delimiter.html',
            'string.html',
            { token: 'string.html', switchTo: '@tag.$S2.$4' },
            'string.html',
          ],
        ],
        [
          /(\w+)(\s*=\s*)("[^"]*"|'[^']*')/,
          ['attribute.name.html', 'delimiter.html', 'string.html'],
        ],
        [/\w+/, 'attribute.name.html'],
        [/\/>/, 'tag', '@pop'],
        [
          />/,
          {
            cases: {
              '$S2==style': {
                token: 'tag',
                switchTo: 'embeddedStyle',
                nextEmbedded: 'text/css',
              },
              '$S2==script': {
                cases: {
                  $S3: {
                    token: 'tag',
                    switchTo: 'embeddedScript',
                    nextEmbedded: '$S3',
                  },
                  '@default': {
                    token: 'tag',
                    switchTo: 'embeddedScript',
                    nextEmbedded: 'text/javascript',
                  },
                },
              },
              '@default': { token: 'tag', next: '@pop' },
            },
          },
        ],
      ],

      embeddedStyle: [
        [/[^<]+/, ''],
        [
          /<\/style\s*>/,
          { token: '@rematch', next: '@pop', nextEmbedded: '@pop' },
        ],
        [/</, ''],
      ],

      embeddedScript: [
        [/[^<]+/, ''],
        [
          /<\/script\s*>/,
          { token: '@rematch', next: '@pop', nextEmbedded: '@pop' },
        ],
        [/</, ''],
      ],
    },
  } as monaco.languages.IMonarchLanguage
}
