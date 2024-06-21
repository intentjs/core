import React from "react";
import { Image } from "../components/Image";
import { Greetings } from "../components/Greetings";
import { ActionButton } from "../components/ActionButton";
import { Regards } from "../components/Regards";
import { Table } from "../components/Table";
import { InjectMarkdown } from "../components/InjectMarkdown";
import { InjectReactComponent } from "../components/InjectReactComponent";
import { CodeSnippets } from "../components/CodeSnippets";
import { CText } from "../components/CText";
import { CLink } from "../components/CLink";
import { HrLine } from "../components/HrLine";

export const COMPONENTS_MAP = {
  button: ({ className, value }) => (
    <ActionButton className={className} value={value} />
  ),

  code: ({ className, value }) => (
    <CodeSnippets className={className} value={value} />
  ),

  greeting: ({ className, value }) => (
    <Greetings className={className} value={value} />
  ),

  image: ({ className, value }) => (
    <Image className={className} value={value} />
  ),

  line: ({ className }) => <HrLine className={className} />,

  link: ({ className, value }) => <CLink className={className} value={value} />,

  markdown: ({ value }) => <InjectMarkdown value={value} />,

  reactComponent: ({ value }) => <InjectReactComponent value={value} />,

  regard: ({ className, value }) => (
    <Regards className={className} value={value} />
  ),

  table: ({ className, value }) => (
    <Table className={className} value={value} />
  ),

  text: ({ className, value }) => <CText className={className} value={value} />,
};
