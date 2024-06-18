import React from 'react';
import { Markdown, Html, Section } from '@react-email/components';

export const InjectMarkdown = ({ ...props }) => {
  return (
    <Section>
      <Markdown>{props.value}</Markdown>
    </Section>
  );
};
