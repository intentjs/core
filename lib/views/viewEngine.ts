import { Edge } from 'edgejs-cjs';
import { marked } from 'marked';
import { join } from 'path';

export class EdgeViewEngine {
  constructor() {}

  handle() {
    const edge = Edge.create({ cache: true });

    edge.mount(
      new URL(`file://${join(__dirname, '../../../../../', 'views')}`),
    );

    const markdown = {
      block: true,
      seekable: false,
      tagName: 'markdown',
      compile(parser, buffer, token) {
        const mdStr = token.children
          .map((c) => c.value?.trim())
          .filter((v) => v)
          .join('\n');
        // const markdown = marked({ html: true });
        const result = marked.parse(mdStr);
        console.log(mdStr);
        buffer.outputRaw(result);
      },
    };

    edge.registerTag(markdown);

    return edge;
  }
}
