import React from "react";
import { Markdown, Html } from "@react-email/components";

interface MarkdownProp {
  value: string;
}

export const InjectMarkdown = ({ value }: MarkdownProp) => {
  return (
    <Html lang="en" dir="ltr">
      <Markdown>{value}</Markdown>
    </Html>
  );
};
