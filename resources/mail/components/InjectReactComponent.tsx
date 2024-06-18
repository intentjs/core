import React from 'react';
import { CodeBlock, dracula } from '@react-email/code-block';
import { Section } from '@react-email/components';

export const InjectReactComponent = ({ ...props }) => {
  return (
    <Section className="mb-[20px]">
      <CodeBlock
        code={props.value.code}
        lineNumbers={props.value.lineNumbers}
        theme={dracula}
        language="javascript"
      />
    </Section>
  );
};
