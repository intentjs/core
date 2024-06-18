import React from 'react';
import { Image } from 'components/Image';
import { Greetings } from 'components/Greetings';
import { ActionButton } from 'components/ActionButton';
import { Regards } from 'components/Regards';
import { Table } from 'components/Table';
import { InjectMarkdown } from 'components/InjectMarkdown';
import { InjectReactComponent } from 'components/InjectReactComponent';
import { CodeSnippets } from 'components/CodeSnippets';
import { CText } from 'components/CText';
import { CLink } from 'components/CLink';
import { HrLine } from 'components/HrLine';

export type ComponentType = keyof typeof COMPONENTS_MAP;

export const COMPONENTS_MAP = {
  button: (props: any) => <ActionButton {...props} />,
  code: (props: any) => <CodeSnippets {...props} />,
  greeting: (props: any) => <Greetings {...props} />,
  image: (props: any) => <Image {...props} />,
  line: (props: any) => <HrLine {...props} />,
  link: (props: any) => <CLink {...props} />,
  markdown: (props: any) => <InjectMarkdown {...props} />,
  reactComponent: (props: any) => <InjectReactComponent {...props} />,
  regard: (props: any) => <Regards {...props} />,
  table: (props: any) => <Table {...props} />,
  text: (props: any) => <CText {...props} />,
};
